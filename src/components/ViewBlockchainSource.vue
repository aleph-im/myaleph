<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <q-card v-if="is_owner" class="q-mb-md">
          <q-card-section>
            <h5
              class="text-h6 q-my-xs text-center cursor-pointer"
              @click="download_file()"
            >
              Download
            </h5>
          </q-card-section>
        </q-card>
        <q-list bordered class="rounded-borders">
          <q-expansion-item
            expand-separator
            v-if="file.confirmations"
            label="Blockchain Confirmations"
          >
            <q-card>
              <q-card-section>
                <template v-for="confirmation of file.confirmations">
                  <q-card
                    :key="confirmation.height"
                    class="column note-card overflow-auto q-pa-md q-my-md"
                  >
                    <div class="row">
                      <p class="q-mx-xs text-weight-bold">
                        Confirmed on Blockchain
                      </p>
                      <p>{{ confirmation.chain }}</p>
                    </div>
                    <div class="row">
                      <p class="q-mx-xs text-weight-bold">Block Height</p>
                      <p>{{ confirmation.height }}</p>
                    </div>
                    <!-- <div class="row">
                      <p class="q-mx-xs text-weight-bold">Hash Binary</p>
                      <p class="overflow-auto">{{confirmation.hash.$binary}}</p>
                    </div>-->
                  </q-card>
                </template>
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            v-if="file.address"
            expand-separator
            label="Owner Address"
          >
            <q-card>
              <q-card-section class="q-mx-xs text-weight-bold">{{
                file.address
              }}</q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            v-if="file.sender"
            expand-separator
            label="Sender Address"
          >
            <q-card>
              <q-card-section class="q-mx-xs text-weight-bold">{{
                file.sender
              }}</q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Total Revision Count"
            v-if="is_owner"
          >
            <q-card>
              <q-card-section class="q-mx-xs text-weight-bold">{{
                revision_count
              }}</q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item expand-separator label="Signature">
            <q-card>
              <q-card-section class="overflow-auto text-weight-bold">{{
                file.signature
              }}</q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item expand-separator label="Timestamp">
            <q-card>
              <q-card-section class="overflow-auto text-weight-bold">{{
                (file.time * 1000) | moment("LLL")
              }}</q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item expand-separator label="Hash">
            <q-card>
              <q-card-section class="overflow-auto text-weight-bold">{{
                file.hash || file.item_hash
              }}</q-card-section>
            </q-card>
          </q-expansion-item>

          <q-expansion-item expand-separator label="Type">
            <q-card>
              <q-card-section class="overflow-auto text-weight-bold">{{
                file.type
              }}</q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Original Ref"
            v-if="is_owner"
          >
            <q-card>
              <q-card-section class="overflow-auto text-weight-bold">{{
                file.original_ref
              }}</q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState } from "vuex";
import { encryption, store, posts } from "aleph-js";
import { navigate_to_file, retrieve_file_url } from "../services/files.js";
import { decrypt_content } from "../services/encryption.js";
import moment from "moment";

export default {
  data: () => ({
    revision_count: 0,
  }),
  props: {
    file: Object,
    content: Blob || Object,
    is_owner: Boolean,
  },
  computed: {
    ...mapState([
      // map this.count to store.state.count
      "account",
      "api_server",
    ]),
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    async show() {
      // console.log(this.file);
      // console.log(this.content);
      // console.log(this.account);

      let { posts: revisions } = await posts.get_posts(["amend"], {
        refs: [this.file.ref],
        addresses: [this.file.sender],
        api_server: this.api_server,
      });

      this.revision_count = revisions.length;

      if (this.file.content.private) {
        let content = await store.retrieve(this.file.content.hash, {
          api_server: this.api_server,
        });
        const decrypted_content = await encryption.decrypt(
          this.account,
          content,
          {
            as_hex: false,
            as_string: false,
          }
        );
        // console.log(decrypted_content);
      }
      console.log(this.file);
      console.log(this.file.content);
      this.$refs.dialog.show();
    },

    async download_file() {
      console.log(this.file);
      if (this.file.private || this.file.content.private) {
        await decrypt_content(
          this.file.content,
          ["filename", "mimetype", "thumbnail_url"],
          this.account
        );
      }

      this.$emit("item-clicked", this.file);

      console.log(this.file.content);
      let mimetype = this.file.content.mimetype;
      console.log("hey");
      if (this.account) {
        console.log("hey");
        if (mimetype && mimetype.startsWith("image/")) {
          this.$q.loadingBar.start();
          let file_url = await retrieve_file_url(
            this.file,
            this.account,
            this.api_server,
            { revoke_timeout: 1000 }
          );
          if (file_url) {
            this.$root.$emit("open_lightbox", [file_url], 0);
          } else {
            this.$q.notify({
              message: "Can't load file",
              color: "negative",
            });
          }
          this.$q.loadingBar.stop();
        } else {
          await navigate_to_file(this.file, this.account, this.api_server, {
            download: true,
          });
        }
      } else {
        if (mimetype && mimetype.startsWith("image/")) {
          this.$q.loadingBar.start();

          console.log(this.file.content);

          let file_url = await retrieve_file_url(
            this.file,
            this.account,
            this.api_server,
            { revoke_timeout: 1000 }
          );
          if (file_url) {
            this.$root.$emit("open_lightbox", [file_url], 0);
          } else {
            this.$q.notify({
              message: "Can't load file",
              color: "negative",
            });
          }
          this.$q.loadingBar.stop();
        } else {
          await navigate_to_file(this.file, this.account, this.api_server, {
            download: true,
          });
        }
      }
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide();
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide");
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok");
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide();
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide();
    },
  },
};
</script>