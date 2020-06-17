<template>
  <q-page>

    <q-parallax
      src="statics/outside/galaxy.jpg"
      class="hero"
      :speed="0.5"
      :height="$q.screen.gt.xs ? 500 : 300"
    >
      <div class="content">
        <p class="text-mono title">
          MyAleph is <vue-typer :text="typer_text"></vue-typer> storage<br />
          to take back your digital life.
          <q-btn v-if="!account"
                 push color="primary" label="Join us!"
                 @click="$root.$emit('open_onboarding')" no-caps />
          <q-btn v-else push color="primary"  :to="{name:'profile'}" no-caps label="Enter!" />
        </p>
      </div>
      <div class="bottombox"></div>
      <div class="leftbox"></div>
      <!-- <div class="rightbox gt-xs"></div> -->
      <q-parallax class="floating right gt-sm" :speed="1.0">
        <template v-slot:media="scope">
          <div></div>
        </template>
        <template v-slot:content="scope">
          <div class="absolute column items-center"
              :style="{
                top: ((scope.percentScrolled)* 50) + '%',
                left: ((scope.percentScrolled*-1) * 30) + 50 + '%',
                right: 0
              }">
            <img src="statics/outside/astronaut.svg" />
          </div>
        </template>
      </q-parallax>
    </q-parallax>
    <div class="demo text-white">
      What does it looks like?
      <q-card class="demo-card text-black">
        <q-tab-panels v-model="demotab" animated>
          <q-tab-panel name="notes">
            <q-splitter v-model="splitter" v-if="$q.screen.gt.xs">
            <!-- <div class="fit row"> -->
              <!-- <div class="col-2 gt-sm"> -->
              <template v-slot:before>
                <q-scroll-area style="height: 450px">
                  <notes-list :notes="notes" title="Notes" padding no-links as-list
                              :active-item="selected_note" @itemclick="note_clicked" />
                </q-scroll-area>
                <q-btn round push size="md" color="primary" icon="note_add"
                style="position: absolute; bottom: 1rem; right: 1rem" />
              <!-- </div> -->
              </template>
              <template v-slot:after>
              <!-- <div class="col-grow"> -->
                <mock-note-edit :note="selected_note" @submit="submit" />
              <!-- </div> -->
              </template>
            <!-- </div> -->
            </q-splitter>
            <div v-else>
              <mock-note-edit :note="selected_note" @submit="submit" v-if="selected_note" show-back @back="selected_note=null" />
              <div v-else>
                <q-scroll-area style="height: 450px">
                  <notes-list :notes="notes" title="Notes" padding no-links as-list
                              :active-item="selected_note" @itemclick="note_clicked" />
                </q-scroll-area>
                <q-btn round push size="md" color="primary" icon="note_add"
                style="position: absolute; bottom: 1rem; right: 1rem" />
              </div>

            </div>
          </q-tab-panel>
          <q-tab-panel name="files">
            <q-scroll-area style="height: 450px">
              
              <div class="row justify-between items-center">
                <q-btn v-if="current_folder" round flat icon="arrow_back"
                  @click="select_folder(null)" />
                <span v-if="current_folder" class="col-grow">
                  <h4 class="q-my-sm col-grow">
                    <q-icon name="archive" v-if="current_folder.content.status === 'archived'" color="grey" />
                    {{current_folder.content.filename}}
                  </h4>
                </span>
                <h4 v-else class="q-my-sm col-grow">
                  Files
                </h4>
                <div class="col-md-2">
                  <q-select v-model="sorting"
                  :options="sort_options" emit-value map-options
                  label="Sort by" round dense flat options-dense />
                </div>
                <div>
                  <!-- <template v-if="$q.screen.gt.xs">
                    {{show_archived?'archived visible':''}}
                  </template> -->
                  <q-toggle
                    v-model="show_archived"
                    checked-icon="archive"
                    color="blue"
                    unchecked-icon="visibility_off"
                  />
                  <q-tooltip>Display archived items</q-tooltip>
                </div>
                <file-menu v-if="current_folder" :file="folder_object" size="md" />
              </div>

              <files-list :files="displayed_files" />
            </q-scroll-area>
            <q-fab
              icon="add"
              direction="up"
              color="primary"
              style="position: absolute; bottom: 1rem; right: 1rem"
            >
              <q-fab-action @click="submit" color="primary" icon="create_new_folder">
                <q-tooltip anchor="center left" self="center right">New folder</q-tooltip>
              </q-fab-action>
              <q-fab-action @click="submit" color="primary" icon="cloud_upload">
                <q-tooltip anchor="center left" self="center right">Upload file</q-tooltip>
              </q-fab-action>
            </q-fab>
          </q-tab-panel>
          <q-tab-panel name="photos">
            <q-scroll-area style="height: 450px">
              <div class="text-h4">Photos</div>
              Work in progress, coming soon!
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />

        <q-tabs
          v-model="demotab"
          class="text-primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="notes" icon="img:statics/ux/icons/note.svg" label="Notes" />
          <q-tab name="files" icon="img:statics/ux/icons/folder-cloud.svg" label="Files" />
          <q-tab name="photos" icon="img:statics/ux/icons/photo.svg" label="Photos" />
        </q-tabs>
      </q-card>
    </div>
    <div class="q-pa-xl q-px-sm-lg q-px-md-xl hero-section">
      <q-parallax class="floating left large gt-sm" :speed="1.0"
      :height="$q.screen.gt.xs ? 500 : 300">
        <template v-slot:media="scope">
          <div></div>
        </template>
        <template v-slot:content="scope">
          <div class="absolute column items-center"
              :style="{
                top: ((scope.percentScrolled)*50) + '%',
                left: (scope.percentScrolled * 50) + '%'
              }">
            <img src="statics/outside/woman_server.svg" />
          </div>
        </template>
      </q-parallax>
      <q-parallax class="floating right large gt-sm" :speed="1.0"
      :height="$q.screen.gt.xs ? 500 : 300">
        <template v-slot:media="scope">
          <div></div>
        </template>
        <template v-slot:content="scope">
          <div class="absolute column items-center"
              :style="{
                top: ((scope.percentScrolled)*10) + '%',
                left: ((scope.percentScrolled*-1) * 50) + '%',
                right: 0
              }">
            <img src="statics/outside/locked_computer.svg" />
          </div>
        </template>
      </q-parallax>
      <q-parallax class="floating right gt-sm" :speed="1.0"
        :style="{
          left: 'calc(50% + 400px)'
          }"
        :height="$q.screen.gt.xs ? 500 : 300">
        <template v-slot:media="scope">
          <div></div>
        </template>
        <template v-slot:content="scope">
          <div class="absolute column items-center"
              :style="{
                top: ((scope.percentScrolled)* 50) + 40 + '%',
                left: ((scope.percentScrolled*-1) * 30) + 70 + '%',
                right: 0
              }">
            <img src="statics/outside/man_laptop.svg" />
          </div>
        </template>
      </q-parallax>
      <div class="content">
        <h4 class="text-mono">
          Fully encrypted, privacy by design.
        </h4>
        <div class="row q-gutter-sm">
          <div class="col-sm">
            <p>
              Trade secrets, your family privacy, and all your data should be yours, and yours alone. Unless of course you explicitly want to share it.
            </p>
            <p>
              All of your data is encrypted using state-of-the-art algorithms. This ensures only you can ever access this data. 
            </p>
            <p>
              Multiple nodes handle your data, but no one will ever know the content of your files. 
              No single company has control over your data ensuring true data decentralization.
            </p>
            <div class="row justify-between">
              <img src="statics/outside/man_laptop.svg" class="gt-xs lt-md"/>
              <q-btn v-if="!account"
                      push color="primary" label="Join us!"
                      @click="$root.$emit('open_onboarding')" no-caps />
              <q-btn v-else push color="primary"  :to="{name:'profile'}" no-caps label="Enter!" />
            </div>
          </div>
          <div class="col-sm lt-md">
            <img src="statics/outside/locked_computer.svg" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
