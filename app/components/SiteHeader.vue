<script setup lang="ts">
defineProps<{ project?: boolean }>()
const route = useRoute()
const contactTo = computed(() => ({ path: route.path, query: { ...route.query, contact: '1' } }))
</script>

<template>
  <header class="header label" :class="{ solid: project }">
    <nav>
      <template v-if="project">
        <NuxtLink to="/work" class="hover-fade">← Back to work</NuxtLink>
      </template>
      <template v-else>
        <NuxtLink to="/work" class="hover-fade">Work</NuxtLink>
        <NuxtLink to="/about" class="hover-fade">Who's Afeez?</NuxtLink>
      </template>
      <NuxtLink :to="contactTo" class="hover-fade">Contact</NuxtLink>
    </nav>
    <NuxtLink v-if="project" to="/" class="hover-fade">Afeez Was Here®</NuxtLink>
  </header>
</template>

<style scoped>
.header {
  position: fixed; top: 0; left: 0; right: 0; z-index: calc(var(--z-panel) + 2);
  display: flex; justify-content: space-between; padding: var(--margin);
  color: #fff; mix-blend-mode: difference; pointer-events: none;
}
.header a { pointer-events: auto; }
nav { display: flex; gap: 2.4rem; }
/* Over a scrolling project page, a white bar keeps the menu off the body text */
.header.solid { color: #000; mix-blend-mode: normal; background: #fff; border-bottom: 1px solid rgba(0, 0, 0, .08); }
</style>
