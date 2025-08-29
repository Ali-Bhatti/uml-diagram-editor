<script setup>
import { ref, nextTick } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { useDiagramStore } from '../../stores/diagramStore'
import { NodeResizer } from '@vue-flow/node-resizer'

const props = defineProps({ id: String, data: Object, selected: Boolean })
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
  <div class="action-node node-color">
    <!-- Four incoming handles -->
    <Handle type="target" :position="Position.Top"    id="target-top"    class="nodrag nopan" />
    <Handle type="target" :position="Position.Right"  id="target-right"  class="nodrag nopan" />
    <Handle type="target" :position="Position.Bottom" id="target-bottom" class="nodrag nopan" />
    <Handle type="target" :position="Position.Left"   id="target-left"   class="nodrag nopan" />

    <!-- Four outgoing handles -->
    <Handle type="source" :position="Position.Top"    id="source-top"    class="nodrag nopan" />
    <Handle type="source" :position="Position.Right"  id="source-right"  class="nodrag nopan" />
    <Handle type="source" :position="Position.Bottom" id="source-bottom" class="nodrag nopan" />
    <Handle type="source" :position="Position.Left"   id="source-left"   class="nodrag nopan" />

    <div class="label-container nodrag" @click.stop="startEdit">
      <!-- Resizer appears only when node is selected -->
      <NodeResizer
        :isVisible="selected"
        :min-width="80"
        :keep-aspect-ratio="false"
        :lineStyle="{ stroke: '#333' }"
        :handleStyle="{ fill: '#333' }"
      />
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
  </div>
</template>

<style scoped>

.action-node {
  position: relative;         /* required so resizer/handles position correctly */
  width: 100%;          /* fill wrapper width */
  height: 100%; 
  box-sizing: border-box;
  padding: 6px 12px;
  border-radius: 4px;
  min-width: 80px;           /* matches resizer min-width */
  text-align: center;
  border: 1px solid #333;
}

/* ensure the container keeps your node’s shape */
.label-container {
  display: inline-block;
  width: auto;
  text-align: center;
}

/* when not editing, show your regular label */
.node-label {
  cursor: pointer;
  user-select: none;
}
</style>
