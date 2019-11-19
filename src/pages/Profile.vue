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
      profile() {
          let address = this.address
          if (!address)
            address = this.account.address
      },
      ... mapState([
        // map this.count to store.state.count
        'account',
        'network_id',
        'api_server',
        'channel'
      ])
  },
  props: ['address'],
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
      if ((!this.address)&&(!this.account)) {
        this.$router.push({'name': 'login'})
      }
  },
  components: {SubmitContent}
}
</script>
