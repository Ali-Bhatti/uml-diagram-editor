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
          @dragstart="onDragStart($event, item.type)"
        >
          <div class="palette-icon">{{ item.icon }}</div>
          <div class="palette-label">{{ item.label }}</div>
        </div>
      </div>
      <div v-else class="palette-placeholder">
        <p>Create or select a diagram to see available tools.</p>
      </div>
    </div>
    <div class="diagram-info" v-if="currentDiagram">
      <h4>Current Diagram</h4>
      <p><strong>Name:</strong> {{ currentDiagram.name }}</p>
      <p><strong>Type:</strong> {{ currentDiagram.type }}</p>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDiagramStore } from '../stores/diagramStore'

const diagramStore = useDiagramStore()
const { currentDiagram } = storeToRefs(diagramStore)

const palettes = {
  'use-case': [
    { type: 'actor', label: 'Actor', icon: '👤' },
    { type: 'useCase', label: 'Use Case', icon: '○' },
  ],
  'activity': [
    { type: 'start', label: 'Start', icon: '⚫' },
    { type: 'action', label: 'Action', icon: '▭' },
    { type: 'decision', label: 'Decision', icon: '◇' },
    { type: 'end', label: 'End', icon: '⦿' },
  ],
}

const currentPalette = computed(() => {
  const type = currentDiagram.value?.type
  return type ? palettes[type] : []
})

const onDragStart = (event, nodeType) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>
