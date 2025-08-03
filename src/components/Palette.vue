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

const diagramStore = useDiagramStore()
const { currentDiagram } = storeToRefs(diagramStore)

const palettes = {
  'activity': [
    {
      type: 'start',
      label: 'Start',
      svg: '<circle cx="12" cy="12" r="8" fill="black"/>'
    },
    {
      type: 'action',
      label: 'Action',
      svg:
        '<rect x="4" y="6" width="16" height="12" rx="4" fill="#f0f0f0" stroke="#333"/>'
    },
    {
      type: 'decision',
      label: 'Decision',
      svg:
        '<polygon points="12,4 20,12 12,20 4,12" fill="#fff" stroke="#333"/>'
    },
    {
      type: 'merge',
      label: 'Merge',
      svg:
        '<polygon points="12,4 20,12 12,20 4,12" fill="#fff" stroke="#333"/>'
    },
    {
      type: 'fork',
      label: 'Fork',
      svg: '<rect x="4" y="10" width="16" height="4" fill="#333"/>'
    },
    {
      type: 'join',
      label: 'Join',
      svg: '<rect x="4" y="10" width="16" height="4" fill="#333"/>'
    },
    {
      type: 'send',
      label: 'Send',
      svg:
        '<path d="M2,12 L18,12 M12,6 L18,12 L12,18" stroke="#333" stroke-width="2" fill="none"/>'
    },
    {
      type: 'accept',
      label: 'Accept',
      svg:
        '<path d="M22,12 L6,12 M12,6 L6,12 L12,18" stroke="#333" stroke-width="2" fill="none"/>'
    },
    {
      type: 'end',
      label: 'End',
      svg:
        '<circle cx="12" cy="12" r="10" stroke="#333" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" fill="black"/>'
    }
  ],
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
