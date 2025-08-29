<template>
  <div class="actor-node">
    <Handle type="source" :position="Position.Top" />
    <svg width="40" height="60" viewBox="0 0 40 60">
      <circle cx="20" cy="10" r="8" fill="none" stroke="#333" stroke-width="2" />
      <line x1="20" y1="18" x2="20" y2="40" stroke="#333" stroke-width="2" />
      <line x1="5" y1="25" x2="35" y2="25" stroke="#333" stroke-width="2" />
      <line x1="20" y1="40" x2="5" y2="55" stroke="#333" stroke-width="2" />
      <line x1="20" y1="40" x2="35" y2="55" stroke="#333" stroke-width="2" />
    </svg>
    <div class="label">{{ data.label }}</div>
    <Handle type="target" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

defineProps(['data'])
</script>

<style scoped>
.actor-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: transparent;
  border: none;
}

.label {
  margin-top: 5px;
  font-size: 12px;
  text-align: center;
}
</style>
