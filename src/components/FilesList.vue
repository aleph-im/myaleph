<template>
  <q-list :bordered="bordered" class="rounded-borders">
    <q-item-label header v-if="title">{{title}}</q-item-label>
    <template v-for="(file, index) of files">
      <q-item :key="file.item_hash"
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
          <div class="text-grey-8 q-gutter-xs">
            <file-menu :file="file" size="12px" />
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
import FileMenu from './FileMenu'
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
  components: {FileMenu},
  methods: {
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