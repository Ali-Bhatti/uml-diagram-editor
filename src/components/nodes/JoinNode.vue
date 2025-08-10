<script setup>
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

const props = defineProps({ id: String, data: Object, selected: Boolean })
</script>

<template>
  <div class="join-node">
    <NodeResizer
      :isVisible="selected"
      :min-width="80"
      :keep-aspect-ratio="false"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />
    <div class="bar"></div>
    <!-- IN (top) – offset a bit ABOVE the bar -->
    <Handle
      type="target"
      :position="Position.Top"
      id="t-20"
      :style="{ left: '20%' }"
    />
    <Handle
      type="target"
      :position="Position.Top"
      id="t-50"
      :style="{ left: '50%' }"
    />
    <Handle
      type="target"
      :position="Position.Top"
      id="t-80"
      :style="{ left: '80%' }"
    />

    <!-- OUT (bottom) – offset a bit BELOW the bar -->
    <Handle
      type="source"
      :position="Position.Bottom"
      id="s-20"
      :style="{ left: '20%' }"
    />
    <Handle
      type="source"
      :position="Position.Bottom"
      id="s-50"
      :style="{ left: '50%' }"
    />
    <Handle
      type="source"
      :position="Position.Bottom"
      id="s-80"
      :style="{ left: '80%' }"
    />
  </div>
</template>

<style scoped>
.join-node {
  position: relative;
  --bar-h: 4px;           /* thickness of the black bar */
  --handle-gap: 8px;      /* distance of handles from the bar */
  width: 100%;          /* fill the resized wrapper */
  height: 100%;         /* fill the resized wrapper */
  min-width: 80px;      /* optional: match resizer min sizes */
  min-height: 12px;
  box-sizing: border-box;
}

/* bar stays vertically centered */
.bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: var(--bar-h);
  transform: translateY(-50%);
  background: #333;
}

/* Make the resizer overlay click-through, but keep resize handles clickable */
:deep(.vue-flow__resizer) { pointer-events: none; }
:deep(.vue-flow__resize-control) { pointer-events: auto; }

/* Keep connection handles above the bar */
:deep(.vue-flow__handle) {
  z-index: 2;
  transform: translateX(-50%); /* center on its left % */
}

/* Position logic:
   - Top handles sit just ABOVE the bar center.
   - Bottom handles sit just BELOW the bar center. */
:deep(.vue-flow__handle-top) {
  top: calc(50% - (var(--bar-h) / 2) - var(--handle-gap)) !important;
  bottom: auto !important;
}

:deep(.vue-flow__handle-bottom) {
  top: calc(50% + (var(--bar-h) / 2)) !important;
  bottom: auto !important;
}
</style>