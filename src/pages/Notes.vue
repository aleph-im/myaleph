<template>
  <q-page>
    <div v-if="account" class="flex">
      <q-splitter
      v-model="splitterModel"
      >

      <template v-slot:before>
        a

      </template>

      <template v-slot:after>
        b
      </template>

      </q-splitter>
    </div>
    <div v-else>
      Please log in.
    </div>
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
  }
}
</script>
