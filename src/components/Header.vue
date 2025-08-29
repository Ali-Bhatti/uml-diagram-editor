<template>
  <header class="header">
    <div class="header-left">
      <img src="/favicon.svg" alt="UML Icon" class="uml-header-icon" />
      <h1>UML Diagram Editor</h1>
      <select v-if="diagrams && diagrams.length" class="diagram-select" :value="currentDiagram ? currentDiagram.id : ''" @change="onDiagramSelect">
        <option :value="null" disabled :selected="!currentDiagram">Select a diagram</option>
        <option v-for="d in diagrams" :key="d.id" :value="d.id">{{ d.name }} ({{ d.type }})</option>
      </select>
      <p v-else class="no-diagrams-text">Create a diagram to get started</p>
    </div>
    <div class="header-right">
      <button class="btn btn-secondary" @click="saveCurrentDiagram" :disabled="!currentDiagram">Save</button>
      <button class="btn btn-danger" @click="deleteCurrentDiagram" :disabled="!currentDiagram">Delete</button>
      <button class="btn btn-primary" @click="showNewDiagramModal">New Diagram</button>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDiagramStore } from '../stores/diagramStore'

const diagramStore = useDiagramStore()
const { diagrams, currentDiagram } = storeToRefs(diagramStore)

function showNewDiagramModal() {
  diagramStore.showNewDiagramModal()
}

function onDiagramSelect(event) {
  diagramStore.loadDiagram(event.target.value)
}

function deleteCurrentDiagram() {
  if (diagramStore.currentDiagram && confirm('Are you sure you want to delete this diagram?')) {
    diagramStore.deleteDiagram(diagramStore.currentDiagram.id)
  }
}

function saveCurrentDiagram() {
  diagramStore.saveDiagram()
  alert('Diagram has been saved')
}
</script>

<style scoped>
.uml-header-icon {
  width: 32px;
  height: 32px;
  display: inline-block;
}
</style>
