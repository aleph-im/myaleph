<template>
  <q-page>
    <div v-if="account">
      logged
      <q-btn color="primary" @click="blah">
        blah
      </q-btn>
    </div>
    <div v-else>
      not logged
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates } from 'aleph-js'
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
      await aggregates.submit(this.account.address, "test", {
        'blah': 'bluh'
      }, {
        api_server: this.api_server,
        account: this.account,
        channel: this.channel
      })
    }
  }
}
</script>
