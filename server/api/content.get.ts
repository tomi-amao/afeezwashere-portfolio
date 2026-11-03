// All site content in one payload. Cached for a minute, so edits published in
// the Studio show up on the site within about a minute, with no redeploy.
import { fallbackContent } from '../../app/data/site'

export default defineCachedEventHandler(async () => {
  const { sanity } = useRuntimeConfig()
  if (!sanity.projectId) return fallbackContent
  try {
    return await fetchContent(sanity.projectId, sanity.dataset || 'production')
  } catch (err) {
    console.error('[content] Sanity fetch failed, using fallback content:', err)
    return fallbackContent
  }
}, { name: 'content', maxAge: 60, swr: true, getKey: () => 'all' })
