<script setup>
import { Handle, Position } from '@vue-flow/core'
defineProps(['data'])
</script>

<template>
  <div class="fork-node">
    <!-- single incoming -->
    <Handle type="target" :position="Position.Top" />
    <div class="bar"></div>
    <!-- parallel outgoing -->
    <Handle type="source" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.fork-node {
  position: relative;
  width: 60px;
  height: 12px;
}
.bar {
  position: absolute;
  top: 4px; left: 0; right: 0;
  height: 4px;
  background: #333;
}
</style>
