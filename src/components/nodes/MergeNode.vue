<script setup>
import { Handle, Position } from '@vue-flow/core'
defineProps(['data'])
</script>

<template>
  <div class="merge-node">
    <!-- multiple incoming -->
    <Handle type="target" :position="Position.Left" />
    <Handle type="target" :position="Position.Right" />
    <div class="diamond">
      <div class="inner-label">{{ data.label || '' }}</div>
    </div>
    <!-- single outgoing -->
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.merge-node {
  position: relative;
  width: 60px;
  height: 60px;
}
.diamond {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: auto;
  width: 40px; height: 40px;
  background: #fff;
  border: 2px solid #333;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
}
.inner-label {
  transform: rotate(-45deg);
  font-size: 10px;
  text-align: center;
  width: 100%;
}
</style>
