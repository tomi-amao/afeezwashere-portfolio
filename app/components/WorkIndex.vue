<script setup lang="ts">
import { categories, countFor, projects, img, PLACEHOLDER_RATIOS } from '~/data/site'
const props = defineProps<{ category?: string }>()
const pad = (n: number) => String(n).padStart(2, '0')
const list = computed(() => props.category ? projects.filter((p) => p.categories.includes(props.category!)) : projects)
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
    <ul class="grid">
      <li v-for="p in list" :key="p.slug">
        <NuxtLink :to="`/work/${p.slug}`" class="tile">
          <div class="thumb">
            <img :src="img(p.cover)" :alt="p.title" loading="lazy" :style="{ aspectRatio: `1 / ${Math.min(PLACEHOLDER_RATIOS[p.cover]!, 1.25)}` }">
          </div>
          <p class="row"><span>{{ p.title }}</span><span v-if="p.year !== '—'" class="grey">{{ p.year }}</span></p>
          <p class="grey">{{ p.client }}</p>
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
.thumb { overflow: hidden; background: #f2f2f2; margin-bottom: 1rem; }
.thumb img { width: 100%; object-fit: cover; transition: transform var(--dur-slow) var(--ease-alpha); }
.tile:hover img { transform: scale(1.03); }
.row { display: flex; justify-content: space-between; gap: 1rem; font-weight: 500; }
.empty { grid-column: 1 / -1; }
.brand { margin-top: 10rem; }
@media (max-width: 767px) {
  .title { font-size: 8rem; }
  .filters { font-size: 2rem; margin-bottom: 4rem; }
  .grid { grid-template-columns: 1fr; }
}
</style>
