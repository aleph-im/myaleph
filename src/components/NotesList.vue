<template>
  <q-list :padding="padding" :dense="dense">
    <div v-if="searching">
    </div>
    <q-item-label header v-if="title && (!searching)" class="row items-center justify-between">
      <span v-if="(search_text === '') && (!showSelector)" class="col-2">{{title}}</span>
      <!-- <q-select v-if="(search_text === '') && showSelector" standout="bg-teal text-white" label="Notes" v-model="selected_view" :options="options" /> -->
      <q-btn-dropdown v-if="(search_text === '') && showSelector"
        no-caps flat
      >
        <template v-slot:label>
          <div class="row justify-content no-wrap flex-grow" v-if="!notebook">
            <q-icon left name="all_inbox" />
            <div class="text-center">
              All notes
            </div>
          </div>
          <div class="row justify-content no-wrap flex-grow" v-else>
            <q-icon left name="all_inbox" />
            <div class="text-center">
              Notes in {{notebooks[notebook].name}}
            </div>
          </div>
        </template>

        <q-list>
          <q-item clickable v-close-popup @click="setNotebook(null)">
            <q-item-section avatar>
              <q-icon name="all_inbox" color="grey" />
            </q-item-section>
            <q-item-section>All notes</q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header v-if="not_empty_notebooks.length">Notebooks</q-item-label>

          <q-item clickable v-close-popup v-for="key of not_empty_notebooks" @click="setNotebook(key)" :key="key">
            <q-item-section avatar>
              <q-icon name="fas fa-book" color="grey" />
            </q-item-section>
            <q-item-section>{{notebooks[key].name}}</q-item-section>
            <q-item-section side>{{count_per_notebook[key]}}</q-item-section>
          </q-item>

          <q-expansion-item
            expand-separator
            caption="Empty notebooks"
             v-if="not_empty_notebooks.length"
          >
            <q-item clickable v-close-popup v-for="key of empty_notebooks" @click="setNotebook(key)" :key="key">
              <q-item-section avatar>
                <q-icon name="fas fa-book" color="grey" />
              </q-item-section>
              <q-item-section>{{notebooks[key].name}}</q-item-section>
            </q-item>
          </q-expansion-item>

          <!-- <q-separator v-if="not_empty_notebooks.length" spaced /> -->

          <!-- <q-item-label header v-if="empty_notebooks.length">Empty notebooks</q-item-label>

          <q-item clickable v-close-popup v-for="key of empty_notebooks" @click="setNotebook(key)" :key="key">
            <q-item-section avatar>
              <q-icon name="fas fa-book" color="grey" />
            </q-item-section>
            <q-item-section>{{notebooks[key].name}}</q-item-section>
          </q-item> -->

          <q-separator v-if="Object.keys(notebooks).length" />

          <q-item clickable v-close-popup @click="$emit('createnotebook')">
            <q-item-section avatar>
              <q-icon name="add" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Create notebook</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <span v-if="showSearch" :class="'q-ml-auto ' + (search_text === '' ? 'col-2' : 'col-12')">
        <q-input dense borderless v-model="search_text" input-class="text-right" ref="searchinput">
          <template v-slot:append>
            <q-icon v-if="search_text === ''" name="search" class="cursor-pointer" @click="$refs.searchinput.focus()" clickable />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search_text = ''; searching=false" />
          </template>
        </q-input>
        <!-- <q-btn flat round color="grey" icon="search" size="md" @click.end="searching=true" /> -->
      </span>
    </q-item-label>
    <!-- <template v-if="asList | (search_text!=='')"> -->
      <template v-for="item in displayed_notes">
        <note-list-item :key="item.hash" :item="item"
        :active="noLinks && (item === activeItem)" @click="$emit('itemclick', item)"
        :noLinks="noLinks" :dense="dense" :notebooks="notebooks" :displayNotebook="(!dense) && (!notebook)" />
        <q-separator spaced inset :key="item.hash+'sep'" />
      </template>
    <!-- </template>
    <template v-else>
      <template v-for="[category, items] of Object.entries(notes_per_category)" v-if="(category == 'null') | (notebooks[category] && notebooks[category].status === 'visible')">
        <q-separator spaced  :key="category + 'sp'" />
        <q-item-label header  :key="category + 'title'">
          {{(category !== 'null') ? notebooks[category].name : $t('notes.unassigned_notebook')}}
        </q-item-label>
        <q-item-label caption :key="category + 'empty'">
          empty
        </q-item-label>
        <template v-for="item in items">
          <note-list-item :key="item.hash" :item="item"
          :active="noLinks && (item === activeItem)" @click="$emit('itemclick', item)"
          :noLinks="noLinks" :dense="dense" />
        </template>
      </template>
    </template> -->
  </q-list>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
import Fuse from 'fuse.js'
import collection from 'lodash/collection'

import NoteListItem from './NoteListItem'

export default {
  name: 'notes-list',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    'notes': Array,
    'notebooks': Object,
    'categories': Array,
    'padding': Boolean,
    'dense': Boolean,
    'title': String,
    'noLinks': Boolean,
    'activeItem': Object,
    'showSearch': Boolean,
    'asList': Boolean,
    'showSelector': Boolean,
    'value': Object
  },
  computed: {
    displayed_notes() {
      if (this.search_text === '') {
        if (this.notebook) {
          return this.notes.filter(note => note.content.notebook === this.notebook)
        } else
          return this.notes
      }
      else
        return this.fuse.search(this.search_text)
    },
    notes_per_category() {
      let litems = collection.groupBy(this.notes, (i) => i.content.notebook ? i.content.notebook : null)
      for (let key of Object.keys(this.notebooks)) {
        if (litems[key] == undefined)
          litems[key] = []
      }
      return litems
    },
    count_per_notebook() {
      return Object.fromEntries(Object.entries(this.notes_per_category).map(
        x => [x[0], x[1].length]
      ));
    },
    empty_notebooks() {
      return Object.entries(this.count_per_notebook).filter(x => (x[1] == 0) && (x[0] !== "null")).map(x => x[0])
    },
    not_empty_notebooks() {
      return Object.entries(this.count_per_notebook).filter(x => (x[1] > 0) && (x[0] !== "null")).map(x => x[0])
    }
  },
  data() {
    let fuse_options = {
      keys: [
        'content.title',
        'content.body'
      ],
      shouldSort: true,
      threshold: 0.5,
      tokenize: true,
      maxPatternLength: 32
    }
    return {
      searching: false,
      search_text: '',
      // displayed_notes: [],
      'fuse_options': fuse_options,
      fuse: new Fuse(this.notes, fuse_options),
      selected_view: null,
      notebook: null
    }
  },
  methods: {
    setNotebook(key) {
      this.notebook = key
      this.$emit('change', {
        notebook: this.notebook
      })
    }
  },
  watch: {
    notes() {
      this.search_text = ''
      // this.displayed_notes = this.notes
      this.fuse = new Fuse(this.notes, this.fuse_options)
    },
    // search_text() {
    //   if (this.search_text === '')
    //     this.displayed_notes = this.notes
    //   else
    //     this.displayed_notes = this.fuse.search(this.search_text)
    // }
  },
  components: { NoteListItem }
}
</script>