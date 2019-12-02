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

    <p v-if="files.length">
      You have uploaded {{files.length}} files so far, good job!
    </p>
    <p v-else>
      No note here yet... Why not <router-link :to="{'name': 'new-note'}">write one</router-link>?
    </p>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        color="primary"
      >
        <q-fab-action color="primary" icon="create_new_folder" />
        <q-fab-action @click="upload" color="primary" icon="cloud_upload" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
import AlephUploader from '../components/Uploader.js'
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
  data() {
    return {
      upload_shown: false
    }
  },
  components: {
    AlephUploader
  },
  methods: {
    async getFiles() {
      await this.$store.dispatch('update_files')
    },
    async refresh() {
      await this.getFiles()
    },
    async upload() {
      const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

      this.upload_shown = true
      await sleep(10)
      this.$refs.uploader.pickFiles()
    },
    async uploaded(info) {
      console.log(info)
      this.upload_shown = false
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
