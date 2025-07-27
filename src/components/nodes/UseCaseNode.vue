<template>
  <div class="use-case-node">
    <Handle type="source" :position="Position.Top" />
    <Handle type="source" :position="Position.Right" />
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="source" :position="Position.Left" />
    <span>{{ data.label }}</span>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

defineProps(['data'])
</script>

<style scoped>
.use-case-node {
  padding: 15px 25px;
  border: 1px solid #333;
  border-radius: 50px; /* oval shape */
  background-color: #fff;
  text-align: center;
  min-width: 100px;
}
</style>
