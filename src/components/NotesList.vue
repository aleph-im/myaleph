<template>
  <q-list :padding="padding" :dense="dense">
    <q-item-label header v-if="title">{{title}}</q-item-label>
    <template v-for="item in notes">
      <q-item :to="{'name': 'edit-note', params:{'hash': item.hash}}" :key="item.hash+'it'" clickable>
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
export default {
  name: 'notes-list',
  props: {
    'notes': Array,
    'padding': Boolean,
    'dense': Boolean,
    'title': String
  }
}
</script>