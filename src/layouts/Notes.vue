<template>
  <q-page padding>
    <div v-if="account">
      <div class="fit row">
        <div class="col-shrink">
          <q-list padding>
            <q-item-label header>Notes</q-item-label>
            <template v-for="item in notes">
              <q-item to="{'name': 'edit-note', 'hash': item.hash}" :key="item.hash+'it'" clickable>
                <q-item-section>
                  <q-item-label>{{item.content.title}}</q-item-label>
                  <q-item-label caption lines="2">{{item.content.body}}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption>{{item.time}}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced inset :key="item.hash+'sep'" />
            </template>
            <q-item-label header>Actions</q-item-label>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon color="primary" name="note_add" />
              </q-item-section>
              <q-item-section>Create new Note</q-item-section>
            </q-item>

          </q-list>
        </div>
        <div class="col-grow">
          <router-view />
        </div>
      </div>
    </div>
    <div v-else>
      Please log in.
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
export default {
  name: 'NotesLayout',
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel'
    ])
  },
  data() {
    return {
      notes: {}
    }
  },
  methods: {
    async blah() {
      console.log("blah")
      await posts.submit(this.account.address, "test", {
        'blah': 'bluh'
      }, {
        api_server: this.api_server,
        account: this.account,
        channel: this.channel
      })
    },
    async refresh() {

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
