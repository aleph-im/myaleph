<template>
  <q-page>

    <q-parallax
      src="statics/outside/galaxy.jpg"
      class="hero"
      :speed="0.5"
    >
      <div class="hero-content">
        <h5 class="text-white" style="z-index: 100">
          Take back your digital life. MyAleph is...
        </h5>
      </div>
      <div class="bottombox"></div>
      <div class="leftbox"></div>
      <div class="rightbox gt-xs"></div>
      <q-parallax class="floating right gt-md" :speed="1.0">
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
            <q-splitter v-model="splitter">
            <!-- <div class="fit row"> -->
              <!-- <div class="col-2 gt-sm"> -->
              <template v-slot:before>
                <q-scroll-area style="height: 450px">
                  <notes-list :notes="notes" title="Notes" padding no-links
                              :active-item="selected_note" @itemclick="note_clicked" />
                </q-scroll-area>
                <q-btn round push size="md" color="primary" icon="note_add"
                style="position: absolute; bottom: 1rem; right: 1rem" />
              <!-- </div> -->
              </template>
              <template v-slot:after>
              <!-- <div class="col-grow"> -->
                <div class="column note-edit-page q-pl-sm">
                  <div class="col-auto row justify-between items-center">
                    <h4 class="q-ma-sm col-grow">
                      {{selected_note.content.title||'Note Title'}}
                      <q-popup-edit v-model="selected_note.content.title">
                        <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
                          <q-input
                            autofocus
                            dense
                            hint="Your title"
                            v-model="selected_note.content.title"
                          >
                          </q-input>
                        </template>
                      </q-popup-edit>
                    </h4>
                    <span class="q-ma-sm">
                      <template>
                        {{selected_note.content.private?'encrypted':'public'}}
                      </template>
                      <q-toggle
                        v-model="selected_note.content.private"
                        checked-icon="lock"
                        color="green"
                        unchecked-icon="lock_open"
                      />
                      <!-- <q-btn push color="info" round icon="share" size="xs" @click.stop="share"  class="q-mr-sm" /> -->
                      <q-btn push color="primary" rounded icon="save" label="Save" size="sm" @click.stop="submit" />
                    </span>
                  </div>
                  <div class="col-grow">
                    <editor v-model="selected_note.content.body" height="350px" mode="wysiwyg" class="note-editor" />
                  </div>
                  <div class="col-auto row justify-between q-ma-sm">
                    <q-btn push color="primary" rounded icon="save" label="Save" size="sm" @click.stop="submit" />
                  </div>
                </div>
              <!-- </div> -->
              </template>
            <!-- </div> -->
            </q-splitter>
          </q-tab-panel>
          <q-tab-panel name="files">
            <div class="text-h6">Files</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
          <q-tab-panel name="photos">
            <div class="text-h6">Photos</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
    <div class="q-pa-xl">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sollicitudin neque leo, ac elementum risus finibus sed. Nullam quis imperdiet diam. Ut posuere, velit eu condimentum suscipit, neque odio maximus ex, sit amet sodales ante augue ac velit. Quisque tincidunt placerat lacus, sed tincidunt urna euismod id. Nulla non fringilla nisl, ut rutrum orci. Cras non vestibulum erat, quis porttitor augue. Nunc egestas gravida justo, eget iaculis magna pharetra vitae.
      </p>
      <p>
        Etiam ac lacus neque. Nam eget consequat dui, vel egestas dui. Etiam id enim et ex pretium rutrum. Vestibulum sed consectetur magna, nec laoreet elit. Morbi pulvinar pharetra dui at pulvinar. Vestibulum auctor, ex eu iaculis finibus, nunc quam finibus eros, tincidunt interdum libero magna a purus. Ut vestibulum sed metus non auctor. Mauris nec iaculis nulla. Curabitur vitae lacus sed orci posuere blandit. Curabitur commodo porttitor velit, sit amet efficitur eros imperdiet eu. Nullam ut condimentum sapien, eu molestie mauris. Vestibulum bibendum tristique venenatis. Suspendisse accumsan ut mauris non faucibus. Fusce in augue sed tellus ultrices pulvinar nec ac libero. Sed gravida, enim eu blandit sollicitudin, nulla odio bibendum elit, id interdum metus mauris id mi. Aenean dapibus ut metus a faucibus.
      </p>
      <p>
        Aliquam accumsan gravida neque, sed porttitor turpis sagittis ac. Curabitur malesuada lobortis dolor eget posuere. Mauris id commodo nulla, nec luctus ante. Vestibulum nunc ex, sagittis ut porttitor eu, sodales vel mauris. Quisque pellentesque felis orci, ut cursus mauris vestibulum nec. Phasellus volutpat, odio vel ullamcorper vehicula, odio eros efficitur enim, ac mattis orci erat eget neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque viverra purus quis imperdiet suscipit. Maecenas in fermentum turpis.
      </p>
      <p>
        Phasellus sed ipsum eget eros commodo dignissim a ut nibh. In fermentum rhoncus ante, id posuere mi vehicula eu. Phasellus ornare rhoncus nisi, in faucibus metus porta vel. Sed purus sapien, lacinia vel lacinia in, commodo non neque. Aliquam erat volutpat. Mauris a libero sed sem ornare vulputate eget eget diam. In ullamcorper magna et mauris vestibulum sagittis.
      </p>
      <p>
        Vivamus eu cursus purus. Duis vitae euismod diam, ut posuere dui. Vivamus id sagittis lacus. Morbi dapibus non risus a aliquam. Integer hendrerit diam egestas diam placerat, a finibus risus mattis. Proin mattis lectus enim, a pretium nisl euismod ac. Quisque arcu purus, maximus id erat sed, malesuada volutpat eros. Nullam convallis suscipit lorem, id gravida neque scelerisque ut. Praesent varius molestie augue ut blandit. Proin luctus nibh vitae ligula ultricies luctus. 
      </p>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts } from 'aleph-js'
