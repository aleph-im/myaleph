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
      Copyright ©2019-present <a href="https://aleph.im/">aleph.im Project</a>, all rights reserved. 
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

<style lang="scss">
.logo {
  .q-badge {
    position: absolute;
    margin-top: -0.2rem;
    margin-left: -5rem;
  }
}

.hero {
  margin-top: -66px;

  border-bottom-left-radius: 30% 2%;
  border-bottom-right-radius: 30% 5%;

  .rightbox, .leftbox, .leftbox-sm {
    background: transparent url(../statics/outside/rightbox.svg) right top/contain no-repeat;
    height: 200px;
    position: absolute;
    width: 100%;
    left: 0;
    top: -2px;

    &.leftbox-sm,
    &.leftbox {
      transform:scale(-1,1);
      top: -100px;

      //@media (max-width: $breakpoint-xs-max) {
      //  width: $breakpoint-xs-max;
      //  height: 65%;
      //  top: -30%;
      //}
    }
  }
  // .bottombox {
  //   background: transparent url(../../statics/ux/wave4.svg) left -20px/100% no-repeat;
  //   height: 100%;
  //   width: 100%;
  //   position: absolute;
  //   left: 0;
  //   bottom: 0;
  //   transform:scale(1,-1);
  //   filter: grayscale(100%) brightness(10);
  // }

  .content {
    &, .vue-typer .custom.char.typed {
      z-index: 100;
      color: #fff;
    }

    .title {
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 1);

      .q-btn {
        float: right;
      }
    }
  }
}

.content {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 10px;
  word-wrap: normal;

  .title {
    font-size: 3rem;

    @media (max-width: $breakpoint-sm-max) {
      font-size: 4.4vw;
    }
  }
}

.hero-section {
  overflow: hidden;
  position: relative;
  min-height: 550px;

  @media (max-width: $breakpoint-xs-max) {
    min-height: 300px;
  }
}

.floating {
  position: absolute;
  height: 100%;
  &.right {
    left: calc(50% + 350px);
    width: 300px;
    right: 5vw;
    &.large {
      width: 500px;
      left: calc(50% + 300px);
    }
  }
  &.left {
    right: calc(50% + 400px);
    width: 300px;
  }
}
</style>