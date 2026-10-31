<!-- The home media globe: every still sits on a latitude ring of a sphere and the
     sphere turns on its axis. Drag to spin it (with inertia) and tilt it,
     scroll to spin, click a card to open its project. Cards are oriented with
     CSS 3D transforms; depth drives opacity and stacking so the far side reads
     as the back of the globe. With "reduce motion" on, it's a static grid. -->
<script setup lang="ts">
import { projects } from '~/data/site'
import type { GlobeItem } from '~/utils/globeLayout'

const props = defineProps<{ items: GlobeItem[]; active: boolean }>()
const emit = defineEmits<{ ready: [] }>()

const root = ref<HTMLElement>()
const label = ref<HTMLElement>()
const els = ref<HTMLElement[]>([])
const hovered = ref<GlobeItem | null>(null)

const SPIN = 7          // deg/s auto rotation
const TILT = -14        // resting tilt: look slightly down onto the globe
const MAX_TILT = 40
const RAD = Math.PI / 180

const radius = ref(300)
const cx = ref(0), cy = ref(0)
let yaw = 0, pitch = TILT, vYaw = 0, vPitch = 0, spin = 1
let dragging = false, moved = 0, lx = 0, ly = 0
let last = 0, raf = 0, loaded = 0, readySent = false, released = 0
let reduce = false
const still = ref(false) // reduced motion: show the static grid instead
const touch = ref(false)
const workCount = projects.length

function hover(it: GlobeItem | null, el?: EventTarget | null) {
  hovered.value = it
  const v = (el as HTMLElement | undefined)?.querySelector('video')
  if (!v) return
  if (it) v.play().catch(() => {})
  else { v.pause(); v.currentTime = 0 }
}

// Card size: equal area-ish, so wide and tall stills feel the same weight
function size(ratio: number) {
  const w = Math.min(radius.value * 0.34 / Math.sqrt(ratio), radius.value * 0.56)
  return { w, h: w * ratio }
}

function measure() {
  const vw = innerWidth, vh = innerHeight
  const mobile = vw < 768
  radius.value = mobile ? Math.min(vw * 0.4, vh * 0.3) : Math.min(vw * 0.25, vh * 0.34)
  cx.value = vw / 2
  cy.value = mobile ? vh * 0.44 : vh * 0.5
}

function frame(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
  last = now
  // Ease the spin down while a card is hovered so it can be read and clicked
  spin += ((hovered.value ? 0.15 : 1) - spin) * Math.min(1, dt * 4)
  if (!dragging) {
    yaw += vYaw; pitch += vPitch
    vYaw *= 0.95; vPitch *= 0.9
    if (!reduce) yaw += SPIN * spin * dt
    // Drift back to the resting tilt a moment after release
    if (now - released > 600) pitch += (TILT - pitch) * Math.min(1, dt * 1.5)
  }
  pitch = Math.max(-MAX_TILT, Math.min(MAX_TILT, pitch))

  const R = radius.value
  const sp = Math.sin(pitch * RAD), cp = Math.cos(pitch * RAD)
  els.value.forEach((el, i) => {
    const it = props.items[i]!
    const th = it.lon + yaw
    // Depth of the card centre after the same rotations as the transform, -1 (back) to 1 (front)
    const d = -Math.sin(it.lat * RAD) * sp + Math.cos(it.lat * RAD) * Math.cos(th * RAD) * cp
    const t = Math.max(0, Math.min(1, (d + 0.25) / 0.85))
    el.style.transform = `translate(-50%,-50%) rotateX(${pitch}deg) rotateY(${th}deg) rotateX(${it.lat}deg) translateZ(${R}px)`
    el.style.opacity = String(0.1 + 0.9 * t * t * (3 - 2 * t))
    el.style.zIndex = String(Math.round((d + 1) * 100))
    el.style.pointerEvents = d > 0.05 ? 'auto' : 'none'
  })
  raf = requestAnimationFrame(frame)
}

