<!-- src/components/nodes/MergeNode.vue -->
<script setup>
import { ref, nextTick } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { useDiagramStore } from '../../stores/diagramStore'

const props = defineProps({
  id: String,
  data: Object,
})

const store      = useDiagramStore()
const isEditing  = ref(false)
const inputRef   = ref(null)

// Enter edit mode
function startEdit() {
  isEditing.value = true
  nextTick(() => inputRef.value?.focus())
}

// Commit and exit edit mode
function finishEdit() {
  isEditing.value = false
  store.updateNodeLabel(props.id, props.data.label)
}
</script>

<template>
  <div class="decision-node">
    <!-- multiple incoming -->
    <Handle type="target" :position="Position.Top" />

    <!-- diamond with inline edit -->
    <div class="diamond" @click.stop="startEdit">
      <input
        v-if="isEditing"
        ref="inputRef"
        v-model="data.label"
        @keydown.backspace.stop
        @keydown.delete.stop
        @blur="finishEdit"
        @keydown.enter.prevent="finishEdit"
        :size="Math.max(data.label.length, 1)"
        class="node-label-input inner-label"
      />
      <div v-else class="inner-label node-label">
        {{ data.label || '' }}
      </div>
    </div>

    <!-- multiple outgoing -->
    <Handle type="source" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.decision-node {
  position: relative;
  width: 60px;
  height: 60px;
}
.diamond {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: auto;
  width: 40px; height: 40px;
  background: #fff;
  border: 2px solid #333;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: text;
}
/* reuse your existing inner-label rotation & font rules */
.inner-label {
  transform: rotate(-45deg);
  font-size: 10px;
  text-align: center;
  width: 100%;
}
</style>
