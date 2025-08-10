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
    <!-- targets (incoming) -->
    <Handle type="target" :position="Position.Top"    id="t-top" class="nodrag nopan" />
    <Handle type="target" :position="Position.Right"  id="t-right" class="nodrag nopan" />
    <Handle type="target" :position="Position.Bottom" id="t-bottom" class="nodrag nopan" />
    <Handle type="target" :position="Position.Left"   id="t-left" class="nodrag nopan" />

    <!-- sources (outgoing) -->
    <Handle type="source" :position="Position.Top"    id="s-top" class="nodrag nopan" />
    <Handle type="source" :position="Position.Right"  id="s-right" class="nodrag nopan" />
    <Handle type="source" :position="Position.Bottom" id="s-bottom" class="nodrag nopan" />
    <Handle type="source" :position="Position.Left"   id="s-left" class="nodrag nopan" />

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
