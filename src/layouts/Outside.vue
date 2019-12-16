<template>
  <q-layout view="hhh lpR fFf">
    <q-dialog 
      v-model="display_onboarding"
      :maximized="$q.screen.lt.md"
      :full-height="$q.screen.lt.md"
      >
      <onboarding @close="display_onboarding=false" />
    </q-dialog>
    <q-header class="bg-transparent text-black q-pa-sm">
      <q-toolbar>
        <q-toolbar-title class="logo">
            <img src="https://aleph.im/assets/img/logo.c052fb15.svg">
            <span class="q-ml-sm text-mono text-bold">
                my.aleph.im
                <q-badge color="primary" outline transparent align="middle">tech preview</q-badge>
            </span>
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn v-if="!account"
                 push color="primary" label="Login &amp; Sign-up"
                 @click="display_onboarding=true" />
          <q-btn round flat v-else>
            <q-avatar size="26px" color="secondary" text-color="white" class="profile-avatar">
              <q-icon v-if="!profile | !profile.avatar" name="assignment_ind" />
              <img v-if="profile && profile.avatar" :src="profile.avatar" />
            </q-avatar>
            <q-tooltip>Enter</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

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
      display_onboarding: false
    }
  },
  components: {
    Onboarding
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