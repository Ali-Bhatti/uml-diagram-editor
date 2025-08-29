<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

defineProps({ id: String, data: Object, selected: Boolean })
</script>

<template>
  <div class="end-node">
    <NodeResizer
      :isVisible="selected"
      :min-width="40"
      :min-height="37"
      :keep-aspect-ratio="true"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />

    <!-- 4-direction IN -->
    <Handle type="target" :position="Position.Top"    id="t-top"    :style="{ left: '50%' }" />
    <Handle type="target" :position="Position.Bottom" id="t-bottom" :style="{ left: '50%' }" />
    <Handle type="target" :position="Position.Left"   id="t-left"   :style="{ top:  '50%' }" />
    <Handle type="target" :position="Position.Right"  id="t-right"  :style="{ top:  '50%' }" />

    <!-- scalable bullseye -->
    <div class="ring"></div>
  </div>
</template>

<style scoped>
.end-node {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* outer ring + inner filled circle scale with node */
.ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #000;     /* outer ring */
  position: relative;
}
.ring::after {
  content: '';
  position: absolute;
  inset: 22%;                 /* inner fill ≈ 56% of outer */
  background: #000;
  border-radius: 50%;
}

/* Make resizer overlay click-through; handles stay clickable */
:deep(.vue-flow__resizer) { pointer-events: none; }
:deep(.vue-flow__resize-control) { pointer-events: auto; }

/* Keep handle dots above graphics */
:deep(.vue-flow__handle) { z-index: 2; }

/* Place handles exactly on the circle’s extremes (like Start) */
:deep(.vue-flow__handle-top) {
  left: 50% !important;
  top:  calc(50% - 51%) !important;   /* just above center by ~radius */
  bottom: auto !important;
  transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-bottom) {
  left: 50% !important;
  top:  calc(50% + 51%) !important;   /* just below center by ~radius */
  bottom: auto !important;
  transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-left) {
  top: 50% !important;
  left: calc(50% - 51%) !important;   /* left of center by ~radius */
  right: auto !important;
  transform: translate(-50%, -50%) !important;
}
:deep(.vue-flow__handle-right) {
  top: 50% !important;
  left: calc(50% + 51%) !important;   /* right of center by ~radius */
  right: auto !important;
  transform: translate(-50%, -50%) !important;
}
</style>
