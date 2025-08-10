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

    <!-- always-OUT, bottom-centered -->
    <Handle
      type="source"
      :position="Position.Bottom"
      id="s-bottom"
      :style="{ left: '50%' }"
    />

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

  /* center contents */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* the black dot scales with the node, always a circle */
.dot {
  width: 100%;                 /* adjust as you like */
  height: 100%;
  background: #000;
  border-radius: 50%;
}

/* keep the bottom handle above content and centered */

:deep(.vue-flow__handle-bottom) { top: calc(50% + 51%); bottom: auto; transform: translate(-50%, -50%); }

/* resizer overlay shouldn't block clicks; handles stay clickable */
:deep(.vue-flow__resizer) { pointer-events: none; }
:deep(.vue-flow__resize-control) { pointer-events: auto; }
</style>
