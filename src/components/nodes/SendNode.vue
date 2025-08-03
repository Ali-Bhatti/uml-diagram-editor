<script setup>
import { Handle, Position } from '@vue-flow/core'
defineProps(['data'])
</script>

<template>
  <div class="send-node">
    <!-- only outgoing -->
    <Handle type="source" :position="Position.Right" />
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M2,12 L18,12 M12,6 L18,12 L12,18"
            stroke="#333" stroke-width="2" fill="none"/>
    </svg>
  </div>
</template>

<style scoped>
.send-node {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
