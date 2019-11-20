<template>
  <q-page padding class="profile-page">
    <q-card class="profile-card q-ma-xl q-ml-1">
      <q-card-section class="bg-primary text-white profile-title">
        <q-avatar size="8rem" color="secondary" text-color="white" class="profile-avatar shadow-6">
          <q-icon v-if="!profile | !profile.avatar" name="assignment_ind" />
          <img v-if="profile.avatar" :src="profile.avatar" />
        </q-avatar>
        <div class="text-h6">
          <span v-if="profile.name" class="q-my-sm">{{profile.name}}</span>
          <span v-else-if="profile_address === account.address" class="q-my-sm">Your account</span>
          <span v-else class="text-truncate q-my-sm">{{profile_address}}</span>

          <q-popup-edit v-if="profile_address === account.address" v-model="name"
            buttons
            label-set="Save"
            label-cancel="Close"
            @save="save_name"
          >
            <q-input
              v-model="name"
              hint="Your profile name"
              dense
              autofocus
            />
          </q-popup-edit>
        </div>
        <div class="text-subtitle2">
          <span v-if="profile.bio">{{profile.bio}}</span>
          <span v-else-if="profile_address === account.address">
            Your nice bio could be here!
          </span>

            <q-popup-edit v-if="profile_address === account.address" v-model="bio"
              buttons
              label-set="Save"
              label-cancel="Close"
              @save="save_bio"
            >
              <q-input
                v-model="bio"
                hint="Your bio"
                dense
                autofocus
              />
            </q-popup-edit>
        </div>
      </q-card-section>

        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="stats" label="Statistics" />
        </q-tabs>

        <q-separator />
    </q-card>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="stats">
        Nothing to see here, yet.
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
import SubmitContent from '../components/SubmitContent.vue'
export default {
  name: 'PageIndex',
  data() {
    return {
      'tab': 'stats',
      'name': '',
      'bio': '',
      'profile': {}
    }
  },
  computed: {
    profile_address() {
      let address = this.address
      if (!address)
        address = this.account.address
      return address
    },
    // profile() {
    //   let profile = this.profiles[this.profile_address]
    //   if (profile === undefined)
    //     profile = {}

    //   return profile
    // },
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'profiles'
    ])
  },
  props: ['address'],
  methods: {
    async save_name(value, initial_value) {
      if (value && (value !== initial_value)) {
        console.log("blah")
        await aggregates.submit(this.account.address, "profile", {
          'name': value
        }, {
          api_server: this.api_server,
          account: this.account,
          channel: this.channel
        })
        await this.refresh()
      }
    },
    async save_bio(value, initial_value) {
      if (value && (value !== initial_value)) {
        console.log("blah")
        await aggregates.submit(this.account.address, "profile", {
          'bio': value
        }, {
          api_server: this.api_server,
          account: this.account,
          channel: this.channel
        })
        await this.refresh()
      }
    },
    async refresh() {
      await this.$fetch_profile(this.profile_address)

      let profile = this.profiles[this.profile_address]
      if ((profile === undefined)||(profile===null))
        profile = {}
      this.profile = profile

      if (this.profile) {
        this.name = this.profile.name
        this.bio = this.profile.bio
      }

    }
  },
  async mounted() {
    if ((!this.address)&&(!this.account)) {
      this.$router.push({'name': 'login'})
    }
      await this.refresh()
  },
  watch: {
    async account() {
      await this.refresh()
    },
    async address() {
      await this.refresh()
    }
  },
  components: {SubmitContent}
}
</script>

<style lang="scss">
.profile-page {
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  &>* {
    max-width: 70rem;
    margin-left: auto;
    margin-right: auto;

    @media (min-width: 1024px) and (max-width: 1300px) {
      margin-left: 6rem;
    }

    @media (max-width: 1024px) {
      margin-left: auto;
    }
  }
  
  .q-card.profile-card {
    margin: 4rem auto 2rem auto;

    .profile-title {
      padding-left: 6rem;
    }
    .profile-avatar {
      position: absolute;
      margin: -4rem 5rem 5rem -10rem;
    }

    @media (max-width: 1300px) {
      margin-left: 6rem;
    }
  }
}
</style>