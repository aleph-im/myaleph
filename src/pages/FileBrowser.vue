<template>
  <q-page padding>

    <q-dialog v-model="upload_shown" position="bottom">
      <aleph-uploader
        url="http://localhost:8080/upload"
        style="max-width: 300px"
        :max-file-size="4194304"
        auto-upload
        multiple
        @uploaded="uploaded"
        ref="uploader"
        encrypt
      />
    </q-dialog>

    <vue-easy-lightbox
      :visible="lbvisible"
      :imgs="lbimgs"
      :index="lbidx"
      @hide="image_hide"
    ></vue-easy-lightbox>
    <div class="row justify-between items-center">
      <q-btn v-if="folder" round flat icon="arrow_back"
        :to="folder_object.content.ref ? {'name': 'folder', params:{'folder': folder_object.content.ref}} : {'name': 'files'} " />
      <span v-if="folder" class="col-grow">
        <h4 class="q-my-sm col-grow">{{folder_object.content.filename}}</h4>
      </span>
      <h4 v-else class="q-my-sm col-grow">Files</h4>
      <div>
        <template v-if="$q.screen.gt.xs">
          {{show_archived?'archived visible':''}}
        </template>
        <q-toggle
          v-model="show_archived"
          checked-icon="archive"
          color="green"
          unchecked-icon="visibility_off"
        />
        <q-tooltip>Display archived items</q-tooltip>
      </div>
    </div>
    <q-breadcrumbs class="text-grey">
      <q-breadcrumbs-el icon="home" :to="{'name': 'home'}" label="Home" />
      <q-breadcrumbs-el icon="insert_drive_file" :to="{'name': 'files'}" label="Files" />
      <q-breadcrumbs-el 
      v-for="f of breadcrumbs" :key="f.hash"
      :to="{'name': 'folder', params: {'folder': f.hash}}"
      icon="folder"
      :label="f.name" />
      <q-breadcrumbs-el v-if="this.folder" :label="this.folder_object.content.filename" icon="folder" />
    </q-breadcrumbs>
    <files-list :files="displayed_files" virtual-scroll flat class="q-my-md"
                @item-clicked="file_clicked" />
    <!-- <p v-else>
      No note here yet... Why not <router-link :to="{'name': 'new-note'}">write one</router-link>?
    </p> -->

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        color="primary"
      >
        <q-fab-action @click="create_folder" color="primary" icon="create_new_folder">
          <q-tooltip anchor="center left" self="center right">New folder</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="upload" color="primary" icon="cloud_upload">
          <q-tooltip anchor="center left" self="center right">Upload file</q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
import { encrypt_content, decrypt_content } from '../services/encryption.js'
import { retrieve_file_url } from '../services/files'
import AlephUploader from '../components/Uploader.js'
import FilesList from '../components/FilesList'
import NotesList from '../components/NotesList'
import downscale from 'downscale'
export default {
  name: 'FileBrowser',
  computed: {
    displayed_files() {
      let files = this.files
      if (this.folder)
        files = files.filter((v) => v.original_ref == this.folder)
      else
        files = files.filter((v) => (!v.original_ref))

      if (!this.show_archived)
        files = files.filter((v) => (v.content.status==='visible'))

      files.sort((f1, f2) => {
        if (f1.original_type == 'file' && f2.original_type == 'folder') return 1;
        if (f1.original_type == 'folder' && f2.original_type == 'file') return -1;

        if (this.sorting === 'time') {
          if (f1.time < f2.time) return 1;
          if (f2.time < f1.time) return -1;
        }
      })
      return files
    },
    folder_object() {
      if (!this.folder)
        return
      
      return this.files.find((v) => v.hash === this.folder)
    },
    breadcrumbs() {
      if (!this.folder)
        return []
      // if (!this.folder_object.content.ref)
      //   return []

      let steps = []
      
      let last_ref = this.folder_object.original_ref
      while (last_ref) {
        let fo = this.files.find((v) => v.hash === last_ref)
        if (fo) {
          steps.push({
            name: fo.content.filename,
            hash: fo.hash
          })
          last_ref = fo.original_ref
        } else
          return steps
      }
      return steps
    },
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'files'
    ])
  },
  props: {
    folder: String
  },
  data() {
    return {
      upload_shown: false,
      loading: false,
      current_folder: null,
      show_archived: false,
      sorting: 'time',
      lbimgs: '',  // Img Url , string or Array
      lbvisible: false,
      lbidx: 0   // default: 0
    }
  },
  components: {
    AlephUploader,
    FilesList
  },
  methods: {
    async getFiles() {
      await this.$store.dispatch('update_files')
    },
    async refresh() {
      this.loading = true
      await this.getFiles()
      this.loading = false
    },
    async upload() {
      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

      this.upload_shown = true
      await sleep(10)
      this.$refs.uploader.pickFiles()
    },
    async create_folder() {
      this.$q.dialog({
        // dark: true,
        title: 'Create new folder',
        message: 'Folder name:',
        prompt: {
          // model: '',
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(async data => {
        if (!data)
          return
        let post_content = {
          filename: data,
          status: 'visible' // default status
        }

        let unencrypted_content = {}
        Object.keys(post_content).forEach(function(key) {
            unencrypted_content[ key ] = post_content[ key ]
        })

        encrypt_content(post_content, ['filename'], this.account['public_key'])

        let msg = await posts.submit(
          this.account.address, 'folder', post_content,
          {channel: this.channel,
           api_server: this.api_server,
           account: this.account,
           ref: this.folder})
        
        msg.content = unencrypted_content
        msg.hash = msg.item_hash
        msg.type = 'folder'
        msg.original_type = 'folder'
        msg.ref = this.folder
        msg.original_ref = this.folder
        this.$store.commit('add_file', msg)
      })
    },
    async uploaded(info) {
      this.upload_shown = false
      for (let file of info) {
        let post_content = {
          filename: file.name,
          mimetype: file.type,
          private: file.private,
          store_message: file.message_hash,
          hash: file.item_hash,
          engine: file.item_type,
          status: 'visible', // default status
          size: file.size,
          full_size: file.encrypted_size
        }
        if (file.type.startsWith("image")) {
          let canvas = await downscale(file, 200, 0, {returnCanvas: 1})
          post_content['thumbnail_url'] = canvas.toDataURL('image/jpeg', 0.9)
        }

        let unencrypted_content = {};
        Object.keys(post_content).forEach(function(key) {
            unencrypted_content[ key ] = post_content[ key ]
        })

        if (file.private)
          encrypt_content(post_content, ['filename', 'mimetype', 'thumbnail_url'], this.account['public_key'])

        let msg = await posts.submit(
          this.account.address, 'file', post_content,
          {channel: this.channel,
           api_server: this.api_server,
           account: this.account,
           ref: this.folder})
        
        msg.content = unencrypted_content
        msg.hash = msg.item_hash
        msg.type = 'file'
        msg.original_type = 'file'
        msg.ref = this.folder
        msg.original_ref = this.folder
        this.$store.commit('add_file', msg)
      }
    },
    async file_clicked(file) {
      if (file.content.mimetype.startsWith('image/')) {
        this.lbimgs = [
          await retrieve_file_url(file, this.account, this.api_server,
            {revoke_timeout: 1000}
          )]
        this.lbidx = 0
        this.lbvisible = true
      }
    },
    async image_hide() {
      this.lbvisible = false
    }
  },
  watch: {
    async $route(to, from) {
    },
    async current_page() {
    }
  },
  async created() {
    if (!this.files.length)
      await this.refresh()
  }
}
</script>
