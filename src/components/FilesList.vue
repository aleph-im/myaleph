<template>
  <q-table
    :title="title ? title : 'Files'"
    :data="files"
    :columns="file_columns"
    row-key="filename"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]">
    <template v-slot:body-cell-thumbnail="props">
      <q-td :props="props">
        <div>
          <q-avatar rounded size="48px" v-if="props.value">
            <img :src="props.value" style="object-fit: cover;" />
          </q-avatar>
        </div>
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
    'files': Array
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
        }
      ]
    }
  }
}
</script>