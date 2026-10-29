<!-- Faint type behind the canvas: repeating bio on the left, staggered wordmarks
     in the centre. Moves at 0.2x the canvas offset for a gentle parallax. -->
<script setup lang="ts">
import { site } from '~/data/site'
import { canvasOffset } from '~/utils/canvasLayout'

const props = defineProps<{ active: boolean }>()
const inner = ref<HTMLElement>()
let raf = 0
const mod = (n: number, m: number) => ((n % m) + m) % m

function frame() {
  const el = inner.value
  if (el) {
    const half = el.offsetHeight / 2
    el.style.transform = `translate3d(0,${mod(canvasOffset.y * 0.2, half) - half}px,0)`
  }
  raf = requestAnimationFrame(frame)
}
watch(() => props.active, (a) => { cancelAnimationFrame(raf); if (a) raf = requestAnimationFrame(frame) })
onMounted(() => { if (props.active) raf = requestAnimationFrame(frame) })
onBeforeUnmount(() => cancelAnimationFrame(raf))

const block = Array.from({ length: 4 })
</script>

<template>
  <div class="ghost" aria-hidden="true">
    <div ref="inner" class="inner">
      <div v-for="(_, copy) in 2" :key="copy" class="grid-w sheet">
        <p class="tagline display">{{ site.tagline[0] }}<br>{{ site.tagline[1] }}</p>
        <div class="copy">
          <p v-for="(_, i) in block" :key="i">{{ site.ghostCopy }}</p>
        </div>
        <div class="marks">
          <p v-for="(_, i) in block" :key="i" class="mark display" :style="{ marginLeft: (i % 3) * 8 + 'rem' }">
            Afeez Was Here®<br><span>Film / Direction / Photo</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ghost { position: fixed; inset: 0; z-index: var(--z-ghost); overflow: hidden; pointer-events: none; color: #000; opacity: .1; }
.inner { will-change: transform; }
.sheet { padding-block: 6rem 10rem; row-gap: 4rem; }
.tagline { grid-column: 9 / span 14; font-size: 6rem; }
.copy { grid-column: 1 / span 7; display: grid; gap: 2rem; font-size: 1.6rem; line-height: 1.25; }
.marks { grid-column: 9 / span 15; display: grid; gap: 8rem; }
.mark { font-size: 5rem; }
.mark span { font-size: .4em; letter-spacing: 0; }
@media (max-width: 767px) {
  .tagline { grid-column: 1 / -1; font-size: 4rem; }
  .copy { grid-column: 1 / span 14; }
  .marks { grid-column: 1 / -1; }
}
</style>
