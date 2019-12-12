<template>
  <router-view />
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'OutsideLayout',
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'files'
    ])
  }
}
</script>
