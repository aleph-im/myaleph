<template>
  <q-table
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
  </q-table>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption, store } from 'aleph-js'
import moment from 'moment'
import { format } from 'quasar'
const { humanStorageSize } = format
export default {
  name: 'files-list',
  props: {
    'files': Array,
    'title': String,
    'flat': Boolean,
    'virtualScroll': Boolean
  },
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
  methods: {
    async download(filepost) {
      console.log(this.account)
      let content = await store.retrieve(filepost.content.hash, {api_server: this.api_server})
      console.log(content)
      if (filepost.content.private) {
        content = encryption.decrypt(this.account, content, {as_hex: false, as_string: false})
      }
      console.log(content.length)

      const data = new Blob([content], {type: filepost.content.mimetype})
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(data)
      link.download=filepost.content.filename
      link.click()

      setTimeout(function(){
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 100);
    }
  },
  data() {
    return {
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