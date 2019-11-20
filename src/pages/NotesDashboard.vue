<template>
  <q-page padding>
    <p v-if="notes.length">
      You have written {{notes.length}} notes so far, good job!
    </p>
    <p v-else>
      No note here yet... Why not <router-link :to="{'name': 'new-note'}">write one</router-link>?
    </p>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
export default {
  name: 'PageIndex',
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'notes'
    ])
  },
  data() {
    return {
    }
  },
  methods: {
    async refresh() {

    }
  },
  watch: {
    async $route(to, from) {
      // await this.getProfile()
      // await this.getPosts()
    },
    async current_page() {
      // await this.getPosts()
    }
  },
  async created() {
    await this.refresh()
    // bus.$on('broadcasted', () => {
    //   setTimeout(this.refresh, 5000);
    //   setTimeout(this.refresh, 10000)
    // })
  }
}
</script>
