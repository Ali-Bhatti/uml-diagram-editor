import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { useVueFlow } from '@vue-flow/core'

export const useDiagramStore = defineStore('diagram', () => {
  // Centralized state as top-level refs
  const diagrams = ref([])
  const currentDiagram = ref(null)
  const isNewDiagramModalVisible = ref(false)
  const isEditNodeModalVisible = ref(false)
  const editingNode = ref(null)
  const nextNodeId = ref(1)

  // Vue Flow's state (nodes, edges, etc.)
  const { nodes, edges, addNodes, addEdges, onConnect, onNodesChange, onEdgesChange, project } = useVueFlow()

  // Actions
  function saveToLocalStorage() {
    localStorage.setItem('uml-diagrams', JSON.stringify(diagrams.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('uml-diagrams')
    if (saved) {
      diagrams.value = JSON.parse(saved)
      if (diagrams.value.length > 0) {
        loadDiagram(diagrams.value[0].id)
      }
    }
  }

  function createDiagram(name, type) {
    const newDiagram = {
      id: Date.now().toString(),
      name,
      type,
      nodes: [],
      edges: [],
    }
    diagrams.value.push(newDiagram)
    loadDiagram(newDiagram.id)
    saveToLocalStorage()
  }

  function loadDiagram(id) {
    const diagram = diagrams.value.find(d => d.id === id)
    if (diagram) {
      currentDiagram.value = diagram
      nodes.value = diagram.nodes || []
      edges.value = diagram.edges || []
      nextNodeId.value = (diagram.nodes.reduce((maxId, node) => Math.max(maxId, parseInt(node.id)), 0) || 0) + 1
    }
  }

  function saveDiagram() {
    if (currentDiagram.value) {
      const diagram = diagrams.value.find(d => d.id === currentDiagram.value.id)
      if (diagram) {
        diagram.nodes = nodes.value
        diagram.edges = edges.value
        saveToLocalStorage()
      }
    }
  }

  function deleteDiagram(id) {
    const index = diagrams.value.findIndex(d => d.id === id)
    if (index !== -1) {
      diagrams.value.splice(index, 1)
      if (currentDiagram.value && currentDiagram.value.id === id) {
        if (diagrams.value.length > 0) {
          loadDiagram(diagrams.value[0].id)
        } else {
          currentDiagram.value = null
          nodes.value = []
          edges.value = []
        }
      }
      saveToLocalStorage()
    }
  }

  function addNode(node) {
    const newNode = {
      id: nextNodeId.value.toString(),
      ...node,
    }
    addNodes([newNode])
    nextNodeId.value++
    saveDiagram()
  }

  function updateNodeLabel(nodeId, label) {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      if (!node.data) node.data = {}
      node.data.label = label
      saveDiagram()
    }
  }

  // Vue Flow event handlers
  onConnect((params) => {
    addEdges([params])
    saveDiagram()
  })

  onNodesChange((changes) => {
    // Apply changes to nodes
    saveDiagram()
  })

  onEdgesChange((changes) => {
    // Apply changes to edges
    saveDiagram()
  })

  // Modal actions
  const showNewDiagramModal = () => { isNewDiagramModalVisible.value = true }
  const hideNewDiagramModal = () => { isNewDiagramModalVisible.value = false }
  const showEditNodeModal = (node) => {
    editingNode.value = node
    isEditNodeModalVisible.value = true
  }
  const hideEditNodeModal = () => {
    editingNode.value = null
    isEditNodeModalVisible.value = false
  }

  // Initial load
  loadFromLocalStorage()

  return {
    // State properties
    diagrams,
    currentDiagram,
    isNewDiagramModalVisible,
    isEditNodeModalVisible,
    editingNode,
    nextNodeId,

    // Vue Flow
    nodes,
    edges,
    project,

    // Actions
    createDiagram,
    loadDiagram,
    saveDiagram,
    deleteDiagram,
    addNode,
    updateNodeLabel,
    onConnect,
    onNodesChange,
    onEdgesChange,
    showNewDiagramModal,
    hideNewDiagramModal,
    showEditNodeModal,
    hideEditNodeModal,
  }
})
