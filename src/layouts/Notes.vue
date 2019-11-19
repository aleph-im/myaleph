<template>
  <q-page>
    <div v-if="account">
      <q-splitter v-model="splitter">
      <!-- <div class="fit row"> -->
        <!-- <div class="col-2 gt-sm"> -->
        <template v-slot:before>
          <q-scroll-area style="height: calc(100vh - 4.5rem)">
            <q-list padding>
              <q-item-label header>Notes</q-item-label>
              <template v-for="item in notes">
                <q-item :to="{'name': 'edit-note', params:{'hash': item.hash}}" :key="item.hash+'it'" clickable>
                  <q-item-section>
                    <q-item-label>{{item.content.title}}</q-item-label>
                    <q-item-label overline>
                      {{item.time * 1000 | moment("from")}}
                      <q-tooltip>{{item.time * 1000 | moment("LLL")}}</q-tooltip>
                    </q-item-label>
                    <q-item-label caption lines="3">{{item.content.body}}</q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-icon v-if="item.content.private" name="lock" size="xs" color="positive" />
                    <q-icon v-else name="lock_open" size="xs" />
                  </q-item-section>
                </q-item>

                <q-separator spaced inset :key="item.hash+'sep'" />
              </template>

            </q-list>
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
    </div>
    <div v-else>
      Please log in.
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
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
    ])
  },
  data() {
    return {
      posts: [],
      splitter: 20
    }
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
