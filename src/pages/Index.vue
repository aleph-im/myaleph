<template>
  <q-page>
    <div v-if="account">
      <submit-content></submit-content>
    </div>
    <div v-else>
      not logged
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
import SubmitContent from '../components/SubmitContent.vue'
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
    }
  },
  mounted() {
    if (this.account) {
      this.$router.push({'name': 'profile'})
    } else
      this.$router.push({'name': 'landing'})
  },
  components: {SubmitContent}
}
</script>
