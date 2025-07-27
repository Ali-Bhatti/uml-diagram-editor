<template>
  <div class="action-node">
    <Handle type="source" :position="Position.Bottom" />
    <Handle type="target" :position="Position.Top" />
    <span>{{ data.label }}</span>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

defineProps(['data'])
</script>

<style scoped>
.action-node {
  padding: 10px 20px;
  border: 1px solid #333;
  border-radius: 8px; /* rounded rectangle */
  background-color: #fff;
  text-align: center;
  min-width: 100px;
}
</style>
