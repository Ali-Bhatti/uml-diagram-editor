<script setup>
import { Handle, Position } from '@vue-flow/core'
defineProps(['data'])
</script>

<template>
  <div class="start-node">
    <!-- only outgoing -->
    <Handle type="source" :position="Position.Bottom" />
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" fill="black" />
    </svg>
  </div>
</template>

<style scoped>
.start-node {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