import NotesList from '../../components/NotesList'
import FilesList from '../../components/FilesList'
import MockNoteEdit from './MockNoteEdit'
import { Editor } from '@toast-ui/vue-editor'
import { VueTyper } from 'vue-typer'
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
export default {
  name: 'Home',
  computed: {
      displayed_files() {
        let files = this.files
        if (this.current_folder)
          files = files.filter((v) => v.original_ref == this.current_folder.hash)
        else
          files = files.filter((v) => (!v.original_ref))

        if (!this.show_archived)
          files = files.filter((v) => (v.content.status==='visible'))

        files.sort((f1, f2) => {
          if (f1.original_type == 'file' && f2.original_type == 'folder') return 1;
          if (f1.original_type == 'folder' && f2.original_type == 'file') return -1;

          if (this.sorting === 'time') {
            if (f1.time < f2.time) return 1;
            if (f2.time < f1.time) return -1;
          }
          if (this.sorting === 'name') {
            if (f1.content.filename.toLowerCase() < f2.content.filename.toLowerCase()) return -1;
            if (f2.content.filename.toLowerCase() < f1.content.filename.toLowerCase()) return 1;
          }
          if (this.sorting === 'size') {
            if (f1.content.size < f2.content.size) return 1;
            if (f2.content.size < f1.content.size) return -1;
          }
        })
        return files
      },
      profile() {
        if (this.profiles[this.account.address] != undefined){
          return this.profiles[this.account.address]
        }
        return {}
      },
      ... mapState([
        // map this.count to store.state.count
        'account',
        'network_id',
        'api_server',
        'channel',
        'profiles'
      ])
  },
  data() {
    return {
      demotab: 'notes',
      splitter: 20,
      demo_address: 'NULSd6HgYtEzGV6LmtYa2eEyREzwumJmxhcdE',
      files: [],
      notes: [

      ],
      selected_note: {
        content: {}
      },
      typer_text: [
        'a secure',
        'an encrypted',
        'a distributed',
        'an interactive'
      ],
      current_folder: null,
      show_archived: false,
      sorting: 'time',
      sort_options: [
        {
          label: 'Last updated',
          value: 'time'
        },
        {
          label: 'Name',
          value: 'name'
        },
        {
          label: 'Size',
          value: 'size'
        }
      ]
    }
  },
  methods: {
    async updateFiles() {
      let result = await posts.get_posts('file', {
        pagination: 10000,
        addresses: [this.demo_address],
        api_server: this.api_server
      })
      this.files = result.posts.filter(
          (p) => (!p.content.private)
        )
    },
    async updateNotes() {
      let result = await posts.get_posts('note', {
        pagination: 10000,
        addresses: [this.demo_address],
        api_server: this.api_server
      })
      this.notes = result.posts.filter((p) => (!p.content.private)).sort((a, b) => (b.time > a.time))
      this.selected_note = this.notes[0]
    },
    note_clicked(note) {
      this.selected_note = note
    },
    submit() {
      this.$q.notify({
        message: 'This is just a demo, join us to save your data!'
      })
    }
  },
  async mounted() {
    await this.updateNotes()
    await this.updateFiles()
  },
  components: {
    NotesList, FilesList, MockNoteEdit, VueTyper
  }
}
</script>

<style lang="scss">

.demo {
  position: relative;
  margin: 0 auto;
  margin-top: -5rem;
  max-width: 980px;
  padding: 0 10px;
  .demo-card {
    .q-tab-panel {
      position: relative;
    }
  }
}

.note-edit-page {
  .tui-editor-defaultUI {
    border: none;
  }

  .te-toolbar-section,
  .te-mode-switch-section {
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:focus-within {
    .te-toolbar-section {
      opacity: 1;
    }
  }
}
</style>
