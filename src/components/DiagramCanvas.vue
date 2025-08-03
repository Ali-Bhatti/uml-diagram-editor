<template>
  <div class="canvas-area" @drop="onDrop">
    <VueFlow
      v-if="currentDiagram"
      :key="currentDiagram.id" 
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes"

      class="diagram-canvas"
      :pan-on-drag="true"
      :zoom-on-scroll="true"
      :zoom-on-pinch="true"
      fit-view-on-init
      @dragover="onDragOver"
      @node-double-click="onNodeDoubleClick"
      @edge-double-click="onEdgeDoubleClick"
    >
      <Background />
      <Controls position="top-left"/>
    </VueFlow>
    <div v-else class="canvas-placeholder">
      <h2>Welcome to the UML Diagram Editor</h2>
      <p>Select a diagram from the dropdown or create a new one to start.</p>
      <button class="btn btn-primary" @click="diagramStore.showNewDiagramModal">Create New Diagram</button>
    </div>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { storeToRefs } from 'pinia'
import { useDiagramStore } from '../stores/diagramStore'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'

// import your custom node components
import ActorNode from './nodes/ActorNode.vue'
import UseCaseNode from './nodes/UseCaseNode.vue'

import StartNode from './nodes/StartNode.vue'
import EndNode from './nodes/EndNode.vue'
import ActionNode from './nodes/ActionNode.vue'
import DecisionNode from './nodes/DecisionNode.vue'
import ForkNode from './nodes/ForkNode.vue'
import JoinNode from './nodes/JoinNode.vue'
import MergeNode from './nodes/MergeNode.vue'
import SendNode from './nodes/SendNode.vue'
import AcceptNode from './nodes/AcceptNode.vue'

const { addNodes, onConnect, addEdges, screenToFlowCoordinate } = useVueFlow();

onConnect((params) => addEdges([params]));

const diagramStore = useDiagramStore()
const { nodes, edges, currentDiagram } = storeToRefs(diagramStore)



const nodeTypes = {
  actor: markRaw(ActorNode),
  useCase: markRaw(UseCaseNode),
  start: markRaw(StartNode),
  end: markRaw(EndNode),
  action: markRaw(ActionNode),
  decision: markRaw(DecisionNode),
  fork: markRaw(ForkNode),
  join: markRaw(JoinNode),
  merge: markRaw(MergeNode),
  send: markRaw(SendNode),
  accept: markRaw(AcceptNode),
}

function onDragOver(event) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}


function onDrop(event) {
  event.preventDefault()
  const payload = event.dataTransfer?.getData('application/vueflow')
  if (!payload) return

  // Parse the payload
  let type
  try {
    type = JSON.parse(payload).type
  } catch {
    type = payload // fallback if not JSON
  }

  // Get position relative to VueFlow
  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY
  })

  // Build node object
  let node = { type, position }
  const diagramType = currentDiagram.value?.type

  if (diagramType === 'activity') {
    node.data = {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      diagramType: 'activity',
    }
  } else {
    node.data = {
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }
  }

  // get next node ID
  node.id = diagramStore.getNodeId()
  //console.log("onDrop node: ", node)

  // Add the node to VueFlow
  addNodes(node)

  setTimeout(diagramStore.saveDiagram, 100)
}


function onNodeDoubleClick(event) {
  diagramStore.showEditNodeModal(event.node)
}
function onEdgeDoubleClick(event) {
  diagramStore.showEditEdgeModal(event.edge)
}
</script>

<style scoped>
/* .canvas-area {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
} */
.diagram-canvas {
  width: 100%;
  height: 100%;
}
</style>
