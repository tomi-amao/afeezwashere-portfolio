<!-- Big wordmark, bottom-left. White + difference blend: black on white, inverts over images. -->
<script setup lang="ts">
defineProps<{ lines: string[] }>()
</script>

<template>
  <h1 class="hero display">
    <span v-for="l in lines" :key="l" class="line"><span class="hero-line">{{ l }}</span></span>
  </h1>
</template>

<style scoped>
.hero {
  position: fixed; left: 0; bottom: 0; z-index: var(--z-hero);
  padding: 0 0 var(--margin) var(--margin);
  color: #fff; mix-blend-mode: difference; pointer-events: none;
  font-size: 7.2rem;
}
.line { display: block; overflow: hidden; padding-bottom: .04em; }
.hero-line { display: block; }
@media (max-width: 767px) { .hero { font-size: 2.8rem; } }
</style>
