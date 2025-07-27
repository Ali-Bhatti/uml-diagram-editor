<template>
  <div class="canvas-area">
    <VueFlow 
      v-if="currentDiagram"
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      @dragover="onDragOver"
      @drop="onDrop"
      @connect="diagramStore.onConnect"
      @node-double-click="onNodeDoubleClick"
      class="diagram-canvas"
      fit-view-on-init
    >
      <Background />
      <Controls />
      <MiniMap />
    </VueFlow>
    <div v-else class="canvas-placeholder">
      <h2>Welcome to the UML Diagram Editor</h2>
      <p>Select a diagram from the dropdown or create a new one to start.</p>
      <button class="btn btn-primary" @click="diagramStore.showNewDiagramModal">Create New Diagram</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueFlow } from '@vue-flow/core'
import { storeToRefs } from 'pinia'
import { useDiagramStore } from '../stores/diagramStore'
import ActorNode from './nodes/ActorNode.vue'
import UseCaseNode from './nodes/UseCaseNode.vue'
import StartNode from './nodes/StartNode.vue'
import EndNode from './nodes/EndNode.vue'
import ActionNode from './nodes/ActionNode.vue'
import DecisionNode from './nodes/DecisionNode.vue'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

const nodeTypes = {
  actor: ActorNode,
  useCase: UseCaseNode,
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  decision: DecisionNode,
}

const diagramStore = useDiagramStore()
const { currentDiagram } = storeToRefs(diagramStore)
const { nodes, edges } = diagramStore

const onDragOver = (event) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event) => {
  const type = event.dataTransfer?.getData('application/vueflow')
  if (!type) return

  const position = diagramStore.project({ x: event.clientX, y: event.clientY - 40 })
  diagramStore.addNode({
    type,
    position,
    label: `${type} node`,
  })
}

function onNodeDoubleClick(event) {
  diagramStore.showEditNodeModal(event.node)
}
</script>
