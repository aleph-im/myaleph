<template>
  <q-list :bordered="bordered" class="rounded-borders">
    <q-item-label header v-if="title">{{title}}</q-item-label>
    <template v-for="(file, index) of files">
      <q-item :key="file.item_hash"
              :to="file.original_type === 'folder' ? {'name': 'folder', params: {'folder': file.hash}} : null"
              clickable :class="file.content.status === 'archived' ? 'text-grey-8 text-strike' : ''">
        <q-item-section avatar top @click="$emit('item-clicked', file)">
            <q-avatar rounded size="48px" v-if="file.content.thumbnail_url">
              <img :src="file.content.thumbnail_url" style="object-fit: cover;" />
            </q-avatar>
            <q-avatar size="48px" v-else-if="file.original_type === 'folder'" icon="folder" color="primary" text-color="white" />
            <q-avatar size="48px" v-else icon="document" color="secondary" text-color="white" />
        </q-item-section>
        <q-item-section @click="$emit('item-clicked', file)">
          <q-item-label lines="1">{{file.content.filename}}</q-item-label>
          <q-item-label caption>{{file.time * 1000 | moment("LLL")}}</q-item-label>
        </q-item-section>
        <q-item-section side top v-if="file.content.size">
          {{humanStorageSize(file.content.size)}}
        </q-item-section>
        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs" v-if="file.original_type === 'file'">
            <q-btn flat dense round class="gt-xs"
                  size="12px" icon="cloud_download" @click="download(file)">
              <q-tooltip>Download file</q-tooltip>
            </q-btn>
            <q-btn class="gt-xs" size="12px" flat dense round icon="archive"
                  @click="archive(file)" v-if="file.content.status === 'visible'">
              <q-tooltip>Archive file</q-tooltip>
            </q-btn>
            <q-btn class="gt-xs" size="12px" flat dense round icon="unarchive"
                  @click="unarchive(file)" v-else>
              <q-tooltip>Un-Archive file</q-tooltip>
            </q-btn>
            <q-btn size="12px" class="lt-sm" flat dense round icon="more_vert">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup @click="download(file)">
                    <q-item-section avatar>
                      <q-icon color="primary" name="cloud_download" />
                    </q-item-section>
                    <q-item-section>Download</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="archive(file)" v-if="file.content.status === 'visible'">
                    <q-item-section avatar>
                      <q-icon color="primary" name="archive" />
                    </q-item-section>
                    <q-item-section>Archive</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="unarchive(file)" v-else>
                    <q-item-section avatar>
                      <q-icon color="primary" name="unarchive" />
                    </q-item-section>
                    <q-item-section>Un-Archive</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-item-section>
      </q-item>
      <q-separator spaced :key="'sep'+file.item_hash" v-if="index < (files.length-1)" />
    </template>
  </q-list>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption, store } from 'aleph-js'
import { encrypt_content, decrypt_content } from '../services/encryption.js'
import moment from 'moment'
import {download_file} from '../services/files'
import { format } from 'quasar'
const { humanStorageSize } = format
export default {
  name: 'files-list',
  props: {
    'files': Array,
    'title': String,
    'flat': Boolean,
    'virtualScroll': Boolean,
    'bordered': Boolean
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
      await download_file(filepost, this.account, this.api_server)
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

      if (post_content.private)
        encrypt_content(post_content, ['filename', 'mimetype', 'thumbnail_url'], this.account['public_key'])

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
  },
  data() {
    return {
      humanStorageSize: humanStorageSize,
      pagination: {
        rowsPerPage: 0
      }
    }
  }
}
</script>