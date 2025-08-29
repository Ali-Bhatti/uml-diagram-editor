<template>
  <aside class="sidebar">
    <div class="palette-section">
      <h3>Palette</h3>
      <div class="palette" v-if="currentDiagram">
        <div 
          v-for="item in currentPalette" 
          :key="item.type" 
          class="palette-item" 
          :draggable="true" 
          :data-type="item.type" 
          @dragstart="onDragStart($event, item.type)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" v-html="item.svg"></svg>
          <span>{{ item.label }}</span>
        </div>
      </div>
      <div v-else class="palette-placeholder">
        <p>Create or select a diagram to see available tools.</p>
      </div>
    </div>
    <div class="diagram-info" v-if="currentDiagram">
      <h4>Current Diagram</h4>
      <p><strong>Name:</strong> {{ currentDiagram.name }}</p>
      <p><strong>Type:</strong> {{ utils.capitalizeFirstLetter(currentDiagram.type) }}</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDiagramStore } from '../stores/diagramStore'
import utils from '../utils'
import { ACTIVITY_NODE_TYPES } from '../enums'

const diagramStore = useDiagramStore()
const { currentDiagram } = storeToRefs(diagramStore)

const palettes = {
  'activity': ACTIVITY_NODE_TYPES,
  'use-case': [
    { type: 'actor', label: 'Actor', icon: '👤' },
    { type: 'useCase', label: 'Use Case', icon: '○' },
  ],
}

const currentPalette = computed(() => {
  const type = currentDiagram.value?.type
  return type ? palettes[type] : []
})

function onDragStart(event, nodeType) {
  //console.log("onDragStart ", event, nodeType)
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', JSON.stringify({ type: nodeType }))
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>
