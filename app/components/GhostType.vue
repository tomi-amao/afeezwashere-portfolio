<!-- One faint, slow marquee behind the globe: the tagline and nothing else,
     so the wordmark in front reads at a glance. -->
<script setup lang="ts">
const { site } = useContent()
defineProps<{ active: boolean }>()
const phrase = `${site.tagline[0]} ${site.tagline[1]}`
</script>

<template>
  <div class="ghost" aria-hidden="true">
    <div class="track display" :class="{ paused: !active }">
      <span v-for="i in 4" :key="i">{{ phrase }}&nbsp;—&nbsp;</span>
    </div>
  </div>
</template>

<style scoped>
.ghost {
  position: fixed; inset: 0; z-index: var(--z-ghost); overflow: hidden; pointer-events: none;
  display: flex; align-items: center; color: #000; opacity: .07;
}
.track { display: flex; white-space: nowrap; font-size: 16rem; animation: marquee 90s linear infinite; }
.track.paused { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(-50%); } }
@media (max-width: 767px) { .track { font-size: 9rem; } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; } }
</style>
