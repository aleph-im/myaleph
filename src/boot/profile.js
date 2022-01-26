
import Vue from 'vue'
import {aggregates} from 'aleph-js'

Vue.prototype.$fetch_profile = async function(address) {
    let profile = {}
    try {
        profile = await aggregates.fetch_profile(address, {api_server: this.$store.state.api_server});
    } catch {
        
    }
    this.$store.commit('store_profile', {
        address: address,
        profile: profile
    })
}