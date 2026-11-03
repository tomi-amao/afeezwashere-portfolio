// Loads the site content once on the server and hands it to the browser in the
// page payload, so every component can read it synchronously via useContent().
import type { Content } from '~/data/site'

export default defineNuxtPlugin(async () => {
  const content = useState<Content | null>('content', () => null)
  if (!content.value) content.value = await $fetch<Content>('/api/content')
})
