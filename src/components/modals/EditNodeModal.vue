<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal" v-if="diagramStore.isEditNodeModalVisible && nodeToEdit">
      <h3>Edit {{ isEdge ? 'Connection' : 'Node' }}</h3>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="node-label">Label</label>
          <input v-if="isEdge" type="text" id="node-label" v-model="editableNode.label" placeholder="Enter a label" autofocus>
          <input v-else type="text" id="node-label" v-model="editableNode.data.label" placeholder="Enter a label" autofocus>
        </div>
        <div class="form-group" v-if="isEdge && diagramStore.currentDiagram.type === DIAGRAM_TYPES['usecase']">
          <label for="stereotype">Stereotype</label>
          <select id="stereotype" v-model="editableNode.data.stereotype">
            <option value="">None</option>
            <option value="include">«include»</option>
            <option value="extend">«extend»</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDiagramStore } from '../../stores/diagramStore'
import { DIAGRAM_TYPES } from '../../enums'

const diagramStore = useDiagramStore()
const isEdge = computed(() => !!diagramStore.edgeToEdit)
const nodeToEdit = computed(() => diagramStore.editingNode || diagramStore.edgeToEdit)
let editableNode = ref({})

watch(
  nodeToEdit,
  (newVal) => {
    editableNode.value = newVal
      ? JSON.parse(JSON.stringify(newVal))
      : { data: {} }
  },
  { immediate: true }
)


const closeModal = () => {
  diagramStore.hideEditNodeModal()
}

const save = () => {
  if (!editableNode.value) return

  if (diagramStore.editingNode) {
    // Update node label
    diagramStore.updateNodeLabel(editableNode.value.id, editableNode.value.data.label)
  } else if (diagramStore.edgeToEdit) {
    // Update edge label/stereotype if needed
    diagramStore.updateEdgeLabel(
      editableNode.value.id,
      editableNode.value.label,
      editableNode.value.data.stereotype
    )
  }
  closeModal()
}
</script>
