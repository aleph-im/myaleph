<template>
  <q-item :to="noLinks ? null : {'name': 'edit-note', params:{'hash': item.hash}}"
  :key="item.hash+'it'" clickable :active="active" @click="$emit('click', item)">
    <q-item-section>
    <q-item-label>{{item.content.title}}</q-item-label>
    <q-item-label overline :lines="1">
        {{item.time * 1000 | moment("from")}}
        <span v-if="displayNotebook && item.content.notebook">in {{notebooks[item.content.notebook].name}}</span>
        <q-tooltip>{{item.time * 1000 | moment("LLL")}}</q-tooltip>
    </q-item-label>
    <q-item-label caption :lines="dense?1:3">{{item.content.body}}</q-item-label>
    </q-item-section>

    <q-item-section side top>
    <q-icon v-if="item.content.private" name="lock" size="xs" color="positive" />
    <q-icon v-else name="lock_open" size="xs" />
    </q-item-section>
  </q-item>
</template>
<script>
export default {
  name: 'note-list-item',
  props: {
    'item': Object,
    'dense': Boolean,
    'noLinks': Boolean,
    'active': Boolean,
    'displayNotebook': Boolean,
    'notebooks': Object
  }
}
</script>