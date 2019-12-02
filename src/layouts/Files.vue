<template>
  <q-page>
    <div v-if="account">
        <router-view />
    </div>
    <div v-else>
      Please log in.
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
import NotesList from '../components/NotesList'
export default {
  name: 'FilesLayout',
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'files'
    ]),
    is_home() {
      return (this.$route.name === 'files')
    }
  },
  data() {
    return {
    }
  },
  components: {
  },
  methods: {
  },
  watch: {
    async $route(to, from) {
    },
    async current_page() {
    }
  },
  async created() {
    // await this.refresh()
  }
}
</script>