import NotesList from '../../components/NotesList'
import { Editor } from '@toast-ui/vue-editor'
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
export default {
  name: 'Home',
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
      demotab: 'notes',
      splitter: 20,
      demo_address: 'NULSd6HgYtEzGV6LmtYa2eEyREzwumJmxhcdE',
      notes: [

      ],
      selected_note: {
        content: {}
      }
    }
  },
  methods: {
    updateFiles() {

    },
    async updateNotes() {
      let result = await posts.get_posts('note', {
        pagination: 10000,
        addresses: [this.demo_address],
        api_server: this.api_server
      })
      this.notes = result.posts.filter((p) => (!p.content.private))
      this.selected_note = this.notes[this.notes.length-1]
    },
    note_clicked(note) {
      this.selected_note = note
    }
  },
  async mounted() {
    await this.updateNotes()
  },
  components: {
    NotesList, Editor
  }
}
</script>

<style lang="scss">
.hero {
  margin-top: -50px;
  // .leftbox {
  //   background: transparent url(../../statics/outside/leftbox.svg) left top/contain no-repeat;
  //   height: 102%;
  //   position: absolute;
  //   width: 100%;
  //   left: 0;
  //   top: -2px;
  // }

  border-bottom-left-radius: 30% 2%;
  border-bottom-right-radius: 30% 5%;

  .rightbox, .leftbox, .leftbox-sm {
    background: transparent url(../../statics/outside/rightbox.svg) right top/contain no-repeat;
    height: 40%;
    position: absolute;
    width: 100%;
    left: 0;
    top: -2px;

    &.leftbox-sm,
    &.leftbox {
      transform:scale(-1,1);
      top: -20%;
    }
  }
  // .bottombox {
  //   background: transparent url(../../statics/ux/wave4.svg) left -20px/100% no-repeat;
  //   height: 100%;
  //   width: 100%;
  //   position: absolute;
  //   left: 0;
  //   bottom: 0;
  //   transform:scale(1,-1);
  //   filter: grayscale(100%) brightness(10);
  // }
}

.floating {
  position: absolute;
  height: 100%;
  &.right {
    width: 300px;
    right: 5vw;
  }
}

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

.hero-content {
  padding-bottom: 5rem;
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