<script setup lang="ts">
defineProps<{ done: boolean }>()
</script>

<template>
  <div class="loader" :class="{ done }" aria-hidden="true">
    <span class="mono">Loading</span>
  </div>
</template>

<style scoped>
.loader {
  position: fixed; inset: 0; z-index: var(--z-loader); background: #fff;
  display: flex; align-items: flex-end; padding: var(--margin);
  transition: opacity var(--dur-slow) var(--ease-alpha), visibility 0s linear 0s;
}
.loader.done { opacity: 0; visibility: hidden; transition: opacity var(--dur-slow) var(--ease-alpha), visibility 0s linear var(--dur-slow); }
</style>
