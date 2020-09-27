<template>
  <q-btn :size="size ? size : '12px'" flat dense round icon="more_vert">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item
          clickable
          v-close-popup
          @click.prevent="download(file)"
          v-if="file.original_type === 'file'"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="cloud_download" />
          </q-item-section>
          <q-item-section>Download</q-item-section>
        </q-item>
        <q-separator v-if="file.content.private" />
        <q-item
          clickable
          v-close-popup
          @click.prevent="make_public(file)"
          v-if="file.content.private"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="public" />
          </q-item-section>
          <q-item-section>Make public &amp; share</q-item-section>
        </q-item>
        <q-separator
          v-if="!file.content.private && file.original_type === 'file'"
        />
        <q-item
          clickable
          v-close-popup
          @click.prevent="copy_public_link(file)"
          r
          v-if="!file.content.private && file.original_type === 'file'"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="share" />
          </q-item-section>
          <q-item-section>Get public link</q-item-section>
        </q-item>
        <q-separator />
        <q-item
          v-if="file.original_type === 'file'"
          clickable
          v-close-popup
          @click.prevent="view_blockchain_source(file)"
          r
        >
          <q-item-section avatar>
            <q-icon color="primary" name="find_in_page" />
          </q-item-section>
          <q-item-section>View blockchain source</q-item-section>
        </q-item>
        <q-separator v-if="file.original_type === 'file'" />

        <q-item
          clickable
          v-close-popup
          @click.prevent="archive(file)"
          v-if="account !== null && file.content.status === 'visible'"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="archive" />
          </q-item-section>
          <q-item-section>Archive</q-item-section>
        </q-item>
        <q-item
          clickable
          v-close-popup
          @click.prevent="unarchive(file)"
          v-else-if="account !== null"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="unarchive" />
          </q-item-section>
          <q-item-section>Un-Archive</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>


<script>
import { mapState } from "vuex";
import { aggregates, posts, encryption, store } from "aleph-js";
import { encrypt_content, decrypt_content } from "../services/encryption.js";
import moment from "moment";
import { navigate_to_file, retrieve_file } from "../services/files";
import { update_post } from "../services/posts";
import { format, copyToClipboard } from "quasar";
import ViewBlockchainSource from "./ViewBlockchainSource";

const { humanStorageSize } = format;
export default {
  name: "files-menu",
  props: {
    file: Object,
    size: String,
  },
  computed: {
    ...mapState([
      // map this.count to store.state.count
      "account",
      "network_id",
      "api_server",
      "channel",
      "ipfs_gateway",
    ]),
  },
  methods: {
    async download(filepost) {
      this.$q.loadingBar.start();
      await navigate_to_file(filepost, this.account, this.api_server, {
        download: true,
      });
      this.$q.loadingBar.stop();
    },
    async copy_public_link(filepost) {
      if (filepost.content.private) {
        this.$q.notify({
          message: `${filepost.content.filename} isn't public, sharing is not supported yet.`,
          color: "negative",
        });
      } else {
        console.log(filepost);
        let link = null;
        if (filepost.content.engine === "ipfs") {
          link = `${this.ipfs_gateway}${filepost.content.hash}`;
        } else {
          link = `${this.api_server}/api/v0/storage/raw/${filepost.content.hash}?find`;
        }
        try {
          await copyToClipboard(link);
          this.$q.notify({
            message: "Sharing link copied to clipboard",
            color: "positive",
          });
        } catch {
          this.$q.notify({
            message: "Can't copy to clipboard",
            color: "negative",
          });
        }
      }
    },
    async archive(filepost) {
      await this.change_status(filepost, "archived");

      this.$q.notify({
        message: `${filepost.content.filename} archived`,
        color: "positive",
      });
    },
    async unarchive(filepost) {
      await this.change_status(filepost, "visible");

      this.$q.notify({
        message: `${filepost.content.filename} recovered`,
        color: "positive",
      });
    },
    async change_status(filepost, new_status) {
      let msg = await update_post(
        filepost,
        { status: new_status },
        ["filename", "mimetype", "thumbnail_url"],
        this.account,
        this.api_server,
        this.channel
      );
      this.$store.commit("update_file", msg);
    },
    async make_public(filepost) {
      if (filepost.original_type == "file") {
        this.$q
          .dialog({
            title: "Making file public",
            message:
              "Your file will be made public and shared on IPFS, are you sure?",
            cancel: true,
            persistent: true,
          })
          .onOk(
            async function () {
              let content = await retrieve_file(
                filepost,
                this.account,
                this.api_server
              );
              let file_message = await store.submit(this.account.address, {
                fileobject: new Blob([content], {
                  type: filepost.content.mimetype,
                }),
                channel: this.channel,
                api_server: this.api_server,
                account: this.account,
                storage_engine: "ipfs",
              });

              let msg = await update_post(
                filepost,
                {
                  private: false,
                  store_message: file_message.item_hash,
                  hash: file_message.content.item_hash,
                  engine: file_message.content.item_type,
                },
                ["filename", "mimetype", "thumbnail_url"],
                this.account,
                this.api_server,
                this.channel
              );
              this.$store.commit("update_file", msg);

              this.$q.notify({
                message: `${filepost.content.filename} made public and pinned on IPFS`,
                color: "positive",
              });
            }.bind(this)
          );
      } else {
        let msg = await update_post(
          filepost,
          {
            private: false,
          },
          ["filename", "mimetype", "thumbnail_url"],
          this.account,
          this.api_server,
          this.channel
        );
        this.$store.commit("update_file", msg);
        this.$q.notify({
          message: `${filepost.content.filename} made public`,
          color: "positive",
        });
      }
    },
    async view_blockchain_source(filepost) {
      if (filepost.original_type == "file") {
        let content = await retrieve_file(
          filepost,
          this.account,
          this.api_server
        );
        this.$q
          .dialog({
            component: ViewBlockchainSource,

            // optional if you want to have access to
            // Router, Vuex store, and so on, in your
            // custom component:
            parent: this, // becomes child of this Vue node
            // ("this" points to your Vue component)
            // (prop was called "root" in < 1.1.0 and
            // still works, but recommending to switch
            // to the more appropriate "parent" name)

            // props forwarded to component
            // (everything except "component" and "parent" props above):
            is_owner:
              filepost.address === (this.account && this.account.address),
            text: "SOME TEXT PROP",
            file: filepost,
            content,
            persistent: true,
          })
          .onOk(
            async function () {
              let content = await retrieve_file(
                filepost,
                this.account,
                this.api_server
              );
              console.log("parent ok");
            }.bind(this)
          );
      }
    },
  },
};
</script>