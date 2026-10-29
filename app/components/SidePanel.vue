<!-- Slides in from the right. When `peek` (a letter) is set and the panel is closed it stays
     parked with a sliver showing, like GA's shop teaser; clicking the sliver opens it. -->
<script setup lang="ts">
const props = defineProps<{ open: boolean; peek?: string; openTo?: string; label: string }>()
const router = useRouter()
const body = ref<HTMLElement>()
watch(() => props.open, (o) => { if (o) nextTick(() => body.value?.scrollTo(0, 0)) })
function close() { router.push('/') }
function onClick() { if (!props.open && props.openTo) router.push(props.openTo) }
</script>

<template>
  <div>
    <Transition name="fade">
      <div v-if="open" class="scrim" @click="close" />
    </Transition>
    <aside
      class="panel"
      :class="{ open, peek: !!peek }"
      :aria-label="label"
      :aria-hidden="!open"
      :inert="!open || undefined"
      data-lenis-prevent
      @click="onClick"
    >
      <span v-if="peek" class="peek-mark display" aria-hidden="true">{{ peek }}</span>
      <button class="close label" type="button" @click.stop="close">Close</button>
      <div ref="body" class="body"><slot /></div>
    </aside>
    <button v-if="peek && !open" class="peek-hit" type="button" :aria-label="`Open ${label}`" @click="onClick" />
  </div>
</template>

<style scoped>
.scrim { position: fixed; inset: 0; z-index: var(--z-scrim); background: rgba(255, 255, 255, .6); }
.panel {
  position: fixed; top: 0; right: 0; z-index: var(--z-panel);
  width: 75vw; height: 100vh; height: 100dvh; background: #fff; border-left: 1px solid rgba(0, 0, 0, .1);
  transform: translateX(100%); transition: transform var(--dur-slow) var(--ease-panel);
}
.panel.peek { transform: translateX(calc(100% - 4.5rem)); }
.panel.open { transform: translateX(0); }
.panel:not(.open) .body { overflow: hidden; }
.peek-mark {
  position: absolute; left: 1rem; top: var(--margin); font-size: 14rem; pointer-events: none;
  transition: opacity var(--dur-normal) var(--ease-alpha);
}
.panel.open .peek-mark { opacity: 0; }
.close {
  position: absolute; left: 1.2rem; top: var(--margin); writing-mode: vertical-rl;
  transition: opacity var(--dur-normal) var(--ease-alpha);
}
.panel:not(.open) .close { opacity: 0; pointer-events: none; }
.close:hover { opacity: .4; }
.body { height: 100%; overflow-y: auto; overscroll-behavior: contain; padding: var(--margin) var(--margin) 6rem 6rem; }
.peek-hit { position: fixed; top: 0; right: 0; width: 4.5rem; height: 100vh; z-index: calc(var(--z-panel) + 1); cursor: pointer; }
@media (max-width: 767px) {
  .panel { width: 100vw; }
  .panel.peek:not(.open) { transform: translateX(calc(100% - 3rem)); }
  .peek-hit { width: 3rem; }
  .body { padding-left: 4.5rem; }
}
</style>
