<template>
  <q-page>
      blah
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
export default {
  name: 'Home',
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
  },
  mounted() {
  },
  components: {

  }
}
</script>
