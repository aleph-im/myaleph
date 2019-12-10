<template>
  <q-btn :size="size?size:'12px'" flat dense round icon="more_vert">
      <q-menu>
      <q-list style="min-width: 100px">
          <q-item clickable v-close-popup @click="download(file)"  v-if="file.original_type === 'file'">
          <q-item-section avatar>
              <q-icon color="primary" name="cloud_download" />
          </q-item-section>
          <q-item-section>Download</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click.prevent="archive(file)" v-if="file.content.status === 'visible'">
          <q-item-section avatar>
              <q-icon color="primary" name="archive" />
          </q-item-section>
          <q-item-section>Archive</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click.prevent="unarchive(file)" v-else>
          <q-item-section avatar>
              <q-icon color="primary" name="unarchive" />
          </q-item-section>
          <q-item-section>Un-Archive</q-item-section>
          </q-item>
      </q-list>
      </q-menu>
  </q-btn>
</template>


<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption, store } from 'aleph-js'
import { encrypt_content, decrypt_content } from '../services/encryption.js'
import moment from 'moment'
import {navigate_to_file} from '../services/files'
import { format } from 'quasar'
const { humanStorageSize } = format
export default {
  name: 'files-menu',
  props: {
    'file': Object,
    'size': String
  },
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel'
    ])
  },
  methods: {
    async download(filepost) {
      this.$q.loadingBar.start()
      await navigate_to_file(filepost, this.account, this.api_server, {download: true})
      this.$q.loadingBar.stop()
    },
    async archive(filepost) {
      await this.change_status(filepost, 'archived')
    },
    async unarchive(filepost) {
      await this.change_status(filepost, 'visible')
    },
    async change_status(filepost, new_status) {
      let post_content = {};
      Object.keys(filepost.content).forEach(function(key) {
          post_content[key] = filepost.content[key]
      })
      post_content['status'] = new_status
      let unencrypted_content = {};
      Object.keys(filepost.content).forEach(function(key) {
          unencrypted_content[key] = post_content[key]
      })

      if ((post_content.private === undefined)||(post_content.private)) {
        post_content['private'] = true
        encrypt_content(post_content, ['filename', 'mimetype', 'thumbnail_url'], this.account['public_key'])
      }

      let msg = await posts.submit(
        this.account.address, 'amend', post_content,
        {channel: this.channel,
          api_server: this.api_server,
          account: this.account,
          ref:filepost.hash})
      msg.hash = filepost.hash
      msg.original_type = filepost.original_type
      msg.content = unencrypted_content
      msg.original_ref = filepost.original_ref
      this.$store.commit('update_file', msg)
    }
  }
}
</script>