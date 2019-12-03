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
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat round color="grey" icon="cloud_download" />
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
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