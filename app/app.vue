<script setup lang="ts">
import gsap from 'gsap'
import { globeLayout } from '~/utils/globeLayout'

const { projects, site } = useContent()
const route = useRoute()
const router = useRouter()

// Every image of every project becomes a card on the home globe. Clips show
// their poster and play on hover; clips without a poster stay off the globe.
const globeItems = globeLayout(projects.flatMap((p) =>
  [p.cover, ...p.stills]
    .map((m, i) => ({ m, i }))
    .filter(({ m, i }) => m.src && (i === 0 || m.onHome))
    .map(({ m, i }) => ({
      id: `${p.slug}-${i}`, slug: p.slug, title: p.title, year: p.year,
      src: m.src, ratio: m.ratio, alt: m.alt,
      loop: i === 0 ? p.loop : m.video,
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
      <GlobeCarousel :items="globeItems" :active="!isProject" @ready="onReady" />
      <HeroWordmark :lines="site.heroLines" />
      <ClientStrip />
      <SidePanel :open="workOpen" peek="Work →" open-to="/work" label="Work">
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
