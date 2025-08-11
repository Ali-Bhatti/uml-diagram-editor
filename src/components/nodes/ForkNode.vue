<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

const props = defineProps({ id: String, data: Object, selected: Boolean })

const rootEl = ref(null)
const lastWidth = ref(0)

const { edges, updateNode } = useVueFlow()

/* ---------- config ---------- */
const MIN_OUT = 3          // minimum number of outgoing handles
const MAX_OUT = 16         // hard cap
const PX_PER_LANE = 80     // add ~1 outgoing per this many px of width

/* ---------- state ---------- */
// start from persisted base count if present, else 3
const baseCount = ref(
  clampNumber(props.data?.outCount ?? 3, MIN_OUT, MAX_OUT)
)

// currently visible handle ids (e.g., ["s-1","s-2","s-3"])
const outIds = ref(makeVisibleIds(baseCount.value, usedHandleIds()))

/* ---------- helpers ---------- */
function clampNumber(n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }

function handleIndex(id) {
  // "s-12" -> 12
  const m = String(id).match(/^s-(\d+)$/)
  return m ? Number(m[1]) : 0
}

function usedHandleIds() {
  // collect *current* outgoing handle ids used by edges from this node
  return edges.value
    .filter(e => e.source === props.id && !!e.sourceHandle)
    .map(e => e.sourceHandle)
}

function makeVisibleIds(desiredBase, used) {
  // ensure used handles are ALWAYS present; then fill up to desiredBase
  const usedSet = new Set(used)
  const result = new Set(used)

  let i = 1
  while (result.size < desiredBase) {
    const id = `s-${i++}`
    if (!usedSet.has(id)) result.add(id)
  }
  // Sort by numeric index so layout is stable
  return Array.from(result).sort((a, b) => handleIndex(a) - handleIndex(b))
}

/* evenly spaced percentages for the current outIds */
const positions = computed(() => {
  const ids = outIds.value
  const n = ids.length
  const pos = new Map()
  ids.forEach((id, i) => {
    const pct = Math.round(((i + 1) / (n + 1)) * 100)
    pos.set(id, pct)
  })
  return pos
})

/* ---------- resize + edges observers ---------- */
let ro
function recompute(width) {
  if (!width) return
  lastWidth.value = width

  // compute desired base by width
  const desiredBase = clampNumber(Math.floor(width / PX_PER_LANE), MIN_OUT, MAX_OUT)

  // keep baseCount in node data (for persistence)
  if (desiredBase !== baseCount.value) {
    baseCount.value = desiredBase
    updateNode(props.id, { data: { ...props.data, outCount: desiredBase } })
  }

  // keep used handles even if above base; fill up to base with lowest free ids
  const used = usedHandleIds()
  outIds.value = makeVisibleIds(baseCount.value, used)
}

onMounted(() => {
  ro = new ResizeObserver(([entry]) => recompute(entry?.contentRect?.width || 0))
  if (rootEl.value) ro.observe(rootEl.value)

  // initial compute (in case observer fires late)
  if (rootEl.value) {
    const w = rootEl.value.getBoundingClientRect().width
    recompute(w)
  }
})

// Recompute when edges are added/removed (e.g., disconnect a lane)
watch(edges, () => {
  recompute(lastWidth.value)
}, { deep: true })

onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div class="fork-node" ref="rootEl">
    <NodeResizer
      :isVisible="selected"
      :min-width="80"
      :keep-aspect-ratio="false"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />

    <div class="bar"></div>

    <!-- UML-correct fork: ONE incoming (top-center) -->
    <Handle type="target" :position="Position.Top" id="t-in" :style="{ left: '50%' }" />

    <!-- MANY outgoing (bottom, dynamic & safe to shrink) -->
    <Handle
      v-for="id in outIds"
      :key="id"
      type="source"
      :id="id"
      :position="Position.Bottom"
      :style="{ left: positions.get(id) + '%' }"
    />
  </div>
</template>

<style scoped>
.fork-node{
  --bar-h: 4px;        /* bar thickness */
  --gap: 8px;          /* handle distance from bar (visual) */

  position: relative;
  width: 100%;
  height: 100%;
  min-width: 80px;
  min-height: 12px;
  box-sizing: border-box;
}

/* bar centered vertically */
.bar{
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  height: var(--bar-h);
  transform: translateY(-50%);
  background: #333;
}

/* resizer overlay click-through; knobs stay clickable */
:deep(.vue-flow__resizer){ pointer-events: none; }
:deep(.vue-flow__resize-control){ pointer-events: auto; }

/* keep handles above the bar; bottom handles sit just below it */
:deep(.vue-flow__handle){ z-index: 2; transform: translateX(-50%); }
:deep(.vue-flow__handle-top){
  top: calc(50% - (var(--bar-h)/2) - var(--gap)) !important;
  bottom: auto !important;
}
:deep(.vue-flow__handle-bottom){
  top: calc(50% + (var(--bar-h)/2)) !important;
  bottom: auto !important;
}
</style>