function down(e: PointerEvent) {
  if (e.button !== 0) return
  dragging = true; moved = 0; lx = e.clientX; ly = e.clientY; vYaw = vPitch = 0
  root.value!.setPointerCapture(e.pointerId)
}
function move(e: PointerEvent) {
  if (label.value) label.value.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`
  if (!dragging) return
  const dx = e.clientX - lx, dy = e.clientY - ly
  const k = 60 / radius.value // degrees per pixel, so a drag feels the same at any size
  yaw += dx * k; pitch -= dy * k
  vYaw = dx * k; vPitch = -dy * k
  moved += Math.abs(dx) + Math.abs(dy)
  lx = e.clientX; ly = e.clientY
}
function up(e: PointerEvent) {
  if (!dragging) return
  dragging = false
  released = performance.now()
  // Pointer capture retargets click to the globe, so resolve the click here
  if (moved < 6) {
    const hit = document.elementsFromPoint(e.clientX, e.clientY)
      .find((n) => (n as HTMLElement).dataset?.slug) as HTMLElement | undefined
    if (hit) navigateTo(`/work/${hit.dataset.slug}`)
  }
}
function wheel(e: WheelEvent) {
  e.preventDefault()
  vYaw -= (e.deltaY + e.deltaX) * 0.012
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') vYaw -= 1.2
  if (e.key === 'ArrowRight') vYaw += 1.2
  if (e.key === 'ArrowUp') { vPitch += 1; released = performance.now() }
  if (e.key === 'ArrowDown') { vPitch -= 1; released = performance.now() }
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

function start() { if (!raf && !still.value) { last = 0; raf = requestAnimationFrame(frame) } }
function stop() { cancelAnimationFrame(raf); raf = 0 }
watch(() => props.active, (a) => (a ? start() : stop()))

onMounted(() => {
  reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  touch.value = matchMedia('(hover: none)').matches
  if (reduce) { still.value = true; sendReady(); return }
  measure()
  addEventListener('resize', measure)
  root.value!.addEventListener('wheel', wheel, { passive: false })
  // Images that finished before hydration never fire @load
  root.value!.querySelectorAll('img').forEach((img) => {
    if ((img as HTMLImageElement).complete) onLoad({ target: img } as unknown as Event)
  })
  setTimeout(sendReady, 2500)
  if (props.active) start()
})
onBeforeUnmount(() => { stop(); removeEventListener('resize', measure); root.value?.removeEventListener('wheel', wheel) })
</script>

<template>
  <div v-if="still" class="still-grid" data-lenis-prevent>
    <NuxtLink v-for="it in items" :key="it.id" :to="`/work/${it.slug}`" class="still-card">
      <img :src="it.src" :alt="it.alt" loading="lazy" :style="{ aspectRatio: `1 / ${it.ratio}` }">
      <span class="mono">{{ it.title }}</span>
    </NuxtLink>
  </div>
  <div
    v-else
    ref="root"
    class="globe"
    data-lenis-prevent
    tabindex="0"
    aria-label="Project globe. Drag or scroll to spin it."
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="dragging = false"
    @keydown="onKey"
  >
    <div class="stage" :style="{ left: cx + 'px', top: cy + 'px', perspective: radius * 3.6 + 'px' }">
      <a
        v-for="it in items"
        :key="it.id"
        ref="els"
        :href="`/work/${it.slug}`"
        :data-slug="it.slug"
        class="card"
        :style="{ width: size(it.ratio).w + 'px', height: size(it.ratio).h + 'px' }"
        :aria-label="it.title"
        draggable="false"
        @click.prevent="(e: MouseEvent) => e.detail === 0 && navigateTo(`/work/${it.slug}`)"
        @mouseenter="(e: MouseEvent) => hover(it, e.currentTarget)"
        @mouseleave="(e: MouseEvent) => hover(null, e.currentTarget)"
      >
        <img :src="it.src" :alt="it.alt" class="fade-img" draggable="false" decoding="async" @load="onLoad">
        <video v-if="it.loop" :src="it.loop" muted loop playsinline preload="none" aria-hidden="true" />
      </a>
    </div>
    <div ref="label" class="cursor-label mono" aria-hidden="true">
      <span v-if="hovered">{{ hovered.title }}<template v-if="hovered.year !== '—'"> — {{ hovered.year }}</template></span>
    </div>
  </div>
  <p v-if="!still" class="hint mono" :style="{ top: cy + radius * 1.12 + 'px' }">
    <span>{{ touch ? 'Swipe to spin' : 'Drag to spin' }}</span>
    <span>{{ touch ? 'Tap to open' : 'Click to open' }}</span>
    <NuxtLink to="/work" class="hover-fade">All work ({{ String(workCount).padStart(2, '0') }}) →</NuxtLink>
  </p>
</template>

<style scoped>
.globe {
  position: fixed; inset: 0; z-index: var(--z-canvas);
  overflow: hidden; cursor: grab; touch-action: none; user-select: none; outline: none;
}
.globe:active { cursor: grabbing; }
/* Zero-size point at the globe centre; its perspective is the camera */
.stage { position: absolute; width: 0; height: 0; perspective-origin: 0 0; }
.card {
  position: absolute; top: 0; left: 0; display: block; overflow: hidden;
  opacity: 0; will-change: transform, opacity; background: #f2f2f2;
}
.card img, .card video { width: 100%; height: 100%; object-fit: cover; pointer-events: none; }
.card video { position: absolute; inset: 0; opacity: 0; transition: opacity var(--dur-normal) var(--ease-alpha); }
.card:hover video { opacity: 1; }
/* Desktop: bottom-right, opposite the wordmark. Mobile: just under the globe. */
.hint {
  position: fixed; right: calc(4.5rem + var(--margin)); bottom: calc(var(--strip-h) + var(--margin)); z-index: var(--z-hero);
  display: flex; gap: 1.6rem; pointer-events: none;
}
@media (min-width: 768px) { .hint { top: auto !important; } }
@media (max-width: 767px) { .hint { left: 0; right: 0; bottom: auto; justify-content: center; } }
.hint span::after { content: '·'; margin-left: 1.6rem; }
.hint a { pointer-events: auto; text-decoration: underline; text-underline-offset: .2em; }
.still-grid {
  position: fixed; inset: 0; z-index: var(--z-canvas); overflow-y: auto;
  display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 1.6rem; align-items: start;
  padding: 8rem calc(4.5rem + var(--margin)) 40vh var(--margin); background: #fff;
}
.still-card img { width: 100%; object-fit: cover; background: #f2f2f2; margin-bottom: .6rem; }
@media (max-width: 767px) { .still-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.cursor-label {
  position: fixed; top: 0; left: 0; pointer-events: none; z-index: 5;
  padding: 1.4rem 0 0 1.6rem; white-space: nowrap; color: #000; font-size: 1.3rem;
}
.cursor-label span { background: #fff; padding: .4rem .6rem; }
.cursor-label span::after { content: ' — Open →'; color: var(--grey); }
@media (hover: none) { .cursor-label { display: none; } }
</style>
