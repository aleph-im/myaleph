<template>
  <q-layout view="hhh lpR fff">
    <q-dialog 
      v-model="display_onboarding"
      :maximized="$q.screen.lt.md"
      :full-height="$q.screen.lt.md"
      >
      <onboarding @close="display_onboarding=false" />
    </q-dialog>
    <vue-easy-lightbox
      :visible="lbvisible"
      :imgs="lbimgs"
      :index="lbidx"
      @hide="image_hide"
    ></vue-easy-lightbox>
    <q-header class="bg-transparent text-black q-pa-sm">
      <q-toolbar>
        <q-toolbar-title class="logo">
            <img src="https://aleph.im/assets/img/logo.c052fb15.svg">
            <span class="q-ml-sm text-mono text-bold">
                my.aleph.im
                <q-badge color="primary" transparent align="middle">tech preview</q-badge>
            </span>
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn v-if="!account"
                 push color="primary" label="Login &amp; Sign-up"
                 @click="display_onboarding=true" no-caps />
          <q-btn v-else push color="primary"  :to="{name:'profile'}" no-caps>
            Enter
            <q-avatar size="26px" color="secondary" text-color="white" class="profile-avatar on-right">
              <q-icon v-if="!profile | !profile.avatar" name="assignment_ind" />
              <img v-if="profile && profile.avatar" :src="profile.avatar" />
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent text-black q-pa-sm">
      Copyright ©2019 <a href="https://aleph.im/">aleph.im Project</a>, all rights reserved. 
    </q-footer>

  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
import Onboarding from '../components/Onboarding'
export default {
  name: 'OutsideLayout',
  computed: {
    profile() {
      if (this.profiles[this.account.address] != undefined){
        return this.profiles[this.account.address]
      }
      return {}
    },
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'files',
      'profiles'
    ])
  },
  data() {
    return {
      display_onboarding: false,
      lbimgs: '',  // Img Url , string or Array
      lbvisible: false,
      lbidx: 0,   // default: 0,
    }
  },
  components: {
    Onboarding
  },
  methods: {
    open_lightbox(items, index) {
      this.lbimgs = items
      this.lbidx = index
      this.lbvisible = true
    },

    open_onboarding() {
      this.display_onboarding = true
    },
    
    async image_hide() {
      this.lbvisible = false
    }
  },
  created() {
    this.$root.$on('open_lightbox', this.open_lightbox)
    this.$root.$on('open_onboarding', this.open_onboarding)
  },
  beforeDestroy() {
    this.$root.$off('open_lightbox', this.open_lightbox)
    this.$root.$off('open_onboarding', this.open_onboarding)
  }
}
</script>

<style lang="scss" scoped>
.logo {
  .q-badge {
    position: absolute;
    margin-top: -0.2rem;
    margin-left: -5rem;
  }
}
</style>