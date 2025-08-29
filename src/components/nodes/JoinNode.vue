<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

const props = defineProps({ id: String, data: Object, selected: Boolean })

const rootEl = ref(null)
const lastWidth = ref(0)
const { edges, updateNode } = useVueFlow()

/* --- config --- */
const MIN_IN = 3            // min incoming lanes
const MAX_IN = 16           // hard cap
const PX_PER_LANE = 80      // ~ one lane per 80px of width

/* --- state --- */
// start from persisted value (if any)
const baseCount = ref(
  clamp(props.data?.inCount ?? 3, MIN_IN, MAX_IN)
)
// visible top target handles: ["t-1","t-2",...]
const inIds = ref(makeVisibleIds(baseCount.value, usedTargetIds()))

/* --- helpers --- */
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }
function idxFrom(id, prefix) {
  const m = String(id).match(new RegExp(`^${prefix}-(\\d+)$`))
  return m ? Number(m[1]) : 0
}
function usedTargetIds() {
  // edges that go INTO this node and specify a target handle
  return edges.value
    .filter(e => e.target === props.id && !!e.targetHandle)
    .map(e => e.targetHandle)
}
function makeVisibleIds(desiredBase, used) {
  const usedSet = new Set(used)
  const result = new Set(used)

  let i = 1
  while (result.size < desiredBase) {
    const id = `t-${i++}`
    if (!usedSet.has(id)) result.add(id)
  }
  // sort numerically for stable layout
  return Array.from(result).sort((a, b) => idxFrom(a, 't') - idxFrom(b, 't'))
}
const positions = computed(() => {
  const ids = inIds.value
  const n = ids.length
  const map = new Map()
  ids.forEach((id, i) => {
    const pct = Math.round(((i + 1) / (n + 1)) * 100)
    map.set(id, pct)
  })
  return map
})

/* --- resize + edge observers --- */
let ro
function recompute(width) {
  if (!width) return
  lastWidth.value = width

  const desiredBase = clamp(Math.floor(width / PX_PER_LANE), MIN_IN, MAX_IN)

  if (desiredBase !== baseCount.value) {
    baseCount.value = desiredBase
    updateNode(props.id, { data: { ...props.data, inCount: desiredBase } })
  }

  const used = usedTargetIds()
  inIds.value = makeVisibleIds(baseCount.value, used)
}

onMounted(() => {
  ro = new ResizeObserver(([entry]) => recompute(entry?.contentRect?.width || 0))
  if (rootEl.value) {
    ro.observe(rootEl.value)
    recompute(rootEl.value.getBoundingClientRect().width)
  }
})
onBeforeUnmount(() => ro?.disconnect())

// If edges change (connect/disconnect), refresh visible inputs
watch(edges, () => recompute(lastWidth.value), { deep: true })
</script>

<template>
  <div class="join-node" ref="rootEl">
    <NodeResizer
      :isVisible="selected"
      :min-width="80"
      :keep-aspect-ratio="false"
      :lineStyle="{ stroke: '#333' }"
      :handleStyle="{ fill: '#333' }"
    />

    <div class="bar"></div>

    <!-- dynamic IN (top) -->
    <Handle
      v-for="id in inIds"
      :key="id"
      type="target"
      :id="id"
      :position="Position.Top"
      :style="{ left: positions.get(id) + '%' }"
    />

    <!-- single OUT (bottom-center) -->
    <Handle
      type="source"
      :position="Position.Bottom"
      id="s-out"
      :style="{ left: '50%' }"
    />
  </div>
</template>

<style scoped>
.join-node {
  position: relative;
  --bar-h: 4px;        /* thickness of the bar */
  --handle-gap: 8px;   /* distance from the bar */
  width: 100%;
  height: 100%;
  min-width: 80px;
  min-height: 12px;
  box-sizing: border-box;
}

/* bar centered vertically */
.bar {
  position: absolute;
  left: 0; right: 0;
  top: 50%;
  height: var(--bar-h);
  transform: translateY(-50%);
  background: #333;
}

/* resizer overlay click-through; knobs remain clickable */
:deep(.vue-flow__resizer) { pointer-events: none; }
:deep(.vue-flow__resize-control) { pointer-events: auto; }

/* handles above the bar; center horizontally via left:% */
:deep(.vue-flow__handle) {
  z-index: 2;
  transform: translateX(-50%);
}

/* Top handles just ABOVE the bar, bottom handle just BELOW */
:deep(.vue-flow__handle-top) {
  top: calc(50% - (var(--bar-h)/2) - var(--handle-gap)) !important;
  bottom: auto !important;
}
:deep(.vue-flow__handle-bottom) {
  top: calc(50% + (var(--bar-h)/2)) !important;
  bottom: auto !important;
}
</style>
