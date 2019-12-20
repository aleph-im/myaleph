<template>
  <div class="column note-edit-page q-pl-sm">
    <div class="col-auto row justify-between items-center">
      <template v-if="showBack">
        <q-btn round flat icon="arrow_back" @click="$emit('back')" />
      </template>
      <h4 class="q-ma-sm col-grow">
        {{note.content.title||'Note Title'}}
        <q-popup-edit v-model="note.content.title">
          <template v-slot="{ initialValue, value, emitValue, validate, set, cancel }">
            <q-input
              autofocus
              dense
              hint="Your title"
              v-model="note.content.title"
            >
            </q-input>
          </template>
        </q-popup-edit>
      </h4>
      <span class="q-ma-sm"  v-if="$q.screen.gt.xs">
        <template>
          {{note.content.private?'encrypted':'public'}}
        </template>
        <q-toggle
          v-model="note.content.private"
          checked-icon="lock"
          color="green"
          unchecked-icon="lock_open"
        />
        <!-- <q-btn push color="info" round icon="share" size="xs" @click.stop="share"  class="q-mr-sm" /> -->
        <q-btn push color="primary" rounded icon="save" label="Save" size="sm" @click.stop="$emit('submit')" />
      </span>
    </div>
    <div class="col-grow">
      <editor v-model="note.content.body" height="350px" mode="wysiwyg" class="note-editor" />
    </div>
    <div class="col-auto row justify-between q-ma-sm">
      <div>
        <q-toggle
          v-model="note.content.private"
          checked-icon="lock"
          color="green"
          unchecked-icon="lock_open"  v-if="$q.screen.lt.sm"
        />
        <template v-if="$q.screen.lt.sm">
          {{note.content.private?'encrypted':'public'}}
        </template>
      </div>
      <q-btn push color="primary" rounded icon="save" label="Save" size="sm" @click.stop="$emit('submit')" />
    </div>
  </div>
</template>

<script>
import { Editor } from '@toast-ui/vue-editor'
export default {
  name: 'MockNoteEdit',
  props: {
    note: Object,
    showBack: Boolean
  },
  components: {
    Editor
  }
}
</script>