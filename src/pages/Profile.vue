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

        <!-- <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="stats" label="Statistics" />
        </q-tabs> -->

        <!-- <q-separator /> -->
    </q-card>
    <div v-if="tab=='stats'">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-sm-6 col-md-8 row q-col-gutter-sm">
          <div class="col-lg col-grow">
            <q-card>
              <q-card-section>
                <div class="text-subtitle1">Files</div>
              </q-card-section>
              <files-list :files="displayed_files" dense />
            </q-card>
          </div>
          <div class="col-lg col-grow">
            <q-card>
              <q-card-section>
                <div  class="text-subtitle1">Notes</div>
              </q-card-section>
              <notes-list :notes="displayed_notes" dense />
            </q-card>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4" v-if="!address">
          <q-card>
            <q-list>
              <q-item-label header>Address</q-item-label>
              <q-item>
                <q-item-section top>
                  <q-item-label>{{account.address}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item-label header>Balances</q-item-label>
              <q-item v-for="holding of Object.entries(balance_info)" :key="holding[0]">
                <q-item-section top>
                  <q-item-label>{{holding[0]}}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  {{holding[1].toFixed(2)}}
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item-label header>Status</q-item-label>
              <q-item class="GPL__drawer-item GPL__drawer-item--storage">
                <q-item-section avatar>
                  <q-icon name="cloud" />
                </q-item-section>
                <q-item-section top>
                  <q-item-label>Storage</q-item-label>
                  <q-linear-progress :value="0" class="q-my-sm" />
                  <q-item-label caption>0 GB of {{(allowance/1000).toFixed(3)}} GB</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
import SubmitContent from '../components/SubmitContent.vue'
import FilesList from '../components/FilesList'
import NotesList from '../components/NotesList'

export default {
  name: 'PageIndex',
  data() {
    return {
      'tab': 'stats',
      'name': '',
      'bio': '',
      'profile': {},
      'loading': false,
      'loaded_notes': [],
      'loaded_files': [],
      'shown_notes': 10,
      'shown_files': 10
    }
  },
  computed: {
    is_own() {
      return (!this.address)
    },
    profile_address() {
      let address = this.address
      if (!address)
        address = this.account.address
      return address
    },
    allowance: function(state) {
      if ((this.balance_info !== null)&&(this.balance_info.ALEPH != undefined)) {
        return this.balance_info.ALEPH * this.mb_per_aleph
      }
      return 0
    },
    // profile() {
    //   let profile = this.profiles[this.profile_address]
    //   if (profile === undefined)
    //     profile = {}

    //   return profile
    // },
    displayed_notes() {
      if (this.is_own) {
        return this.notes.slice(0,this.shown_notes)
      }
    },
    displayed_files() {
      if (this.is_own) {
        let files = this.files.filter(
          (f) => (f.original_type === 'file') && (f.content.status === 'visible')
        )
        return files.slice(0,this.shown_files)
      }
    },
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'profiles',
      'balance_info',
      'mb_per_aleph',
      'notes',
      'files'
    ])
  },
  props: ['address'],
  methods: {
    async save_name(value, initial_value) {
      if (value && (value !== initial_value)) {
        await aggregates.submit(this.account.address, "profile", {
          'name': value
        }, {
          api_server: this.api_server,
          account: this.account,
          channel: this.channel
        })
        await this.refresh()
        if (this.name == value)
          this.$q.notify({
            message: 'Name saved',
            color: "positive"
          })
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
        if (this.bio == value)
          this.$q.notify({
            message: 'Bio saved',
            color: "positive"
          })
      }
    },
    async refresh() {
      this.loading = true
      await this.$fetch_profile(this.profile_address)

      let profile = this.profiles[this.profile_address]
      if ((profile === undefined)||(profile===null))
        profile = {}
      this.profile = profile

      if (this.profile) {
        this.name = this.profile.name
        this.bio = this.profile.bio
      }

      if (this.is_own) {
        if (!this.notes.length)
          await this.$store.dispatch('update_notes')
        if (!this.files.length)
          await this.$store.dispatch('update_files')
      }


      this.loading = false
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
  components: {
    SubmitContent,
    FilesList,
    NotesList
  }
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