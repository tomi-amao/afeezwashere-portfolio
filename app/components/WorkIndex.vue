<script setup lang="ts">
import type { Project } from '~/data/site'
const props = defineProps<{ category?: string }>()
const { categories, countFor, projects, site } = useContent()
const pad = (n: number) => String(n).padStart(2, '0')
// Featured projects lead and are shown larger
const list = computed(() => (props.category ? projects.filter((p) => p.categories.includes(props.category!)) : projects)
  .slice().sort((a, b) => Number(!!b.featured) - Number(!!a.featured)))
// Same details on every card: client · role · year (client left out when it is the title)
const details = (p: Project) => [p.client !== p.title ? p.client : '', p.role, p.year !== '—' ? p.year : ''].filter(Boolean).join(' · ')
const reel = computed(() => site.showreel?.provider === 'vimeo'
  ? `https://player.vimeo.com/video/${site.showreel.id}?title=0&byline=0&portrait=0`
  : site.showreel ? `https://www.youtube-nocookie.com/embed/${site.showreel.id}?rel=0` : '')
function play(e: Event, on: boolean) {
  const v = (e.currentTarget as HTMLElement).querySelector('video')
  if (!v) return
  if (on) v.play().catch(() => {})
  else { v.pause(); v.currentTime = 0 }
}
</script>

<template>
  <div>
    <h2 class="title display">Work</h2>
    <ul class="filters">
      <li>
        <NuxtLink to="/work" :class="{ off: category }">All<sup>({{ pad(countFor()) }})</sup></NuxtLink>
      </li>
      <li v-for="c in categories" :key="c.slug">
        <NuxtLink :to="`/work/category/${c.slug}`" :class="{ off: category !== c.slug }">
          {{ c.title }}<sup>({{ pad(countFor(c.slug)) }})</sup>
        </NuxtLink>
      </li>
    </ul>
    <div v-if="reel" class="reel">
      <iframe :src="reel" allow="fullscreen; picture-in-picture" allowfullscreen title="Showreel" loading="lazy" />
    </div>
    <ul class="grid">
      <li v-for="p in list" :key="p.slug" :class="{ featured: p.featured && !category }">
        <NuxtLink :to="`/work/${p.slug}`" class="tile" @mouseenter="play($event, true)" @mouseleave="play($event, false)">
          <div class="thumb" :style="{ aspectRatio: p.featured && !category ? '16 / 10' : `1 / ${Math.min(p.cover.ratio, 1.25)}` }">
            <img :src="p.cover.src" :alt="p.cover.alt" loading="lazy">
            <video v-if="p.loop" :src="p.loop" muted loop playsinline preload="none" aria-hidden="true" />
          </div>
          <p class="name">{{ p.title }}</p>
          <p class="grey">{{ details(p) }}</p>
        </NuxtLink>
      </li>
      <li v-if="!list.length" class="empty grey">Nothing here yet.</li>
    </ul>
    <p class="brand label">Afeez Was Here®<br><span class="grey">Film · Direction · Photo</span></p>
  </div>
</template>

<style scoped>
.title { font-size: 14rem; margin-bottom: 3rem; }
.filters { display: flex; flex-wrap: wrap; gap: .4rem 2.4rem; font-size: 2.4rem; font-weight: 500; letter-spacing: -0.02em; margin-bottom: 6rem; }
.filters a { transition: opacity var(--dur-normal) var(--ease-alpha); }
.filters a.off { opacity: .3; }
.filters a:hover { opacity: 1; }
sup { font-size: .45em; margin-left: .15em; letter-spacing: 0; }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5rem 1.6rem; align-items: start; }
.grid { grid-auto-flow: dense; }
.featured { grid-column: span 2; }
.thumb { position: relative; overflow: hidden; background: #f2f2f2; margin-bottom: 1rem; }
.thumb img, .thumb video { width: 100%; height: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease-alpha); }
.thumb video { position: absolute; inset: 0; opacity: 0; transition: opacity var(--dur-normal) var(--ease-alpha); }
.tile:hover video { opacity: 1; }
.tile:hover img { transform: scale(1.03); }
.name { font-weight: 500; }
.featured .name { font-size: 2.4rem; letter-spacing: -0.02em; }
.reel { position: relative; aspect-ratio: 16 / 9; background: #000; margin-bottom: 6rem; }
.reel iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.empty { grid-column: 1 / -1; }
.brand { margin-top: 10rem; }
@media (max-width: 767px) {
  .title { font-size: 8rem; }
  .filters { font-size: 2rem; margin-bottom: 4rem; }
  .grid { grid-template-columns: 1fr; }
  .featured { grid-column: auto; }
}
</style>
