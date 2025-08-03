<script setup>
import { Handle, Position } from '@vue-flow/core'
const props = defineProps({ data: Object })
</script>

<template>
  <div class="action-node">
    <Handle type="target" :position="Position.Top" />
    <div class="label">{{ data.label || 'Action' }}</div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.action-node {
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 4px;
  min-width: 80px;
  text-align: center;
  border: 1px solid #333;
}
.label {
  white-space: nowrap;
}
</style>
