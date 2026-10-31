<script setup lang="ts">
import { site } from '~/data/site'
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const copied = ref(false)
async function copy() {
  try { await navigator.clipboard.writeText(site.email) } catch { return }
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="overlay" role="dialog" aria-modal="true" aria-label="Contact" data-lenis-prevent>
      <button class="close label hover-fade" type="button" @click="emit('close')">Close ×</button>
      <div class="center">
        <p class="grey ask">Got a project?<template v-if="site.availability"> <span class="avail">{{ site.availability }}</span></template></p>
        <a :href="`mailto:${site.email}`" class="email display hover-fade">{{ site.email }}</a>
        <button type="button" class="copy label" @click="copy">{{ copied ? 'Copied ✓' : 'Copy email' }}</button>
        <dl class="meta">
          <div><dt class="mono grey">Based</dt><dd>{{ site.location }}</dd></div>
          <div v-if="site.rep"><dt class="mono grey">Representation</dt><dd>{{ site.rep.name }} — <a :href="`mailto:${site.rep.email}`" class="hover-fade">{{ site.rep.email }}</a></dd></div>
          <div>
            <dt class="mono grey">Social</dt>
            <dd><a v-for="s in site.socials" :key="s.label" :href="s.href" target="_blank" rel="noopener" class="hover-fade social">{{ s.label }}</a></dd>
          </div>
          <div class="clients"><dt class="mono grey">Previous clients</dt><dd>{{ site.previousClients.join(', ') }}</dd></div>
        </dl>
      </div>
      <div class="bar">
        <span class="label">{{ site.email }}</span>
        <a :href="`mailto:${site.email}`" class="cta label">Say hello →</a>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; z-index: var(--z-overlay); background: #fff; display: flex; flex-direction: column; overflow-y: auto; }
.close { position: absolute; top: var(--margin); right: var(--margin); }
.center { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 8rem var(--margin) 4rem; }
.ask { font-size: 3rem; letter-spacing: -0.02em; font-weight: 500; }
.email { font-size: 8.4rem; text-transform: none; word-break: break-word; }
.avail { color: #000; }
.copy {
  align-self: flex-start; margin-top: 2rem; border: 1px solid #000; border-radius: 99rem; padding: .8rem 1.6rem;
  transition: background var(--dur-normal) var(--ease-alpha), color var(--dur-normal) var(--ease-alpha);
}
.copy:hover { background: #000; color: #fff; }
.meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2rem; margin-top: 5rem; max-width: 90rem; }
.meta dt { margin-bottom: .4rem; }
.social { margin-right: 1.6rem; }
.bar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; background: #000; color: #fff; padding: 1.6rem var(--margin); }
.cta { border: 1px solid #fff; border-radius: 99rem; padding: .8rem 1.6rem; transition: background var(--dur-normal) var(--ease-alpha), color var(--dur-normal) var(--ease-alpha); }
.cta:hover { background: #fff; color: #000; }
@media (max-width: 767px) {
  .email { font-size: 3.6rem; }
  .meta { grid-template-columns: 1fr; }
  .bar > span { display: none; }
  .bar { justify-content: flex-end; }
}
</style>
