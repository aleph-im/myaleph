<template>
  <!-- <q-table
    :title="title ? title : 'Files'"
    :data="files"
    :columns="file_columns"
    row-key="filename"
    :virtual-scroll="virtualScroll"
    :flat="flat"
    :pagination.sync="pagination"
    :rows-per-page-options="virtualScroll ? [0] : undefined">
    <template v-slot:body-cell-thumbnail="props">
      <q-td :props="props">
        <div>
          <q-avatar rounded size="48px" v-if="props.value">
            <img :src="props.value" style="object-fit: cover;" />
          </q-avatar>
          <q-avatar rounded size="48px" v-else-if="props.row.type === 'folder'" icon="folder" />
          <q-avatar rounded size="48px" v-else icon="document" />
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn v-if="props.row.type === 'file'" flat round
        color="grey" icon="cloud_download" @click="download(props.row)" />
      </q-td>
    </template>
  </q-table> -->
  <q-list :bordered="bordered" class="rounded-borders">
    <q-item-label header v-if="title">{{title}}</q-item-label>
    <template v-for="(file, index) of files">
      <q-item :key="file.item_hash"
              :to="file.type === 'folder' ? {'name': 'folder', params: {'folder': file.hash}} : null"
              clickable>
        <q-item-section avatar top @click="$emit('item-clicked', file)">
            <q-avatar rounded size="48px" v-if="file.content.thumbnail_url">
              <img :src="file.content.thumbnail_url" style="object-fit: cover;" />
            </q-avatar>
            <q-avatar size="48px" v-else-if="file.type === 'folder'" icon="folder" color="primary" text-color="white" />
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
          <div class="text-grey-8 q-gutter-xs" v-if="file.type === 'file'">
            <q-btn flat dense round class="gt-xs"
                  size="12px" icon="cloud_download" @click="download(file)">
              <q-tooltip>Download file</q-tooltip>
            </q-btn>
            <q-btn class="gt-xs" size="12px" flat dense round icon="archive"
                  @click="archive(file)">
              <q-tooltip>Archive file</q-tooltip>
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
                  <q-item clickable v-close-popup @click="archive(file)">
                    <q-item-section avatar>
                      <q-icon color="primary" name="archive" />
                    </q-item-section>
                    <q-item-section>Archive</q-item-section>
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
    }
  },
  data() {
    return {
      humanStorageSize: humanStorageSize,
      pagination: {
        rowsPerPage: 0
      },
      file_columns: [
        {
          name: 'thumbnail',
          align: 'left',
          field: row => row.content.thumbnail_url,
          classes: 'thumbnail-col'
        },
        {
          name: 'filename',
          required: true,
          label: 'Filename',
          align: 'left',
          sortable: true,
          field: row => row.content.filename,
          classes: 'filename-col'
        },
        // {
        //   name: 'mimetype',
        //   align: 'left',
        //   label: 'Mime-Type',
        //   sortable: true,
        //   field: row => row.content.mimetype
        // },
        {
          name: 'size',
          align: 'left',
          label: 'Size',
          sortable: true,
          field: row => row.content.size,
          'format': val => val ? humanStorageSize(val) : '--'
        },
        {
          name: 'time',
          align: 'left',
          label: 'Time',
          sortable: true,
          field: row => row.time,
          'format': val => moment.unix(val).fromNow()
        },
        {
          name: 'actions',
          align: 'left',
          sortable: true
        }
      ]
    }
  }
}
</script>