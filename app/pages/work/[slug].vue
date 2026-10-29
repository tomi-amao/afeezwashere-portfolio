<script setup lang="ts">
import { projects, categories, img } from '~/data/site'

const route = useRoute()
const index = projects.findIndex((p) => p.slug === route.params.slug)
if (index < 0) throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
const p = projects[index]!
const next = projects[(index + 1) % projects.length]!
const cats = categories.filter((c) => p.categories.includes(c.slug)).map((c) => c.title)
const playing = ref(false)
const embed = computed(() => p.video?.provider === 'vimeo'
  ? `https://player.vimeo.com/video/${p.video.id}?autoplay=1&title=0&byline=0&portrait=0`
  : p.video ? `https://www.youtube-nocookie.com/embed/${p.video.id}?autoplay=1&rel=0` : '')

const { $lenis } = useNuxtApp()
const toTop = () => ($lenis ? $lenis.scrollTo(0) : scrollTo({ top: 0, behavior: 'smooth' }))

useSeoMeta({ title: `${p.title} — Afeez Was Here`, description: p.body[0], ogImage: img(p.cover) })
</script>

<template>
  <article class="project">
    <div class="player">
      <iframe v-if="playing && embed" :src="embed" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen :title="p.title" />
      <template v-else>
        <img :src="img(p.cover)" :alt="p.title">
        <button class="play label" type="button" :disabled="!embed" @click="playing = true">
          {{ embed ? 'Play film' : 'Film coming soon' }}
        </button>
      </template>
    </div>

    <div class="grid-w head">
      <h1 class="title display">{{ p.title }}</h1>
      <p class="meta grey">{{ [p.client, p.year !== '—' ? p.year : '', p.role].filter(Boolean).join(' · ') }}</p>
    </div>

    <div class="grid-w body">
      <div class="text">
        <p v-for="(para, i) in p.body" :key="i">{{ para }}</p>
      </div>
      <div class="side">
        <p class="mono grey">Category</p>
        <p class="mono">{{ cats.join(', ') }}</p>
        <ul class="credits mono">
          <li v-for="c in p.credits" :key="c.role + c.name">
            <span class="grey">{{ c.role }}</span>
            <a v-if="c.instagram" :href="c.instagram" target="_blank" rel="noopener" class="hover-fade">{{ c.name }}</a>
            <span v-else>{{ c.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid-w stills">
      <img v-for="s in p.stills" :key="s" :src="img(s)" alt="" loading="lazy">
    </div>

    <NuxtLink :to="`/work/${next.slug}`" class="next display">
      <span class="mono grey">Next project</span>
      {{ next.title }} →
    </NuxtLink>

    <footer class="foot label">
      <span>Afeez Was Here®</span>
      <button type="button" class="hover-fade" @click="toTop">Back to top ↑</button>
    </footer>
  </article>
</template>

<style scoped>
.project { position: relative; z-index: 2; background: #fff; min-height: 100vh; padding-top: 5.6rem; }
.player { position: relative; margin-inline: var(--margin); aspect-ratio: 16 / 9; background: #000; overflow: hidden; }
.player img, .player iframe { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border: 0; }
.play {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  color: #fff; border: 1px solid #fff; border-radius: 99rem; padding: 1rem 2rem;
  transition: background var(--dur-normal) var(--ease-alpha), color var(--dur-normal) var(--ease-alpha);
}
.play:not(:disabled):hover { background: #fff; color: #000; }
.play:disabled { cursor: default; opacity: .8; }
.head { margin-top: 4rem; }
.title { grid-column: 1 / span 16; font-size: 9rem; }
.meta { grid-column: 1 / -1; font-size: 3rem; letter-spacing: -0.02em; font-weight: 500; margin-top: 1rem; }
.body { margin-top: 5rem; row-gap: 3rem; }
.text { grid-column: 1 / span 10; display: grid; gap: 1.4rem; font-size: 1.8rem; line-height: 1.35; }
.side { grid-column: 14 / span 11; display: grid; gap: .4rem; align-content: start; }
.credits { margin-top: 2rem; display: grid; gap: .6rem; }
.credits li { display: grid; grid-template-columns: 12rem 1fr; }
.stills { margin-top: 8rem; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; align-items: start; }
.stills img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; }
.next { display: block; padding: 12rem var(--margin) 4rem; font-size: 7rem; transition: opacity var(--dur-normal) var(--ease-alpha); }
.next:hover { opacity: .4; }
.next .mono { display: block; margin-bottom: 1.6rem; letter-spacing: .02em; }
.foot { display: flex; justify-content: space-between; padding: 3rem var(--margin) var(--margin); border-top: 1px solid rgba(0, 0, 0, .1); margin-inline: var(--margin); padding-inline: 0; }
@media (max-width: 767px) {
  .project { padding-top: 5rem; }
  .title { grid-column: 1 / -1; font-size: 5rem; }
  .meta { font-size: 2rem; }
  .text, .side { grid-column: 1 / -1; }
  .stills { grid-template-columns: 1fr; }
  .next { font-size: 4.4rem; }
}
</style>
