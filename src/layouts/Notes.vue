<template>
  <q-page>
    <div v-if="account">
      <q-splitter v-model="splitter" v-if="$q.screen.gt.xs">
      <!-- <div class="fit row"> -->
        <!-- <div class="col-2 gt-sm"> -->
        <template v-slot:before>
          <q-scroll-area style="height: calc(100vh - 4.5rem)">
            <notes-list :notes="notes" />
          </q-scroll-area>
          <q-btn round push size="md" color="primary" class="fixed" icon="note_add"
          :style="'margin-top:-4rem; margin-left: calc('+splitter+'vw - ' + ($q.screen.gt.md ? 6 : 4) + 'rem)'"
          :to="{'name': 'new-note'}"/>
        <!-- </div> -->
        </template>
        <template v-slot:after>
        <!-- <div class="col-grow"> -->
          <router-view />
        <!-- </div> -->
        </template>
      <!-- </div> -->
      </q-splitter>
      <div v-else>
        <div v-if="is_home">
          <notes-list :notes="notes" />
          <p v-if="!notes.length" class="q-px-md">
            No note here yet... Why not <router-link :to="{'name': 'new-note'}">write one</router-link>?
          </p>
          <q-btn round push size="md" color="primary" class="fixed-bottom-right q-ma-md" icon="note_add"
          :to="{'name': 'new-note'}"/>
        </div>
        <router-view v-else />
      </div>
    </div>
    <div v-else>
      Please log in.
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
import NotesList from '../components/NotesList'
export default {
  name: 'NotesLayout',
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'notes'
    ]),
    is_home() {
      return (this.$route.name === 'notes')
    }
  },
  data() {
    return {
      posts: [],
      splitter: 20
    }
  },
  components: {
    NotesList
  },
  methods: {
    async getNotes() {
      await this.$store.dispatch('update_notes')
    },
    async refresh() {
      await this.getNotes()
    }
  },
  watch: {
    async $route(to, from) {
      // await this.getProfile()
      // await this.getPosts()
      console.log(this.$route)
    },
    async current_page() {
      // await this.getPosts()
    }
  },
  async created() {
    await this.refresh()
    // bus.$on('broadcasted', () => {
    //   setTimeout(this.refresh, 5000);
    //   setTimeout(this.refresh, 10000)
    // })
  }
}
</script>
