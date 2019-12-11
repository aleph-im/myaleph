<template>
  <q-carousel
    transition-prev="slide-right"
    transition-next="slide-left"
    animated
    v-model="slide"
    control-color="primary"
    navigation-icon="radio_button_unchecked"
    navigation
    padding
    class="bg-white shadow-1 rounded-borders onboarding-carousel"
  >
    <q-carousel-slide name="welcome" class="column no-wrap slide-welcome q-py-md row">
      <div class="q-my-md col-grow column justify-between no-wrap">
        <p class="logo">
          <img src="https://aleph.im/assets/img/logo.c052fb15.svg">
          <span class="q-ml-sm text-mono text-bold text-h5">my aleph.im
            <q-badge color="primary" outline transparent align="middle">tech preview</q-badge>
          </span>
        </p>
        <div>
          <p class="text-center lt-sm q-px-md main-image">
            <img src="statics/ux/mountain-climbing.svg">
          </p>
          <p>
            Welcome to your new digital home.
          </p>
          <p>
            My Aleph stores your data securely, using state of the art encryption.
            Our philosophy is "Privacy by design". Nobody but yourself has access to your data.
          </p>
        </div>
        <div  class="q-gutter-sm q-pt-xl q-pt-sm-none">
          <p>
            Do you have an account already?
          </p>
          <p class="q-gutter-sm">
            <q-btn push rounded color="primary" label="Yes, log me in" @click="$emit('close')" :to="{'name': 'login'}" />
            <q-btn push rounded color="secondary" label="No, please sign me up" @click="slide='signup'" />
          </p>
        </div>
      </div>
    </q-carousel-slide>
    <q-carousel-slide name="signup" class="column no-wrap flex-grow slide-signup">
      <div class="q-mt-md column  justify-between col-grow no-wrap">
        <h5 class="text-mono text-bold">Your new identity</h5>
        <div>
          <p class="text-center lt-sm q-px-md main-image">
            <img src="statics/ux/verified-woman.svg">
          </p>
          <p>
            This is your address, a unique identifier to your digital identity and content.
            <br> You can give it to others so they can find you.
          </p>
        </div>
        <q-field borderless :label="$t('resource.address')" stack-label>
          <template v-slot:control>
            <code class="self-center full-width no-outline text-truncate" tabindex="0">{{new_account.address}}</code>
          </template>
        </q-field>
        <p class="q-gutter-sm row justify-end">
          <q-btn push rounded color="secondary" label="Continue" @click="slide='key'" />
        </p>
      </div>
    </q-carousel-slide>
    <q-carousel-slide name="key" class="column no-wrap flex-grow slide-key">
      <div class="column col-grow justify-between no-wrap">
        <h5 class="text-mono text-bold">Your keys</h5>
        <div>
          <p class="text-center lt-sm q-px-md main-image">
            <img src="statics/ux/unlock.svg">
          </p>
          <p>
            This is called your private key, represented as easy to remember twelve "mnemonic words".
            <br>
            Please write those down, without them, there is no way to recover your account.
          </p>
        </div>
        <q-field borderless :label="$t('resource.mnemonics_words')" stack-label>
          <template v-slot:control>
            <code class="self-center full-width no-outline text-truncate" tabindex="0">{{new_account.mnemonics}}</code>
          </template>
        </q-field>
        <div>
          <p>Saved them? Good, let's start!</p>
          <p class="q-gutter-sm row justify-end">
            <q-btn push rounded color="secondary" label="Let's start!" @click="add_account" :loading="adding" />
          </p>
        </div>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
import { mapState } from 'vuex'
import { nuls2 } from 'aleph-js'
export default {
  name: 'onboarding',
  computed: {
      ... mapState([
        // map this.count to store.state.count
        'account',
        'network_id',
        'api_server',
        'channel'
      ])
  },
  data () {
    return {
      slide: 'welcome',
      new_account: null,
      adding: false
    }
  },
  methods: {
    async add_account() {
      this.adding = true
      this.$store.dispatch(
        'store_account', this.new_account
      )
      await this.$fetch_profile(this.new_account.address)
      this.adding = false
      this.$router.push('/')
    }
  },
  async mounted() {
    this.new_account = await nuls2.new_account({chain_id: this.network_id})
    console.log(this.new_account)
  }
}
</script>

<style lang="scss" scoped>

.onboarding-carousel {
  min-width: 1024px;
  min-height: 300px;
  overflow: hidden;

  @media (max-width: $breakpoint-md-max) {
    min-width: 65vw;
  }

  @media (max-width: $breakpoint-sm-max) {
    min-width: 80vw;
  }

  @media (max-width: $breakpoint-xs-max) {
    min-width: 95vw;
  }

  p.main-image img {
    max-height: 30vh;
  }

  h5 {
    margin: .5rem 0;
  }
}



.slide-welcome {
  background-color: #3455b7;
  color: #fff;

  p.logo {
    img {
      -webkit-filter: grayscale(100%) brightness(1000%); /* Safari 6.0 - 9.0 */
      filter: grayscale(100%)  brightness(1000%);
    }
    .q-badge {
      position: absolute;
      margin-top: -0.5rem;
      @media (max-width: $breakpoint-sm-max) {
        margin-left: -3rem;
      }
    }
  }

  @media (min-width: $breakpoint-sm-min) {
    background: url('../statics/ux/mountain-climbing.svg')
                center left -50px / 50% no-repeat #3455b7;
    p.logo {
      margin-left: -10%;
    }
    &>div {
      margin-left: 45%;
      width: 55%;
    }
  }

}

.slide-signup {
  background-color: #ffe2d3;
  color: #000;
  @media (min-width: $breakpoint-sm-min) {
    background: url('../statics/ux/verified-woman.svg')
                center right -50px / 50% no-repeat #ffe2d3;
    &>div {
      margin-right: 45%;
      width: 55%;
    }
  }
}

.slide-key {
  background-color: #3455b7;
  color: #fff;

  code {
    color: #fff;
  }

  .label {
    color: #fff !important;
  }
  @media (min-width: $breakpoint-sm-min) {
    background: url('../statics/ux/unlock.svg')
                center left -50px / 50% no-repeat #3455b7;

    &>div {
      margin-left: 45%;
      width: 55%;
    }
  }

  @media (min-width: $breakpoint-sm-min) and (max-height: 400px) {
    background: url('../statics/ux/unlock.svg')
                center left -50px / 30% no-repeat #3455b7;

    &>div {
      margin-left: 25%;
      width: 75%;
    }
  }
}
</style>
