<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

defineProps({ id: String, data: Object, selected: Boolean })
</script>

<template>
  <div class="start-node">
    <NodeResizer
      :isVisible="selected"
      :min-width="40"
      :min-height="40"
      :keep-aspect-ratio="true"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />

    <!-- 4-direction OUT -->
    <Handle type="source" :position="Position.Top"    id="s-top"    :style="{ left: '50%' }" />
    <Handle type="source" :position="Position.Right"  id="s-right"  :style="{ top:  '50%' }" />
    <Handle type="source" :position="Position.Bottom" id="s-bottom" :style="{ left: '50%' }" />
    <Handle type="source" :position="Position.Left"   id="s-left"   :style="{ top:  '50%' }" />

    <!-- scalable dot -->
    <div class="dot"></div>
  </div>
</template>

<style scoped>
.start-node {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* the black dot scales with the node, stays circular */
.dot {
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 50%;
}

/* resizer overlay shouldn't block clicks; handles stay clickable */
:deep(.vue-flow__resizer) { pointer-events: none; }
:deep(.vue-flow__resize-control) { pointer-events: auto; }

/* keep handle dots above graphics */
:deep(.vue-flow__handle) { z-index: 2; }

/* Pin handles exactly on the circle's extremes (same trick as End node) */
:deep(.vue-flow__handle-top) {
  left: 50% !important;
  top:  calc(50% - 51%) !important;
  bottom: auto !important;
  transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-bottom) {
  left: 50% !important;
  top:  calc(50% + 51%) !important;
  bottom: auto !important;
  transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-left) {
  top: 50% !important;
  left: calc(50% - 51%) !important;
  right: auto !important;
  transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-right) {
  top: 50% !important;
  left: calc(50% + 51%) !important;
  right: auto !important;
  transform: translate(-50%, -50%) !important;
}
</style>
