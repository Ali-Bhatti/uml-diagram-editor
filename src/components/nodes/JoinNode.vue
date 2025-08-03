<script setup>
import { Handle, Position } from '@vue-flow/core'
defineProps(['data'])
</script>

<template>
  <div class="join-node">
    <!-- parallel incoming -->
    <Handle type="target" :position="Position.Left" />
    <Handle type="target" :position="Position.Right" />
    <div class="bar"></div>
    <!-- single outgoing -->
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.join-node {
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
