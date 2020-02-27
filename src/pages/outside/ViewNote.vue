<template>
  <q-page>
    <div class="note" v-if="post">
      <q-card class="note-card text-black q-pa-md q-my-lg">
        <div class="row q-mt-none q-mb-md">
          <h4 class="col-grow q-ma-none"  v-if="post.content.private">
            Private item
          </h4>
          <h4 class="col-grow q-ma-none" v-else>
            {{post.content.title||'Note Title'}}
          </h4>
          <p class="q-ma-none text-caption text-right">
            <span>
              by {{author_profile.name ? author_profile.name : post.address}}
              <q-tooltip>Post by {{post.address}}</q-tooltip>
            </span>
            <br />
            <span>
              Last update 
              {{post.time * 1000 | moment("from")}}
              <q-tooltip>{{post.time * 1000 | moment("LLL")}}</q-tooltip>
            </span>
          </p>
        </div>
        <div v-if="post.content.private"  class="text-center text-grey">
          <q-icon name="lock" style="font-size: 100px;" />
        </div>
        <div class="note-content" v-else>
          <vue-markdown :source="post.content.body" :html="false" />
        </div>
      </q-card>
    </div>
    <div v-else-if="!loading" class="fixed-center text-center text-mono">
      <span style="font-size: 100px;">?</span><br />Not found
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
import VueMarkdown from 'vue-markdown'
export default {
  name: 'view-note',
  data() {
    return {
      post: null,
      title: '',
      body: '',
      author_profile: {},
      processing: false,
      tags: [],
      is_private: true,
      saving: false,
      loading: false
    }
  },
  computed: {
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
  props: [
    'hash'
  ],
  components: {
    VueMarkdown
  },
  methods: {
    async getPost() {
      let response = await posts.get_posts(['note'], {
        hashes: [this.hash],
        api_server: this.api_server
      })

      // let response = await axios.get(`${this.api_server}/api/v0/posts.json?hashes=${this.hash}`)
      if (response.posts.length)
        this.post = response.posts[0]
      else
        this.post = null
    },
    async setState() {
      if ((this.hash)&&(this.post)) {
        this.banner_hash = this.post.content.banner
        this.is_private = this.post.content.private
        // if (this.is_private)
        //   decrypt_content(this.post.content, ['title', 'body'], this.account)
        this.title = this.post.content.title
        this.body = this.post.content.body
        if (this.post.content.tags !== undefined)
          this.tags = this.post.content.tags.map((t) => {return {text: t}})
        else
          this.tags = []
      }
    },
    async refresh() {
      this.loading = true
      if (this.hash) {
        await this.getPost()
      }
      await this.setState()
      if (this.post !== null) {
        await this.$fetch_profile(this.post.address)
        let profile = this.profiles[this.post.address]
        if ((profile === undefined)||(profile===null))
          profile = {}
        this.author_profile = profile
      } else {
        this.author_profile = {}
      }
      this.loading = false
    }
  },
  watch: {
    // async $route(to, from) {
    //   await this.refresh()
    // },
    async hash() {
      await this.refresh()
    }
  },
  async created() {
    await this.refresh()
  }
}
</script>

<style lang="scss">
.note {
  position: relative;
  margin: 0 auto;
  max-width: 980px;
  padding: 0 10px;
  .note-card {
    .q-tab-panel {
      position: relative;
    }

    img {
      max-width: 100%;
    }
  }
}
</style>