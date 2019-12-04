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
    <p>
      Warning: The files section is still an heavy work in progress.
      To test the myaleph features, try the Notes section instead.
    </p>
    <div v-if="files.length">
      <files-list :files="files"
      virtual-scroll flat />
    </div>
    <!-- <p v-else>
      No note here yet... Why not <router-link :to="{'name': 'new-note'}">write one</router-link>?
    </p> -->

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        color="primary"
      >
        <q-fab-action @click="create_folder" color="primary" icon="create_new_folder" />
        <q-fab-action @click="upload" color="primary" icon="cloud_upload" />
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
import AlephUploader from '../components/Uploader.js'
import FilesList from '../components/FilesList'
import NotesList from '../components/NotesList'
import downscale from 'downscale'
export default {
  name: 'FileBrowser',
  computed: {
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
      current_folder: null
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
          ref: this.folder,
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
           account: this.account})
        
        msg.content = unencrypted_content
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
          ref: this.folder,
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
           account: this.account})
        
        msg.content = unencrypted_content
        this.$store.commit('add_file', msg)
      }
    }
  },
  watch: {
    async $route(to, from) {
    },
    async current_page() {
    }
  },
  async created() {
    await this.refresh()
  }
}
</script>
