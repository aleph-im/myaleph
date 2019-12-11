<template>
  <q-carousel
    transition-prev="slide-right"
    transition-next="slide-left"
    swipeable
    animated
    v-model="slide"
    control-color="primary"
    navigation-icon="radio_button_unchecked"
    navigation
    padding
    class="bg-white shadow-1 rounded-borders onboarding-carousel"
  >
    <q-carousel-slide name="welcome" class="column no-wrap flex-grow slide-welcome">
      <div class="q-my-md">
        <p class="logo">
          <img src="https://aleph.im/assets/img/logo.c052fb15.svg">
          <span class="q-ml-sm text-mono text-bold text-h5">my aleph.im
            <q-badge color="primary" outline transparent align="middle">tech preview</q-badge>
          </span>
        </p>
        <p>
          Welcome to your new digital home.
        </p>
        <p>
          My Aleph stores your data securely, using state of the art encryption.
          Our philosophy is "Privacy by design". Nobody but yourself has access to your data.
        </p>
        <p>
          Do you have an account already?
        </p>
        <p class="row q-gutter-sm">
          <q-btn push rounded color="primary" label="Yes, log me in" @click="$emit('close')" :to="{'name': 'login'}" />
          <q-btn push rounded color="secondary" label="No, please sign me up" @click="slide='signup'" />
        </p>
      </div>
    </q-carousel-slide>
    <q-carousel-slide name="signup" class="column no-wrap flex-center">
      <q-icon name="live_tv" color="primary" size="56px" />
      <div class="q-mt-md text-center">
        a
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>

<script>
export default {
  name: 'onboarding',
  data () {
    return {
      slide: 'welcome'
    }
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
}
.slide-welcome {
  background: url('../statics/ux/mountain-climbing.svg')
              center left -50px / 50% no-repeat #3455b7;
  color: #fff;

  &>div {
    margin-left: 45%;
    width: 55%;

    p.logo {
      margin-left: -10%;
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
  }
}
</style>
