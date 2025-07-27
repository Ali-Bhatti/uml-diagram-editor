<template>
  <div class="end-node">
    <Handle type="target" :position="Position.Top" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<style scoped>
.end-node {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #333;
  position: relative;
}

.end-node::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #333;
}
</style>
