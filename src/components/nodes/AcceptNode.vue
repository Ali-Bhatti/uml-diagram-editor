<script setup>
import { Handle, Position } from '@vue-flow/core'
defineProps(['data'])
</script>

<template>
  <div class="accept-node">
    <!-- only incoming -->
    <Handle type="target" :position="Position.Left" />
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M22,12 L6,12 M12,6 L6,12 L12,18"
            stroke="#333" stroke-width="2" fill="none"/>
    </svg>
  </div>
</template>

<style scoped>
.accept-node {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
