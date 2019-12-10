<template>
  <q-page padding>

    <q-dialog v-model="upload_shown" position="bottom">
      <aleph-uploader
        url="http://localhost:8080/upload"
        style="max-width: 300px"
        auto-upload
        multiple
        @uploaded="uploaded"
        ref="uploader"
        encrypt
      />
    </q-dialog>
    <q-pull-to-refresh @refresh="_refresh" ref="refresher">
      <div class="row justify-between items-center">
        <q-btn v-if="folder" round flat icon="arrow_back"
          :to="folder_object.content.ref ? {'name': 'folder', params:{'folder': folder_object.content.ref}} : {'name': 'files'} " />
        <span v-if="folder" class="col-grow">
          <h4 class="q-my-sm col-grow">
            <q-icon name="archive" v-if="folder_object.content.status === 'archived'" color="grey" />
            {{folder_object.content.filename}}
          </h4>
        </span>
        <h4 v-else class="q-my-sm col-grow">
          Files
        </h4>
        <div class="col-md-2">
          <q-select v-model="sorting"
          :options="sort_options" emit-value map-options
          label="Sort by" round dense flat options-dense />
        </div>
        <div>
          <!-- <template v-if="$q.screen.gt.xs">
            {{show_archived?'archived visible':''}}
          </template> -->
          <q-toggle
            v-model="show_archived"
            checked-icon="archive"
            color="blue"
            unchecked-icon="visibility_off"
          />
          <q-tooltip>Display archived items</q-tooltip>
        </div>
        <file-menu v-if="folder" :file="folder_object" size="md" />
      </div>
      <q-breadcrumbs class="text-grey">
        <!-- <q-breadcrumbs-el icon="home" :to="{'name': 'home'}" label="Home" /> -->
        <q-breadcrumbs-el icon="insert_drive_file" :to="{'name': 'files'}" label="Files" />
        <q-breadcrumbs-el 
        v-for="f of breadcrumbs" :key="f.hash"
        :to="{'name': 'folder', params: {'folder': f.hash}}"
        icon="folder"
        :label="f.name" />
        <q-breadcrumbs-el v-if="this.folder" :label="this.folder_object.content.filename" icon="folder" />
      </q-breadcrumbs>

      <files-list :files="displayed_files" virtual-scroll flat class="q-my-md" />
    </q-pull-to-refresh>
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
import FileMenu from '../components/FileMenu'
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
        console.log(this.sorting)
        if (this.sorting === 'time') {
          if (f1.time < f2.time) return 1;
          if (f2.time < f1.time) return -1;
        }
        if (this.sorting === 'name') {
          if (f1.content.filename.toLowerCase() < f2.content.filename.toLowerCase()) return -1;
          if (f2.content.filename.toLowerCase() < f1.content.filename.toLowerCase()) return 1;
        }
        if (this.sorting === 'size') {
          if (f1.content.size < f2.content.size) return 1;
          if (f2.content.size < f1.content.size) return -1;
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
      sort_options: [
        {
          label: 'Last updated',
          value: 'time'
        },
        {
          label: 'Name',
          value: 'name'
        },
        {
          label: 'Size',
          value: 'size'
        }
      ]
    }
  },
  components: {
    AlephUploader,
    FilesList,
    FileMenu
  },
  methods: {
    async getFiles(progress) {
      await this.$store.dispatch('update_files', progress)
    },
    async refresh() {
      this.$refs.refresher.trigger()
    },
    async _refresh(done) {
      async function progress(percent) {
        this.$q.loadingBar.increment(0.2+(0.8*percent))
      }
      // this.loading = true
      this.$q.loadingBar.start()
      this.$q.loadingBar.increment(0.2)
      await this.getFiles(progress.bind(this))
      if (done)
        done()
      this.$q.loadingBar.stop()
      // this.loading = false
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
          private: true,
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
      this.$q.loadingBar.start()
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
        this.$q.loadingBar.increment(1/info.length/2)

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
        this.$q.loadingBar.increment(1/info.length/2)
      }
      this.$q.loadingBar.stop()
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
      setTimeout(this.refresh.bind(this), 100)
  }
}
</script>
