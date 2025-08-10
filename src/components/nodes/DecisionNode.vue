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
  <div class="decision-node">
    <!-- Resizer on the root (wrapper) -->
    <NodeResizer
      :isVisible="selected"
      :min-width="75"
      :min-height="75"
      :keep-aspect-ratio="true"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />

    <!-- 4 incoming + 4 outgoing (all sides) -->
    <Handle type="target" :position="Position.Top"    id="t" />
    <Handle type="target" :position="Position.Right"  id="r" />
    <Handle type="target" :position="Position.Bottom" id="b" />
    <Handle type="target" :position="Position.Left"   id="l" />

    <Handle type="source" :position="Position.Top"    id="s-t" />
    <Handle type="source" :position="Position.Right"  id="s-r" />
    <Handle type="source" :position="Position.Bottom" id="s-b" />
    <Handle type="source" :position="Position.Left"   id="s-l" />

    <!-- Diamond body -->
    <div class="diamond">
      <div class="diamond-label" @click.stop="startEdit">
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
        <span v-else class="node-label">{{ data.label || 'Decision' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Make wrapper fill the resizer */
.decision-node{
  position: relative;
  width: 100%;
  height: 100%;
  
}

/* Inscribe a square that, when rotated 45°, touches wrapper edges.
   scale = 1/sqrt(2) ≈ 0.7071 */
.diamond{
  --inscribe: 0.7071;

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

/* Rotate text back */
.diamond-label{
  transform: rotate(-45deg);
  width: 100%;
  text-align: center;
  font-size: 12px;
}

/* Keep handles above the diamond */
:deep(.vue-flow__handle){ z-index: 2; }

/* Pin handles to wrapper mid-edges (exactly at diamond vertices) */
:deep(.vue-flow__handle-top){
  top: 0 !important; left: 50% !important; transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-right){
  top: 50% !important; left: 100% !important; transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-bottom){
  top: 100% !important; left: 50% !important; transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-left){
  top: 50% !important; left: 0 !important; transform: translate(-50%, -50%) !important;
}

/* Let selection work through the overlay; keep resizer handles clickable */
:deep(.vue-flow__resizer){ pointer-events: none; }
:deep(.vue-flow__resize-control){ pointer-events: auto; }
</style>
