<template>
  <q-page>
    <div class="note" v-if="address">
      <q-card class="note-card text-black q-pa-md q-my-lg">
        <div class="column q-mb-md q-mt-md" v-if="notebooks">
          <h5 class="col-grow q-mb-sm">Public Notebooks by {{address}}</h5>
          <notes-list
            :notes="notes"
            :notebooks="notebooks"
            :public_notebook="true"
            :default_notebook="viewed_notebook"
            title="Notes"
            show-selector
            padding
            show-search
            v-model="listmodel"
          />
        </div>
      </q-card>
    </div>
    <div v-else-if="!loading" class="fixed-center text-center text-mono">
      <span style="font-size: 100px;">?</span>
      <br />Not found
    </div>
    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapState } from "vuex";
import { aggregates, posts } from "aleph-js";
import VueMarkdown from "vue-markdown";
import NotesList from "../../components/NotesList";
export default {
  name: "view-notebook",
  data() {
    return {
      notes: [],
      notebooks: [],
      notebook: null,
      viewed_notebook: "",
      title: "",
      body: "",
      author_profile: {},
      processing: false,
      tags: [],
      is_private: true,
      saving: false,
      loading: false,
      listmodel: {
        notebook: null
      }
    };
  },
  computed: {
    ...mapState([
      // map this.count to store.state.count
      "account",
      "network_id",
      "api_server",
      "channel",
      "profiles",
      "balance_info",
      "mb_per_aleph",
      "files"
      // "notes"
    ])
  },
  props: ["address", "uuid"],
  components: {
    VueMarkdown,
    NotesList
  },
  methods: {
    async getPost() {
      let response = await posts.get_posts(["note"], {
        hashes: [this.hash],
        api_server: this.api_server
      });

      // let response = await axios.get(`${this.api_server}/api/v0/posts.json?hashes=${this.hash}`)
      if (response.posts.length) this.post = response.posts[0];
      else this.post = null;
    },
    async update_notes() {
      try {
        let result = await posts.get_posts("note", {
          pagination: 1000,
          addresses: [this.address],
          api_server: this.api_server
        });
        // console.log(result);
        let post_list = [];
        let i = 0;
        for (let post of result.posts) {
          i += 1;
          // try {
          //   // if (!post.content.private) {
          //   //   post.content.title = encryption.decrypt(state.account, post.content.title)
          //   //   post.content.encrypted_body = post.content.body
          //   //   post.content.body = encryption.decrypt(state.account, post.content.body)
          //   // }
          // } catch (e) {
          //   // console.error("Can't decrypt...", e);
          // }
          post_list.push(post);
          // if (progress_callback !== undefined)
          //   await progress_callback(i / result.posts.length)
        }
        this.notes = post_list;
      } catch (e) {
        console.error(e);
      }
    },
    async setState() {
      if (this.address) {
        this.banner_hash = this.viewed_notebook;
      }
    },

    async getNotebook(address, uuid) {
      try {
        let notebooks = await aggregates.fetch_one(
          address,
          // this.account.address,
          "notebooks",
          {
            api_server: this.api_server
          }
        );
        // https://my-beta.aleph.im/#/l/nb/NULSd6HgfMv9LaD48jivoysVDe5xER6q9KaWm/8c8c3258-8545-46f9-882d-59f31c54af22
        // https://my-beta.aleph.im/#/l/nb/NULSd6HgfsBsNaTsH623Kn9UCNFKyVvaMWeid/c26ab63b-c50c-41a9-b944-85e7a5baab7f
        const public_notebooks = Object.keys(notebooks).filter(notebook => {
          if (!notebooks[notebook].private) {
            return true;
          }
        });
        const address_public_notebooks = {};
        public_notebooks.forEach(notebook => {
          address_public_notebooks[notebook] = notebooks[notebook];
        });
        this.notebooks = address_public_notebooks; // Only set public ones
        this.viewed_notebook = uuid;
        if (uuid) {
          let notebook = notebooks[uuid];
          this.notebook = notebook;
        }
        return true;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    async refresh() {
      this.loading = true;
      if (this.address) {
        // console.log(this.uuid);
        // console.log(this.address);
        try {
          await this.getNotebook(this.address, this.uuid);
          // await this.setState();
          await this.update_notes();
        } catch (e) {
          this.loading = false;
        }
      }
      // if (this.post !== null) {
      //   await this.$fetch_profile(this.post.address);
      //   let profile = this.profiles[this.post.address];
      //   if (profile === undefined || profile === null) profile = {};
      //   this.author_profile = profile;
      // } else {
      //   this.author_profile = {};
      // }
      this.loading = false;
    }
  },
  watch: {
    // async $route(to, from) {
    //   await this.refresh()
    // },
    async address() {
      await this.refresh();
    },
    async uuid() {
      await this.refresh();
    }
  },
  async created() {
    await this.refresh();
  }
};
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