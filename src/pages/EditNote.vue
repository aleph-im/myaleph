<template>
  <q-page padding class="column">
    <div class="col-auto row justify-between items-center">
      <h4 class="q-my-sm col-grow">
        {{title||'Note Title'}}
        <q-popup-edit v-model="title">
          <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
            <q-input
              autofocus
              dense
              hint="Your title"
              v-model="title"
            >
              <template v-slot:after>
                <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                <q-btn flat dense color="positive" icon="save" @click.stop="set" />
              </template>
            </q-input>
          </template>
        </q-popup-edit>
      </h4>
      <span>
        <q-btn push color="primary" rounded icon="save" label="Save" size="sm" @click.stop="submit" />
      </span>
    </div>
    <div class="col-grow">
      <editor v-model="body" height="100%" mode="wysiwyg" />
    </div>
    <div class="col-auto row justify-end q-my-sm">
      <q-btn push color="primary" rounded icon="save" label="Save" size="sm" @click.stop="submit" />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import { Editor } from '@toast-ui/vue-editor'


export default {
  name: 'EditNote',
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
      post: null,
      title: '',
      body: '',
      processing: false,
      tags: [],
      private: true
    }
  },
  props: [
    'hash'
  ],
  components: { 
    'editor': Editor
  },
  methods: {
    async getPost() {
      let response = await posts.get_posts(['note'], {hashes: [this.hash]})

      // let response = await axios.get(`${this.api_server}/api/v0/posts.json?hashes=${this.hash}`)
      this.post = response.posts[0]
    },
    async setState() {
      if (this.hash) {
        this.banner_hash = this.post.content.banner
        this.private = this.post.content.private
        if (this.private) {
          this.title = encryption.decrypt(this.account, this.post.content.title)
          this.body = encryption.decrypt(this.account, this.post.content.body)
        } else {
          this.title = this.post.content.title
          this.body = this.post.content.body
        }
        this.subtitle = this.post.content.subtitle
        if (this.post.content.tags !== undefined)
          this.tags = this.post.content.tags.map((t) => {return {text: t}})
        else
          this.tags = []
      } else {
        this.title = ''
        this.body = ''
        this.tags = []
      }
    },
    async refresh() {
      if (this.hash) {
        await this.getPost()
      }
      await this.setState()
    },
    async submit() {
      let msg = null
      let body = this.body
      let title = this.title
      if (this.private) {
        body = encryption.encrypt_for_self(this.account, body)
        title = encryption.encrypt_for_self(this.account, title)
      }
      if (this.hash)
        msg = await posts.submit(
          this.account.address, 'amend',
          {
            body: body,
            title: title,
            private: this.private
            // tags: this.tags.map(t => t.text)
          },
          {ref: this.hash,
           channel: this.channel,
           api_server: this.api_server,
           account: this.account})
      else
        msg = await posts.submit(
          this.account.address, 'note',
          {
            body: body,
            title: title,
            private: this.private
            // tags: this.tags.map(t => t.text)
          },
          {channel: this.channel,
           api_server: this.api_server,
           account: this.account})

      this.processing = true
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      await sleep(100)
      this.processing = false

      if (!this.hash)
        this.$router.push({ name: "edit-note", params: {hash: msg.item_hash} })
    }
  },
  watch: {
    async $route(to, from) {
      await this.refresh()
    },
    async hash() {
      await this.refresh()
    }
  },
  async created() {
    await this.refresh()
  }
}
</script>