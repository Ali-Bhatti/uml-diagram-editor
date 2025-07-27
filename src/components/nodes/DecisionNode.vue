<template>
  <div class="decision-node">
    <Handle type="target" :position="Position.Top" />
    <Handle type="source" :position="Position.Right" />
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="source" :position="Position.Left" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<style scoped>
.decision-node {
  width: 50px;
  height: 50px;
  background-color: #fff;
  border: 1px solid #333;
  transform: rotate(45deg);
}
</style>
