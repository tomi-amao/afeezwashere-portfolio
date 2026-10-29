<script setup lang="ts">
import gsap from 'gsap'
import { projects, site, img, PLACEHOLDER_RATIOS } from '~/data/site'
import { layout } from '~/utils/canvasLayout'

const route = useRoute()
const router = useRouter()

// Every image of every project becomes a tile on the home canvas
const canvasItems = layout(projects.flatMap((p) =>
  [p.cover, ...p.stills].map((n, i) => ({
    id: `${p.slug}-${n}`, slug: p.slug, title: p.title, year: p.year,
    src: img(n), ratio: PLACEHOLDER_RATIOS[n]!, canvasSize: p.canvasSizes[i] ?? 's',
  })),
))

const isProject = computed(() => route.name === 'work-slug')
const workOpen = computed(() => route.name === 'work' || route.name === 'work-category-slug')
const aboutOpen = computed(() => route.name === 'about')
const contactOpen = computed(() => route.query.contact === '1')
const category = computed(() => route.name === 'work-category-slug' ? String(route.params.slug) : undefined)

function closeContact() {
  const { contact: _, ...query } = route.query
  router.push({ path: route.path, query })
}

const loaded = ref(false)
function onReady() {
  if (loaded.value) return
  loaded.value = true
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.from('.hero-line', { yPercent: 100, duration: 1.1, ease: 'power3.out', stagger: 0.08, delay: 0.35 })
}

function onKey(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (contactOpen.value) closeContact()
  else if (workOpen.value || aboutOpen.value) router.push('/')
}
onMounted(() => {
  addEventListener('keydown', onKey)
  if (isProject.value) onReady() // the canvas is hidden, so don't wait on its images
})
onBeforeUnmount(() => removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <div v-show="!isProject">
      <GhostType :active="!isProject" />
      <InfiniteCanvas :items="canvasItems" :active="!isProject" @ready="onReady" />
      <HeroWordmark :lines="site.heroLines" />
      <SidePanel :open="workOpen" peek="W" open-to="/work" label="Work">
        <WorkIndex :category="category" />
      </SidePanel>
      <SidePanel :open="aboutOpen" label="Who's Afeez?">
        <AboutPanel />
      </SidePanel>
    </div>
    <SiteHeader :project="isProject" />
    <NuxtPage />
    <ContactOverlay :open="contactOpen" @close="closeContact" />
    <SiteLoader :done="loaded" />
  </div>
</template>
