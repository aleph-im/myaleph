<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'profiles'
    ])
  },
  watch: {
    async account() {
      if (this.account !== null) {
        await this.$store.dispatch('update_balance')
      }
    }
  },
  async mounted() {
    if (this.account !== null) {
      await this.$store.dispatch('update_balance')
    }
  }
}
</script>

<style lang="scss">

html, body {
  background: #fff;
}
</style>