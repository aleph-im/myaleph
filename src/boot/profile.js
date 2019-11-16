
import Vue from 'vue'
import {aggregates} from 'aleph-js'

Vue.prototype.$fetch_profile = async function(address) {
    let profile = await aggregates.fetch_profile(address, {api_server: this.$store.state.api_server});
    this.$store.commit('store_profile', {
        address: address,
        profile: profile
    })
}