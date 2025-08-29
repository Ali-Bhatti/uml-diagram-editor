<template>
  <div id="app-container">
    <Header />
    <main class="main-content">
      <Palette />
      <DiagramCanvas />
    </main>
    <NewDiagramModal v-if="isNewDiagramModalVisible" @close="hideNewDiagramModal" />
    <EditNodeModal v-if="isEditNodeModalVisible" />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Palette from './components/Palette.vue'
import DiagramCanvas from './components/DiagramCanvas.vue'
import NewDiagramModal from './components/modals/NewDiagramModal.vue'
import EditNodeModal from './components/modals/EditNodeModal.vue'
import { storeToRefs } from 'pinia'
import { useDiagramStore } from './stores/diagramStore'

const diagramStore = useDiagramStore()

const {
  isNewDiagramModalVisible,
  isEditNodeModalVisible,
  editingNode,
} = storeToRefs(diagramStore)

const {
  hideNewDiagramModal,
  hideEditNodeModal,
} = diagramStore
</script>
