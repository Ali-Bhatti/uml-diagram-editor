<template>
  <g>
    <BaseEdge :id="id" :path="path" :marker-end="markerEnd" :style="edgeStyle" />
    <g v-if="selected">
      <g v-for="center in segmentCenters" :key="center.index">
        <circle
          class="edge-handle-hit"
          :cx="center.x"
          :cy="center.y"
          r="12"
          @pointerdown="(e) => onHandlePointerDown(center, e)"
        />
        <circle
          class="edge-handle"
          :cx="center.x"
          :cy="center.y"
          r="5"
        />
      </g>
    </g>
    <EdgeLabelRenderer v-if="data?.label || label || data?.stereotype">
      <div :style="labelStyle" class="edge-label">
        <div v-if="data?.stereotype" class="stereotype">«{{ data.stereotype }}»</div>
        <div>{{ data?.label || label }}</div>
      </div>
    </EdgeLabelRenderer>
  </g>
</template>

<script setup>
import { BaseEdge, EdgeLabelRenderer, Position, getSimpleEdgeCenter } from '@vue-flow/core'
import { computed, ref } from 'vue'
import { useDiagramStore } from '../../stores/diagramStore'

const props = defineProps({
  id: String,
  sourceX: Number,
  sourceY: Number,
  targetX: Number,
  targetY: Number,
  sourcePosition: String,
  targetPosition: String,
  label: String,
  markerEnd: [String, Object],
  style: Object,
  data: Object,
  selected: Boolean,
})

const diagramStore = useDiagramStore()

const handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 },
}

function getDirection({ source, sourcePosition = Position.Bottom, target }) {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 }
  }
  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 }
}

function getPoints({
  source,
  sourcePosition = Position.Bottom,
  target,
  targetPosition = Position.Top,
  center,
  offset,
}) {
  const sourceDir = handleDirections[sourcePosition]
  const targetDir = handleDirections[targetPosition]
  const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset }
  const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset }
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped,
  })
  const dirAccessor = dir.x !== 0 ? 'x' : 'y'
  const currDir = dir[dirAccessor]
  let points
  let centerX, centerY
  const sourceGapOffset = { x: 0, y: 0 }
  const targetGapOffset = { x: 0, y: 0 }
  const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getSimpleEdgeCenter({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y,
  })
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    centerX = center?.x ?? defaultCenterX
    centerY = center?.y ?? defaultCenterY
    const verticalSplit = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y },
    ]
    const horizontalSplit = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY },
    ]
    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === 'x' ? verticalSplit : horizontalSplit
    } else {
      points = dirAccessor === 'x' ? horizontalSplit : verticalSplit
    }
  } else {
    const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }]
    const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }]
    if (dirAccessor === 'x') {
      points = sourceDir.x === currDir ? targetSource : sourceTarget
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource
    }
    if (sourcePosition === targetPosition) {
      const diff = Math.abs(source[dirAccessor] - target[dirAccessor])
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff)
        if (sourceDir[dirAccessor] === currDir) {
          sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset
        } else {
          targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset
        }
      }
    }
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x'
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite]
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite]
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite]
      const flipSourceTarget =
        (sourceDir[dirAccessor] === 1 && ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
        (sourceDir[dirAccessor] !== 1 && ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)))
      if (flipSourceTarget) {
        points = dirAccessor === 'x' ? sourceTarget : targetSource
      }
    }
    const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y }
    const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y }
    const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x))
    const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y))
    if (maxXDistance >= maxYDistance) {
      centerX = (sourceGapPoint.x + targetGapPoint.x) / 2
      centerY = points[0].y
    } else {
      centerX = points[0].x
      centerY = (sourceGapPoint.y + targetGapPoint.y) / 2
    }
  }
  const pathPoints = [
    source,
    { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y },
    ...points,
    { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y },
    target,
  ]
  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY]
}

function getBend(_, b) {
  return `L${b.x} ${b.y}`
}

const defaultPoints = computed(() => {
  const [pts] = getPoints({
    source: { x: props.sourceX, y: props.sourceY },
    sourcePosition: props.sourcePosition,
    target: { x: props.targetX, y: props.targetY },
    targetPosition: props.targetPosition,
    offset: 20,
  })
  return pts.slice(1, -1)
})

const handlePoints = computed(() => props.data?.points || defaultPoints.value)

const edgePoints = computed(() => [
  { x: props.sourceX, y: props.sourceY },
  ...handlePoints.value,
  { x: props.targetX, y: props.targetY },
])

const segmentCenters = computed(() => {
  const pts = edgePoints.value
  const centers = []
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    centers.push({
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
      index: i,
      orientation: a.x === b.x ? 'vertical' : 'horizontal',
    })
  }
  return centers
})

const path = computed(() => {
  const pts = edgePoints.value
  return pts.reduce((res, p, i) => {
    let segment
    if (i > 0 && i < pts.length - 1) {
      segment = getBend(pts[i - 1], p, pts[i + 1], 5)
    } else {
      segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`
    }
    return res + segment
  }, '')
})

const labelPos = computed(() => {
  const pts = edgePoints.value
  const mid = Math.floor(pts.length / 2)
  return pts[mid]
})

const labelStyle = computed(() => ({
  position: 'absolute',
  pointerEvents: 'all',
  transform: `translate(-50%, -50%) translate(${labelPos.value.x}px, ${labelPos.value.y}px)`,
}))

const edgeStyle = computed(() => ({ stroke: '#000', ...(props.style || {}) }))

const dragging = ref(null)

function onHandlePointerDown(center, event) {
  event.stopPropagation()
  const start = diagramStore.screenToFlowCoordinate({ x: event.clientX, y: event.clientY })
  dragging.value = {
    segmentIndex: center.index,
    orientation: center.orientation,
    start,
    startPoints: edgePoints.value.map(p => ({ ...p })),
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(event) {
  if (!dragging.value) return
  const pos = diagramStore.screenToFlowCoordinate({ x: event.clientX, y: event.clientY })
  const { segmentIndex, orientation, start, startPoints } = dragging.value
  const dx = pos.x - start.x
  const dy = pos.y - start.y
  const pts = startPoints.map(p => ({ ...p }))
  if (orientation === 'horizontal') {
    pts[segmentIndex].y += dy
    pts[segmentIndex + 1].y += dy
  } else {
    pts[segmentIndex].x += dx
    pts[segmentIndex + 1].x += dx
  }
  diagramStore.updateEdgePoints(props.id, pts.slice(1, -1))
}

function onPointerUp() {
  dragging.value = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
}
</script>

<style scoped>
.edge-handle-hit {
  fill: transparent;
  stroke: transparent;
  cursor: move;
  pointer-events: all;
}

.edge-handle {
  fill: #1e88e5;
  stroke: #fff;
  stroke-width: 1;
  pointer-events: none;
}
</style>

