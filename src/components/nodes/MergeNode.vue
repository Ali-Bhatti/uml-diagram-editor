<!-- src/components/nodes/MergeNode.vue -->
<script setup>
import { ref, nextTick } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import { useDiagramStore } from '../../stores/diagramStore'

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
  <div class="merge-node">
    <NodeResizer
      :isVisible="selected"
      :min-width="75"
      :min-height="75"
      :keep-aspect-ratio="true"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />

    <!-- IN (multiple) -->
    <Handle type="target" :position="Position.Top"    id="t-top" />
    <Handle type="target" :position="Position.Left"   id="t-left" />
    <Handle type="target" :position="Position.Right"  id="t-right" />
    <!-- no bottom targets -->

    <!-- OUT (single, bottom-center) -->
    <Handle type="source" :position="Position.Bottom" id="s-bottom" :style="{ left: '50%' }" />

    <!-- diamond body + inline edit -->
    <div class="diamond" @click.stop="startEdit">
      <div class="diamond-label">
        <input
          v-if="isEditing"
          ref="inputRef"
          class="node-label-input"
          v-model="data.label"
          @keydown.backspace.stop
          @keydown.delete.stop
          @keydown.enter.prevent="finishEdit"
          @blur="finishEdit"
          :size="Math.max((data.label || '').length, 1)"
        />
        <span v-else class="node-label">{{ data.label || 'Merge' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.merge-node{
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* inscribed square that becomes a diamond when rotated */
.diamond{
  --inscribe: 0.7071; /* 1 / sqrt(2) */

  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(100% * var(--inscribe));
  height: calc(100% * var(--inscribe));
  transform: translate(-50%, -50%) rotate(45deg);

  background: #fff;
  border: 2px solid #333;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* rotate label back */
.diamond-label{
  transform: rotate(-45deg);
  width: 100%;
  text-align: center;
  font-size: 12px;
}

/* place handles exactly on wrapper edges (aligns with diamond vertices) */
:deep(.vue-flow__handle){ z-index: 2; transform: translate(-50%, -50%); }
:deep(.vue-flow__handle-top){    top: 0 !important;    left: 50% !important; }
:deep(.vue-flow__handle-left){   top: 50% !important;  left: 0 !important;   }
:deep(.vue-flow__handle-right){  top: 50% !important;  left: 100% !important;}
:deep(.vue-flow__handle-bottom){ top: 100% !important; left: 50% !important; }

/* resizer overlay click-through; handles remain clickable */
:deep(.vue-flow__resizer){ pointer-events: none; }
:deep(.vue-flow__resize-control){ pointer-events: auto; }
</style>
