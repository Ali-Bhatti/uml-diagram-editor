<template>
  <div class="modal-overlay" @click.self="diagramStore.hideEditNodeModal()">
    <div class="modal" v-if="editableNode">
      <h3>Edit {{ isEdge ? 'Connection' : 'Node' }}</h3>
      <form @submit.prevent="save">
        <div class="form-group">
          <label for="node-label">Label</label>
          <input type="text" id="node-label" v-model="editableNode.data.label" placeholder="Enter a label">
        </div>
        <div class="form-group" v-if="isEdge && diagramStore.currentDiagram.type === 'usecase'">
          <label for="stereotype">Stereotype</label>
          <select id="stereotype" v-model="editableNode.data.stereotype">
            <option value="">None</option>
            <option value="include">&laquo;include&raquo;</option>
            <option value="extend">&laquo;extend&raquo;</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="diagramStore.hideEditNodeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useDiagramStore } from '../../stores/diagramStore'

const diagramStore = useDiagramStore()
const nodeToEdit = computed(() => diagramStore.nodeToEdit || diagramStore.edgeToEdit)
const editableNode = ref(null)

watch(nodeToEdit, (val) => {
  editableNode.value = val ? JSON.parse(JSON.stringify(val)) : null
})

const isUseCaseConnection = computed(() => {
  return nodeToEdit.value && (nodeToEdit.value.type === 'include' || nodeToEdit.value.type === 'extend')
})

const closeModal = () => {
  diagramStore.nodeToEdit = null
  diagramStore.edgeToEdit = null
}

const save = () => {
  if (diagramStore.nodeToEdit) {
    diagramStore.updateNode(editableNode.value.id, { data: editableNode.value.data })
  } else if (diagramStore.edgeToEdit) {
    diagramStore.updateEdge(editableNode.value.id, { data: editableNode.value.data })
  }
  closeModal()
}
</script>
