<script setup>
import { ref, nextTick } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { useDiagramStore } from '../../stores/diagramStore'

const props = defineProps({ id: String, data: Object })
const store = useDiagramStore()

const isEditing = ref(false)
const inputRef  = ref(null)

function startEdit() {
  isEditing.value = true
  nextTick(() => inputRef.value?.focus())
}

function finishEdit() {
  isEditing.value = false
  store.updateNodeLabel(props.id, props.data.label)
}
</script>

<template>
  <div class="action-node">
    <Handle type="target" :position="Position.Top" />

    <div class="label-container nodrag" @click.stop="startEdit">
      <input
        v-if="isEditing"
        ref="inputRef"
        class="node-label-input"
        @keydown.backspace.stop
        @keydown.delete.stop
        v-model="data.label"
        @blur="finishEdit"
        @keydown.enter.prevent="finishEdit"
        :size="Math.max(data.label.length, 1)"
      />
      <span v-else class="node-label">{{ data.label || 'Action' }}</span>
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>

.action-node {
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
  border: 1px solid #333;
}

/* ensure the container keeps your node’s shape */
.label-container {
  display: inline-block;
  width: auto;
  text-align: center;
}

/* make the input invisible except for its text */
/* .node-label-input {
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  text-align: center;
} */

/* when not editing, show your regular label */
.node-label {
  cursor: pointer;
  user-select: none;
}
</style>
