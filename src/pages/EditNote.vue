<template>
  <q-page class="column note-edit-page">
    <div class="col-auto row justify-between items-center">
      <template v-if="$q.screen.lt.sm">
        <q-btn round flat icon="arrow_back" :to="{'name': 'notes'}" />
      </template>
      <h4 class="q-ma-sm col-grow">
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
      <q-select v-if="$q.screen.gt.xs" v-model="selected_notebook" :options="notebook_options" label="Notebook" sanitize emit-value map-options>
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-select>
      <span class="q-ma-sm" v-if="$q.screen.gt.xs">
        <template>
          {{is_private?'encrypt':'public'}}
        </template>
        <q-toggle
          v-model="is_private"
          checked-icon="lock"
          color="green"
          unchecked-icon="lock_open"
        />
        <!-- <q-btn push color="info" round icon="share" size="xs" @click.stop="share"  class="q-mr-sm" /> -->
        <q-btn push color="primary" :loading="saving" rounded icon="save" label="Save" size="sm" @click.stop="submit" />
      </span>
    </div>
    <div class="col-grow">
      <editor v-model="body" height="calc(100vh - 13rem)"
       mode="wysiwyg" class="note-editor" :options="{
         placeholder: 'Write your content here!'
       }" />
    </div>
    <div class="col-auto row justify-between q-ma-sm items-end no-wrap">
      <div>
        <q-toggle
          v-model="is_private"
          checked-icon="lock"
          color="green"
          unchecked-icon="lock_open"  v-if="$q.screen.lt.sm"
        />
        <template v-if="$q.screen.lt.sm">
          {{is_private?'encrypt':'public'}}
        </template>
      </div>
      <q-select v-if="$q.screen.lt.sm" v-model="selected_notebook" :options="notebook_options" label="Notebook" sanitize emit-value map-options />
      <div>
        <q-btn push color="secondary" rounded icon="share" label="Share" size="sm" @click.stop="share" class="q-mr-sm" v-if="!saved_private" />
        <q-btn push color="primary" :loading="saving" rounded icon="save" label="Save" size="sm" @click.stop="submit" />
      </div>
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import { Editor } from '@toast-ui/vue-editor'
import { encrypt_content,
         encrypt_content_for_self,
         decrypt_content } from '../services/encryption.js'
import { format, copyToClipboard } from 'quasar'

import { encrypt, decrypt, PrivateKey } from 'eciesjs'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  name: 'EditNote',
  computed: {
    ... mapState([
      // map this.count to store.state.count
      'account',
      'network_id',
      'api_server',
      'channel',
      'account',
      'notebooks'
    ]),
    notebook_options() {
      let options = [
        {
          label: this.$t('notes.unassigned_notebook'),
          value: null
        }
      ]
      if (this.notebooks !== undefined)
        for (let [key, notebook] of Object.entries(this.notebooks)) {
          if (notebook['status'] == 'visible')
            options.push({
              label: notebook.name,
              value: key
            })
        }
      return options
    }
  },
  data() {
    return {
      post: null,
      title: '',
      body: '',
      processing: false,
      tags: [],
      is_private: true,
      saved_private: true,
      saving: false,
      loading: false,
      selected_notebook: null
    }
  },
  props: [
    'hash',
    'notebook'
  ],
  components: { 
    'editor': Editor
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
    },
    async setState() {
      if (this.hash) {
        this.banner_hash = this.post.content.banner
        this.is_private = this.post.content.private
        this.saved_private = this.is_private
        if (this.is_private)
          await decrypt_content(this.post.content, ['title', 'body', 'notebook'], this.account)
        this.title = this.post.content.title
        this.body = this.post.content.body
        if (this.post.content.tags !== undefined)
          this.tags = this.post.content.tags.map((t) => {return {text: t}})
        else
          this.tags = []
        if (this.post.content.notebook !== undefined)
          this.selected_notebook = this.post.content.notebook
        else
          this.selected_notebook = null
      } else {
        this.title = ''
        this.body = ''
        this.tags = []
        if (this.notebook)
          this.selected_notebook = this.notebook
        else
          this.selected_notebook = null
      }
    },
    async refresh() {
      this.loading = true
      if (this.hash) {
        while (!this.post) {
          await this.getPost()
          if (!this.post) {
            this.post = null
            await sleep(500)
            console.log("can't get content, retrying.")
          }
        }
      }
      await this.setState()
      this.loading = false
    },
    async submit() {
      this.saving = true
      let msg = null
      let body = this.body
      let title = this.title
      // if (this.is_private) {
      //   body = await encryption.encrypt_for_self(this.account, body)
      //   title = await encryption.encrypt_for_self(this.account, title)
      // }
      let post_content = {
        body: body,
        title: title,
        private: this.is_private,
        notebook: this.selected_notebook
        // tags: this.tags.map(t => t.text)
      }

      if (this.is_private)
        await encrypt_content_for_self(
          post_content, ['title', 'body', 'notebook'],
          this.account)

      // if (this.is_private) {
      //   body = encryption.encrypt_for_self(this.account, body)
      //   title = encryption.encrypt_for_self(this.account, title)
      // }


      if (this.hash)
        msg = await posts.submit(
          this.account.address, 'amend', post_content,
          {ref: this.hash,
           channel: this.channel,
           api_server: this.api_server,
           account: this.account})
      else
        msg = await posts.submit(
          this.account.address, 'note', post_content,
          {channel: this.channel,
           api_server: this.api_server,
           account: this.account})

      this.processing = true
      await sleep(200)
      this.processing = false

      msg.content = {
        body: this.body,
        title: this.title,
        private: this.is_private,
        notebook: this.selected_notebook
      }

      this.saving = false
      this.$q.notify({
        message: 'Note saved',
        color: "positive"
      })
      this.saved_private = this.is_private
      if (this.hash) {
        msg.hash = this.hash
        this.$store.commit('update_note', msg)
      }
      else {
        msg.hash = msg.item_hash
        this.$store.commit('add_note', msg)
        this.$router.push({ name: "edit-note", params: {hash: msg.item_hash} })
      }
    },
    async share() {
      let path = this.$router.resolve({'name': 'view-note', 'props': {'hash': this.hash}}).href
      let link = window.location.origin + "/" + path
      try {
        await copyToClipboard(link)
        this.$q.notify({
          message: "Sharing link copied to clipboard",
          color: "positive"
        })
      } catch {
        this.$q.notify({
          message: "Can't copy to clipboard",
          color: "negative"
        })
      }
    }
  },
  watch: {
    // async $route(to, from) {
    //   await this.refresh()
    // },
    async hash() {
      this.post = null
      await this.refresh()
    },
    async notebook() {
      if (this.notebook)
        this.selected_notebook = this.notebook
      else
        this.selected_notebook = null
    }
  },
  async created() {
    await this.refresh()
  }
}
</script>

<style lang="scss">
.note-edit-page {
  .tui-editor-defaultUI {
    border: none;
  }

  .te-toolbar-section,
  .te-mode-switch-section {
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:focus-within, &:hover {
    .te-toolbar-section,
    .te-mode-switch-section {
      opacity: 1;
    }
  }

  .CodeMirror {
    padding: 0 25px;
  }
}
</style>