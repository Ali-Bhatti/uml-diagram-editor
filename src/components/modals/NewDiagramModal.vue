<template>
  <div class="modal-overlay" @click.self="diagramStore.hideNewDiagramModal()">
    <div class="modal">
      <h3>Create New Diagram</h3>
      <form @submit.prevent="create">
        <div class="form-group">
          <label for="diagram-name">Diagram Name</label>
          <input type="text" id="diagram-name" v-model="name" required placeholder="e.g., Customer Login Flow">
        </div>
        <div class="form-group">
          <label for="diagram-type">Diagram Type</label>
          <select id="diagram-type" v-model="type">
            <option value="usecase">Use Case Diagram</option>
            <option value="activity">Activity Diagram</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="diagramStore.hideNewDiagramModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Diagram</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDiagramStore } from '../../stores/diagramStore'

const diagramStore = useDiagramStore()
const name = ref('')
const type = ref('usecase')

const show = computed(() => diagramStore.showNewDiagramModal)

const closeModal = () => {
  diagramStore.showNewDiagramModal = false
}

const create = () => {
  diagramStore.createDiagram(name.value, type.value)
  name.value = ''
  type.value = 'usecase'
  closeModal()
}
</script>
