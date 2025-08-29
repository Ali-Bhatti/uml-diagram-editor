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
            <option value="activity">Activity Diagram</option>
            <option value="usecase">Use Case Diagram</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Diagram</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDiagramStore } from '../../stores/diagramStore'
import { DIAGRAM_TYPES } from '../../enums'

const diagramStore = useDiagramStore()
const name = ref('')
let type = DIAGRAM_TYPES['activity']

const show = computed(() => diagramStore.showNewDiagramModal)

function create() {
  console.log("Creating diagram with name:", name.value, "and type:", type)
  if (!diagramStore.isDiagramNameUnique(name.value)) {
    alert('Diagram name must be unique')
    return
  }
  diagramStore.createDiagram(name.value, type)
  name.value = ''
  type = DIAGRAM_TYPES['usecase'] // Reset to default type
  diagramStore.hideNewDiagramModal()
}
</script>
