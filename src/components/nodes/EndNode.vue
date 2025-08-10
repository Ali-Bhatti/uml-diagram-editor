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

    <!-- single IN, top-centered -->
    <Handle
      type="target"
      :position="Position.Top"
      id="t-top"
      :style="{ left: '50%' }"
    />

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

/* keep top handle glued to circle’s top edge */
:deep(.vue-flow__handle) { z-index: 2; }
:deep(.vue-flow__handle-top) {
  left: 50% !important;
  top: calc(50% - 51%) !important;  /* mirror of your Start node’s +51% */
  bottom: auto !important;
  transform: translate(-50%, -50%) !important;
}

/* resizer overlay shouldn’t block clicks; handles stay clickable */
:deep(.vue-flow__resizer) { pointer-events: none; }
:deep(.vue-flow__resize-control) { pointer-events: auto; }
</style>
