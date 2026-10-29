<!-- The home canvas: drifts on its own, pans with drag (with inertia) and wheel,
     and wraps forever. One copy of each item is rendered and its on-screen
     position is wrapped with modulo maths; off-screen items are hidden. -->
<script setup lang="ts">
import { canvasOffset, type CanvasItem } from '~/utils/canvasLayout'

const props = defineProps<{ items: CanvasItem[]; active: boolean }>()
const emit = defineEmits<{ ready: [] }>()

const root = ref<HTMLElement>()
const label = ref<HTMLElement>()
const els = ref<HTMLElement[]>([])
const hovered = ref<CanvasItem | null>(null)

const DRIFT = { x: 18, y: 12 } // px/s, measured on GA
let ox = 0, oy = 0, vx = 0, vy = 0
let dragging = false, moved = 0, lx = 0, ly = 0
let last = 0, raf = 0, loaded = 0, readySent = false
let reduce = false

const mod = (n: number, m: number) => ((n % m) + m) % m

function frame(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
  last = now
  if (!dragging) {
    ox += vx; oy += vy; vx *= 0.94; vy *= 0.94 // inertia after release
    if (!reduce) { ox += DRIFT.x * dt; oy += DRIFT.y * dt }
  }
  canvasOffset.x = ox; canvasOffset.y = oy

  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  const vw = innerWidth, vh = innerHeight
  // Tile must be bigger than the viewport plus the largest item, so nothing pops in view
  const W = Math.max(150 * rem, vw + 30 * rem)
  const H = Math.max(130 * rem, vh + 45 * rem)

  els.value.forEach((el, i) => {
    const it = props.items[i]!
    const w = it.w * rem, h = w * it.ratio
    let x = mod(it.fx * W + ox, W), y = mod(it.fy * H + oy, H)
    if (x > vw) x -= W
    if (y > vh) y -= H
    const visible = x < vw && x + w > 0 && y < vh && y + h > 0
    el.style.visibility = visible ? 'visible' : 'hidden'
    if (visible) el.style.transform = `translate3d(${x}px,${y}px,0)`
  })
  raf = requestAnimationFrame(frame)
}

function down(e: PointerEvent) {
  if (e.button !== 0) return
  dragging = true; moved = 0; lx = e.clientX; ly = e.clientY; vx = vy = 0
  root.value!.setPointerCapture(e.pointerId)
}
function move(e: PointerEvent) {
  if (label.value) label.value.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`
  if (!dragging) return
  const dx = e.clientX - lx, dy = e.clientY - ly
  ox += dx; oy += dy; vx = dx; vy = dy
  moved += Math.abs(dx) + Math.abs(dy)
  lx = e.clientX; ly = e.clientY
}
function up(e: PointerEvent) {
  if (!dragging) return
  dragging = false
  // Pointer capture retargets click to the canvas, so resolve the click here
  if (moved < 6) {
    const hit = document.elementsFromPoint(e.clientX, e.clientY)
      .find((n) => (n as HTMLElement).dataset?.slug) as HTMLElement | undefined
    if (hit) navigateTo(`/work/${hit.dataset.slug}`)
  }
}
function wheel(e: WheelEvent) {
  e.preventDefault()
  vx -= e.deltaX * 0.15; vy -= e.deltaY * 0.15
}
function onKey(e: KeyboardEvent) {
  const step = 40
  if (e.key === 'ArrowLeft') vx += step / 6
  if (e.key === 'ArrowRight') vx -= step / 6
  if (e.key === 'ArrowUp') vy += step / 6
  if (e.key === 'ArrowDown') vy -= step / 6
}

function onLoad(e: Event) {
  (e.target as HTMLElement).classList.add('is-loaded')
  if (++loaded >= Math.min(12, props.items.length)) sendReady()
}
function sendReady() {
  if (readySent) return
  readySent = true
  emit('ready')
}

function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame) } }
function stop() { cancelAnimationFrame(raf); raf = 0 }
watch(() => props.active, (a) => (a ? start() : stop()))

onMounted(() => {
  reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  root.value!.addEventListener('wheel', wheel, { passive: false })
  // Images that finished before hydration never fire @load
  root.value!.querySelectorAll('img').forEach((img) => {
    if ((img as HTMLImageElement).complete) onLoad({ target: img } as unknown as Event)
  })
  setTimeout(sendReady, 2500)
  if (props.active) start()
})
onBeforeUnmount(stop)
</script>

<template>
  <div
    ref="root"
    class="canvas"
    data-lenis-prevent
    tabindex="0"
    aria-label="Project canvas. Drag or scroll to explore."
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="dragging = false"
    @keydown="onKey"
  >
    <a
      v-for="it in items"
      :key="it.id"
      ref="els"
      :href="`/work/${it.slug}`"
      :data-slug="it.slug"
      class="item"
      :style="{ width: it.w + 'rem', aspectRatio: `1 / ${it.ratio}`, zIndex: it.z }"
      :aria-label="it.title"
      draggable="false"
      @click.prevent="(e: MouseEvent) => e.detail === 0 && navigateTo(`/work/${it.slug}`)"
      @mouseenter="hovered = it"
      @mouseleave="hovered = null"
    >
      <img :src="it.src" alt="" class="fade-img" draggable="false" decoding="async" @load="onLoad">
    </a>
    <div ref="label" class="cursor-label mono" aria-hidden="true">
      <span v-if="hovered">{{ hovered.title }}<template v-if="hovered.year !== '—'"> — {{ hovered.year }}</template></span>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  position: fixed; inset: 0; z-index: var(--z-canvas);
  overflow: hidden; cursor: grab; touch-action: none; user-select: none; outline: none;
}
.canvas:active { cursor: grabbing; }
.item {
  position: absolute; top: 0; left: 0; display: block;
  visibility: hidden; will-change: transform; background: #f2f2f2;
}
.item img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.cursor-label {
  position: fixed; top: 0; left: 0; pointer-events: none; z-index: 5;
  padding: 1.2rem 0 0 1.4rem; white-space: nowrap; color: #000;
}
.cursor-label span { background: #fff; padding: .2rem .4rem; }
@media (hover: none) { .cursor-label { display: none; } }
</style>
