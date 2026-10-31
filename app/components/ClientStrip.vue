<!-- Thin scrolling strip of previous clients along the bottom edge of the home page. -->
<script setup lang="ts">
import { site } from '~/data/site'
const line = site.previousClients.join(' · ')
</script>

<template>
  <div class="strip mono" role="region" aria-label="Previous clients">
    <span class="sr-only">Previous clients: {{ site.previousClients.join(', ') }}</span>
    <div class="track" aria-hidden="true">
      <span v-for="i in 2" :key="i">{{ line }}&nbsp;·&nbsp;</span>
    </div>
  </div>
</template>

<style scoped>
.strip {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: var(--z-hero);
  height: var(--strip-h); display: flex; align-items: center; overflow: hidden;
  background: #fff; border-top: 1px solid rgba(0, 0, 0, .1); pointer-events: none;
}
.track { display: flex; white-space: nowrap; animation: strip 60s linear infinite; }
@keyframes strip { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; } }
</style>
