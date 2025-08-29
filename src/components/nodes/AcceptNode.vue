<script setup>
import { ref, nextTick, computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'
import { useDiagramStore } from '../../stores/diagramStore'

const props = defineProps({ id: String, data: Object, selected: Boolean })
const store = useDiagramStore()

const isEditing = ref(false)
const inputRef  = ref(null)

const nodeForModal = computed(() => ({ id: props.id, type: 'accept', data: props.data }))

function startEdit() {
  isEditing.value = true
  nextTick(() => inputRef.value?.focus())
}
function finishEdit() {
  isEditing.value = false
  store.updateNodeLabel(props.id, props.data.label)
}
function openModal() {
  store.showEditNodeModal(nodeForModal.value)
}
</script>

<template>
  <!-- dblclick anywhere -> popup; click label -> inline edit -->
  <div class="accept-node" @dblclick.stop="openModal">
    <NodeResizer
      :isVisible="selected"
      :min-width="120"
      :min-height="40"
      :keep-aspect-ratio="false"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />

    <!-- IN (left) / OUT (right) -->
    <Handle type="target" :position="Position.Left"  id="t-left" />
    <Handle type="target" :position="Position.Top"    id="t-top" />

    <Handle type="source" :position="Position.Right" id="s-right" />
    <Handle type="source" :position="Position.Bottom" id="s-bottom" />

    <!-- scalable concave polygon; left notch -->
    <svg class="accept-svg" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <!-- points: right-top -> right-bottom -> left-bottom -> notch -> left-top -->
      <polygon class="accept-shape" points="100,0 100,40 0,40 20,20 0,0" />
    </svg>

    <!-- centered label -->
    <div class="label">
      <input
        v-if="isEditing"
        ref="inputRef"
        v-model="data.label"
        class="node-label-input"
        @keydown.backspace.stop
        @keydown.delete.stop
        @keydown.enter.prevent="finishEdit"
        @blur="finishEdit"
        :size="Math.max((data.label || '').length, 1)"
      />
      <span v-else class="node-label" @click.stop="startEdit">
        {{ data.label || 'AcceptEventAction' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.accept-node {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/* SVG fills node; don’t eat clicks so dblclick/select work */
.accept-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
.accept-shape {
  fill: #fff;
  stroke: #333;
  stroke-width: 2;
  vector-effect: non-scaling-stroke; /* border thickness stays constant */
  stroke-linejoin: miter;
}

/* label */
.label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* keep handles visible above graphics */
:deep(.vue-flow__handle) { z-index: 2; }

/* resizer overlay click-through; resize handles remain clickable */
:deep(.vue-flow__resizer) { pointer-events: none; }
:deep(.vue-flow__resize-control) { pointer-events: auto; }
</style>
