<template>
  <q-layout view="lHh Lpr fff">
    <q-header class="bg-white text-grey-8 shadow-top" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />
        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap"
                         @click="$router.push({name:'home'})">
          <img src="https://aleph.im/assets/img/logo.c052fb15.svg">
          <span class="q-ml-sm text-mono text-bold">my</span>
        </q-toolbar-title>

        <q-space />

        <q-input class="GPL__toolbar-input" dense standout="bg-primary" v-model="search" placeholder="Search">
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
          </template>
        </q-input>

        <q-btn v-if="$q.screen.gt.xs && account" flat dense no-wrap color="primary" icon="add" no-caps label="Create" class="q-ml-sm q-px-md">
          <q-menu anchor="top right" self="top right">
            <q-list class="text-grey-8" style="min-width: 100px">
              <q-item aria-hidden="true">
                <q-item-section class="text-uppercase text-grey-7" style="font-size: 0.7rem">Create New</q-item-section>
              </q-item>
              <q-item v-for="menu in createMenu" :key="menu.text" :to="menu.link" clickable v-close-popup aria-hidden="true">
                <q-item-section avatar>
                  <q-icon :name="menu.icon" />
                </q-item-section>
                <q-item-section>{{ menu.text }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn v-if="$q.screen.gt.xs && account" flat dense no-wrap color="primary" icon="cloud_upload" no-caps label="Upload" class="q-ml-sm q-px-md" />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn v-if="!account"
                 push color="primary" label="Login"
                 :to="{name: 'login'}" />
          <q-btn round flat v-else>
            <q-avatar size="26px">
              {{account.address}}
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu anchor="top right" self="top right">
              <q-list class="text-grey-8" style="min-width: 100px">
                <q-item aria-hidden="true">
                  <q-item-section class="text-uppercase text-grey-7" style="font-size: 0.7rem">{{$t('account.actions')}}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup aria-hidden="true"
                        @click="$store.dispatch('logout')">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>{{$t('account.logout')}}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <img class="q-pl-md" src="https://aleph.im/assets/img/logo.c052fb15.svg">
            <span class="q-ml-sm text-mono text-bold">my</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item v-for="link in links1" :key="link.text" clickable class="GPL__drawer-item" :to="link.link" exact>
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links2" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item v-for="link in links3" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item clickable class="GPL__drawer-item GPL__drawer-item--storage">
            <q-item-section avatar>
              <q-icon name="cloud" />
            </q-item-section>
            <q-item-section top>
              <q-item-label>Storage</q-item-label>
              <q-linear-progress :value="storage" class="q-my-sm" />
              <q-item-label caption>2.6 GB of 15 GB</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container  class="GPL__page-container">
      <router-view />
      <q-page-sticky v-if="$q.screen.gt.md" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <router-link v-for="link in links1" :key="link.text" :to="link.link">
            <template v-slot="props">
              <q-btn round flat stack no-caps size="26px" class="GPL__side-btn"  v-bind="buttonProps(props)">
                <q-icon size="22px" :name="link.icon" />
                <div class="GPL__side-btn__label">{{ link.text }}</div>
              </q-btn>
            </template>
          </router-link>
        </div>

      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MyLayout',
  computed: {
    // menuItems() {
    //   return this.menu.concat(this.fixedMenuItems)
    // },
    ...mapState({
      account: state => state.account,
      api_server: state => state.api_server,
      network_id: state => state.network_id,
      menu: state => state.menu
    })
  },

  data () {
    return {
      leftDrawerOpen: false,
      search: '',
      storage: 0.26,
      links1: [
        { icon: 'assignment_ind', text:'Profile', link: {'name': 'home'} },
        { icon: 'note', text:'Notes', link: {'name': 'notes'} },
        // { icon: 'far fa-newspaper', text:'My Feed' },
        // { icon: 'photo', text: 'Photos' },
        // { icon: 'people', text: 'Contacts' }
      ],
      links2: [
        { icon: 'archive', text: 'Archive' },
        { icon: 'delete', text: 'Trash' }
      ],
      links3: [
        { icon: 'settings', text: 'Settings' },
        { icon: 'help', text: 'Help & Feedback' },
        { icon: 'get_app', text: 'App Downloads' }
      ],
      createMenu: [
        { icon: 'note_add', text: 'Note', link: {name: 'new-note'} },
        // { icon: 'photo_album', text: 'Album' },
        // { icon: 'people', text: 'Shared Album' },
        // { icon: 'movie', text: 'Movie' },
        // { icon: 'library_books', text: 'Animation' },
        // { icon: 'dashboard', text: 'Collage' },
        // { icon: 'book', text: 'Photo book' }
      ]
    }
  },
  methods: {
    buttonProps ({ href, route, isActive, isExactActive }) {
      const props = {
        color: 'black',
        noCaps: true,
        outline: true,
        to: route
      }

      if (isExactActive === true) {
        props.color = 'primary'
      }
      else {
        props.color = 'grey-8'
      }

      return props
    },

    linkClick (e, go) {
      e.navigate = false // we choose when we navigate

      // console.log('triggering navigation in 3s')
      setTimeout(() => {
        // console.log('navigating as promised 3s ago')
        go()
      }, 3000)
    },
  }
}
</script>

<style lang="scss">
.shadow-top {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 16px 0px;
}
.GPL {

  &__toolbar {
    height: 64px;
  }

  &__toolbar-input {
    width: 35%;
  }

  &__drawer-item {
    line-height: 24px;
    border-radius: 0 24px 24px 0;
    margin-right: 12px;

    .q-item__section--avatar {
      padding-left: 12px;

      // .q-icon {
      //   color: #5f6368;
      // }
    }

    .q-item__label:not(.q-item__label--caption) {
      // color: #3c4043;
      letter-spacing: .01785714em;
      font-size: .875rem;
      font-weight: 500;
      line-height: 1.25rem;
    }
    &--storage{
      border-radius: 0;
      margin-right: 0;
      padding-top: 24px;
      padding-bottom: 24px;
    }
  }

  &__side-btn {
    &__label {
      font-size: 12px;
      line-height: 24px;
      letter-spacing: .01785714em;
      font-weight: 500;
    }
  }

  @media (min-width: $breakpoint-lg-min) {
    &__page-container {
      padding-left: 94px;
    }
  }
}
</style>
