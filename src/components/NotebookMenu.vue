<template>
  <q-btn :size="size?size:'12px'" flat dense round icon="more_vert">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item-label header>{{notebook.name}}</q-item-label>
        <q-item clickable v-close-popup @click.prevent="rename">
          <q-item-section avatar>
            <q-icon color="primary" name="edit" />
          </q-item-section>
          <q-item-section>Rename</q-item-section>
        </q-item>
        <q-separator v-if="notebook.private" />
        <q-item clickable v-close-popup @click.prevent="make_public" v-if="notebook.private">
          <q-item-section avatar>
            <q-icon color="primary" name="public" />
          </q-item-section>
          <q-item-section>Make public</q-item-section>
        </q-item>
        <q-separator v-if="!notebook.private" />
        <q-item clickable v-close-popup @click.prevent="copy_public_link" v-if="!notebook.private">
          <q-item-section avatar>
            <q-icon color="primary" name="share" />
          </q-item-section>
          <q-item-section>Get public link</q-item-section>
        </q-item>
        <q-separator v-if="count === 0" />
        <q-item clickable v-close-popup @click.prevent="archive" v-if="count === 0">
          <q-item-section avatar>
            <q-icon color="primary" name="archive" />
          </q-item-section>
          <q-item-section>Archive</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>


<script>
import { mapState } from "vuex";
import { aggregates, posts, encryption, store } from "aleph-js";
import {
  encrypt_content,
  encrypt_content_for_self,
  decrypt_content
} from "../services/encryption.js";
import moment from "moment";
import { format, copyToClipboard } from "quasar";
const { humanStorageSize } = format;
export default {
  name: "notebook-menu",
  props: {
    notebookKey: String,
    notebook: Object,
    count: Number
  },
  computed: {
    ...mapState([
      // map this.count to store.state.count
      "account",
      "network_id",
      "api_server",
      "channel",
      "ipfs_gateway",
      "notebooks"
    ])
  },
  methods: {
    async make_public() {
      let new_content = Object.assign({}, this.notebook);
      new_content["private"] = false;
      debugger;
      await this.change(new_content);
      this.$emit("deselect");
    },
    async copy_public_link() {
      let notebook = Object.assign({}, this.notebook);
      // console.log(notebook);
      // console.log(this.notebooks);
      // console.log(this.notebookKey);
      // console.log(aggregates);
      let notebooks = await aggregates.fetch_one(
        this.account.address,
        // this.account.address,
        "notebooks",
        {
          api_server: this.api_server
        }
      );

      let link = null;
      link = `https://my-beta.aleph.im/#/l/nb/${this.account.address}/${this.notebookKey}`;
      // if (filepost.content.engine === "ipfs") {
      //   link = `${this.ipfs_gateway}${filepost.content.hash}`;
      // } else {
      //   link = `${this.api_server}/api/v0/storage/raw/${filepost.content.hash}?find`;
      // }
      try {
        await copyToClipboard(link);
        this.$q.notify({
          message: "Sharing link copied to clipboard",
          color: "positive"
        });
      } catch {
        this.$q.notify({
          message: "Can't copy to clipboard",
          color: "negative"
        });
      }
    },
    async rename() {
      this.$q
        .dialog({
          // dark: true,
          title: "Rename notebook",
          message: "Notebook name:",
          prompt: {
            model: this.notebook.name,
            type: "text" // optional
          },
          cancel: true,
          persistent: true
        })
        .onOk(async data => {
          if (!data) return;

          let new_content = Object.assign({}, this.notebook);
          new_content["name"] = data;
          await this.change(new_content);
          this.$emit("deselect");
        });
    },
    async change(new_content) {
      let unencrypted_content = Object.assign({}, new_content);
      if (new_content.private)
        await encrypt_content_for_self(
          new_content,
          ["name", "description"],
          this.account
        );

      await aggregates.submit(
        this.account.address,
        "notebooks",
        {
          [this.notebookKey]: new_content
        },
        {
          account: this.account,
          channel: this.channel,
          api_server: this.api_server
        }
      );
      this.$store.commit("update_notebook", {
        key: this.notebookKey,
        notebook: unencrypted_content
      });
    },
    async archive() {
      let new_content = Object.assign({}, this.notebook);
      new_content["status"] = "hidden";
      await this.change(new_content);
      this.$emit("deselect");
    }
  }
};
</script>