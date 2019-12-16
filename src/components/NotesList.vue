<template>
  <q-list :padding="padding" :dense="dense">
    <div v-if="searching">
    </div>
    <q-item-label header v-if="title && (!searching)" class="row items-center justify-between">
      <span v-if="search_text === ''" class="col-2">{{title}}</span>
      <span v-if="showSearch" :class="'q-ml-auto ' + (search_text === '' ? 'col-6' : 'col-12')">
        <q-input dense borderless v-model="search_text" input-class="text-right" ref="searchinput">
          <template v-slot:append>
            <q-icon v-if="search_text === ''" name="search" class="cursor-pointer" @click="$refs.searchinput.focus()" clickable />
            <q-icon v-else name="clear" class="cursor-pointer" @click="search_text = ''; searching=false" />
          </template>
        </q-input>
        <!-- <q-btn flat round color="grey" icon="search" size="md" @click.end="searching=true" /> -->
      </span>
    </q-item-label>
    <template v-for="item in displayed_notes">
      <q-item :to="noLinks ? null : {'name': 'edit-note', params:{'hash': item.hash}}"
      :key="item.hash+'it'" @click="$emit('itemclick', item)" clickable :active="noLinks && (item === activeItem)">
        <q-item-section>
        <q-item-label>{{item.content.title}}</q-item-label>
        <q-item-label overline>
            {{item.time * 1000 | moment("from")}}
            <q-tooltip>{{item.time * 1000 | moment("LLL")}}</q-tooltip>
        </q-item-label>
        <q-item-label caption :lines="dense?1:3">{{item.content.body}}</q-item-label>
        </q-item-section>

        <q-item-section side top>
        <q-icon v-if="item.content.private" name="lock" size="xs" color="positive" />
        <q-icon v-else name="lock_open" size="xs" />
        </q-item-section>
      </q-item>

      <q-separator spaced inset :key="item.hash+'sep'" />
    </template>
  </q-list>
</template>

<script>
import { mapState } from 'vuex'
import { aggregates, posts, encryption } from 'aleph-js'
import Fuse from 'fuse.js';
export default {
  name: 'notes-list',
  props: {
    'notes': Array,
    'padding': Boolean,
    'dense': Boolean,
    'title': String,
    'noLinks': Boolean,
    'activeItem': Object,
    'showSearch': Boolean
  },
  computed: {
    displayed_notes() {
      if (this.search_text === '')
        return this.notes
      else
        return this.fuse.search(this.search_text)
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
      maxPatternLength: 32,
    }
    return {
      searching: false,
      search_text: '',
      // displayed_notes: [],
      'fuse_options': fuse_options,
      fuse: new Fuse(this.notes, fuse_options)
    }
  },
  methods: {
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
  }
}
</script>