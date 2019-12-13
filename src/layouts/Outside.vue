<template>
  <q-layout view="hhh lpR fFf">
    <q-header class="bg-transparent text-black">
      <q-toolbar>
        <q-toolbar-title>
            <img src="https://aleph.im/assets/img/logo.c052fb15.svg">
            <span class="q-ml-sm text-mono text-bold">
                my
                <q-badge color="primary" outline transparent align="middle">tech preview</q-badge>
            </span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
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
