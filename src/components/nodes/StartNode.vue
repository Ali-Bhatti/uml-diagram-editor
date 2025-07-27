<template>
  <div class="start-node">
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<style scoped>
.start-node {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #333;
}
</style>
