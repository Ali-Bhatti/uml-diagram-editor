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
  let nextNodeId = ref(1)

  // Vue Flow's state (nodes, edges, etc.)
  const { nodes, edges, addEdges, onConnect, onNodesChange, onEdgesChange, project, screenToFlowCoordinate } = useVueFlow()

  // Actions
  function getNodeId() {
    if (nextNodeId.value === undefined) {
      nextNodeId.value = 1
    }

    return `${nextNodeId.value++}`
  }
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

  function isDiagramNameUnique(name) {
    return diagrams.value.every(d => d.name !== name)
  }

  function loadDiagram(id) {
    const diagram = diagrams.value.find(d => d.id === id)
    if (diagram) {
      currentDiagram.value = diagram
      // Sanitize nodes
      nodes.value = (diagram.nodes || []).map(n => ({
        id: n.id?.toString() ?? '',
        type: n.type ?? 'default',
        position: n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number'
        ? n.position
        : { x: 0, y: 0 },
        data: n.data ?? { label: '' },
        ...n,
      }))
      edges.value = diagram.edges || []
      nextNodeId.value = (diagram.nodes.reduce((maxId, node) => Math.max(maxId, parseInt(node.id)), 0) || 0) + 1
    }
  } 

  function saveDiagram() {
    if (currentDiagram.value) {
      const diagram = diagrams.value.find(d => d.id === currentDiagram.value.id)
      if (diagram) {
        // Deep clone nodes and edges to avoid saving proxies/reactivity
        diagram.nodes = JSON.parse(JSON.stringify(nodes.value))
        diagram.edges = JSON.parse(JSON.stringify(edges.value))
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

  // function addNode(node) {
  //   console.log(" addNode in STORE ", node)
  //   setTimeout(saveDiagram, 100); // Optionally debounce
  // }

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

  // onNodesChange((changes) => {
  //   // Apply changes to nodes
  //   saveDiagram()
  // })

  // onEdgesChange((changes) => {
  //   // Apply changes to edges
  //   saveDiagram()
  // })

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
    screenToFlowCoordinate,

    // Actions
    createDiagram,
    loadDiagram,
    saveDiagram,
    deleteDiagram,
    updateNodeLabel,
    onConnect,
    onNodesChange,
    onEdgesChange,
    showNewDiagramModal,
    hideNewDiagramModal,
    showEditNodeModal,
    hideEditNodeModal,
    isDiagramNameUnique,
    getNodeId,
  }
})
