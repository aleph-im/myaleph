<template>
  <q-page padding>
    blah
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
      'channel'
    ])
  },
  data() {
    return {
      notes: {}
    }
  },
  methods: {
    async blah() {
      console.log("blah")
      await posts.submit(this.account.address, "test", {
        'blah': 'bluh'
      }, {
        api_server: this.api_server,
        account: this.account,
        channel: this.channel
      })
    },
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
