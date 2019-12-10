<template>
  <q-list :bordered="bordered" :dense="dense" class="rounded-borders">
    <q-item-label header v-if="title">{{title}}</q-item-label>
    <template v-for="(file, index) of files">
      <q-item :key="file.item_hash"
              clickable :class="file.content.status === 'archived' ? 'text-grey-8 text-strike' : ''">
        <q-item-section avatar top @click="file_clicked(file)">
            <q-avatar rounded :size="dense?'24px':'48px'" v-if="file.content.thumbnail_url">
              <img :src="file.content.thumbnail_url" style="object-fit: cover;" />
            </q-avatar>
            <q-avatar :size="dense?'24px':'48px'" v-else-if="file.original_type === 'folder'" icon="folder" color="primary" text-color="white" />
            <q-avatar :size="dense?'24px':'48px'" v-else :icon="get_icon(file)" color="secondary" text-color="white" />
        </q-item-section>
        <q-item-section @click="file_clicked(file)">
          <q-item-label lines="1">{{file.content.filename}}</q-item-label>
          <q-item-label caption v-if="!dense">{{file.time * 1000 | moment("LLL")}}</q-item-label>
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
      <q-separator spaced :key="'sep'+file.item_hash" v-if="!dense && (index < (files.length-1))" />
    </template>
  </q-list>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption, store } from 'aleph-js'
import { encrypt_content, decrypt_content } from '../services/encryption.js'
import {navigate_to_file, retrieve_file_url} from '../services/files.js'
import FileMenu from './FileMenu'
import moment from 'moment'

import { format } from 'quasar'
const { humanStorageSize } = format



export default {
  name: 'files-list',
  props: {
    'files': Array,
    'title': String,
    'flat': Boolean,
    'virtualScroll': Boolean,
    'bordered': Boolean,
    'dense': Boolean
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
    get_icon(file) {
      return "fas fa-" + this.mimetype2fa(file.content.mimetype)
    },
    async file_clicked(file) {
      this.$emit('item-clicked', file)
      let mimetype = file.content.mimetype
      if (mimetype)
        if (mimetype.startsWith('image/')) {
          this.$q.loadingBar.start()
          let file_url = await retrieve_file_url(
            file, this.account, this.api_server,
              {revoke_timeout: 1000})
          if (file_url) {
            this.$root.$emit('open_lightbox', [file_url], 0)
          } else {
            this.$q.notify({
              message: "Can't load file",
              color: "negative"
            })
          }
          this.$q.loadingBar.stop()
        } else {
          await navigate_to_file(file, this.account, this.api_server, {download: true})
        }
      if (file.original_type === 'folder') {
        this.$router.push({'name': 'folder', params: {'folder': file.hash}})
      }
    },
    
    match(mimetype, cond) {
      if (Array.isArray(cond)) {
        return cond.reduce((v, c) => (
          v || this.match(mimetype, c)
        ), false)
      } else if (cond instanceof RegExp) {
        return cond.test(mimetype)
      } else if (cond === undefined) {
        return true
      } else {
        return mimetype === cond
      }
    },

    resolve (mimetype) {
      if (this.cache[mimetype]) {
        return this.cache[mimetype]
      }

      for (var i = 0; i < this.mapping.length; i++) {
        if (this.match(mimetype, this.mapping[i][1])) {
          this.cache[mimetype] = this.mapping[i][0]
          return this.mapping[i][0]
        }
      }
    },

    mimetype2fa (mimetype, options) {
      options = Object.assign({ version: 5 }, options)
      if (typeof mimetype === 'object') {
        options = Object.assign(options, mimetype)
        return function (mimetype) {
          return this.mimetype2fa(mimetype, options)
        }
      } else {
        var icon = this.resolve(mimetype)

        if (icon && options.prefix) {
          icon = options.prefix + icon
        }
        return icon
      }
    }
  },
  data() {
    return {
      humanStorageSize: humanStorageSize,
      pagination: {
        rowsPerPage: 0
      },
      cache: {},
      mapping: [
        // Images
        [ 'file-image', /^image\// ],
        // Audio
        [ 'file-audio', /^audio\// ],
        // Video
        [ 'file-video', /^video\// ],
        // Documents
        [ 'file-pdf', 'application/pdf' ],
        [ 'file-alt', 'text/plain' ],
        [ 'file-code', [
          'text/html',
          'text/javascript'
        ] ],
        // Archives
        [ 'file-archive', [
          /^application\/x-(g?tar|xz|compress|bzip2|g?zip)$/,
          /^application\/x-(7z|rar|zip)-compressed$/,
          /^application\/(zip|gzip|tar)$/
        ] ],
        // Word
        [ 'file-word', [
          /ms-?word/,
          'application/vnd.oasis.opendocument.text',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ] ],
        // Powerpoint
        [ 'file-powerpoint', [
          /ms-?powerpoint/,
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ] ],
        // Excel
        [ 'file-excel', [
          /ms-?excel/,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ] ],
        // Default, misc
        [ 'file' ]
      ]
    }
  }
}
</script>