// Reads the portfolio content from Sanity and maps it onto the shapes in
// app/data/site.ts. Anything missing in Sanity falls back to that file.
import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { fallbackContent, type Content, type Media, type Project } from '../../app/data/site'

const QUERY = /* groq */ `{
  "settings": *[_id == "settings"][0]{
    heroLines, tagline, showreel, bio, previousClients, email, location, availability, rep, socials[]{label, href},
    portrait{asset, crop, hotspot, alt, "dims": asset->metadata.dimensions}
  },
  "categories": *[_type == "category" && defined(slug.current)] | order(orderRank) { title, "slug": slug.current },
  "projects": *[_type == "project" && defined(slug.current) && defined(cover.asset)] | order(orderRank) {
    title, "slug": slug.current, client, year, role, location, featured, film, description,
    "categories": categories[]->slug.current,
    "loop": hoverLoop.asset->url,
    cover{asset, crop, hotspot, alt, caption, onHome, "dims": asset->metadata.dimensions},
    media[]{
      _type, _key, asset, crop, hotspot, alt, caption, onHome, shape,
      "dims": asset->metadata.dimensions,
      "video": video.asset->url,
      poster{asset, crop, hotspot, "dims": asset->metadata.dimensions}
    },
    credits[]{role, name, instagram}
  }
}`

interface Dims { width: number; height: number }
interface SanityImage { asset?: { _ref: string }; crop?: unknown; hotspot?: unknown; alt?: string; caption?: string; onHome?: boolean; dims?: Dims }
interface SanityMedia extends SanityImage { _type: 'still' | 'clip'; _key: string; shape?: string; video?: string; poster?: SanityImage }
interface SanityProject {
  title: string; slug: string; client?: string; year?: string; role?: string; location?: string; featured?: boolean
  film?: string; description?: string; categories?: (string | null)[]; loop?: string
  cover: SanityImage; media?: SanityMedia[]; credits?: { role: string; name: string; instagram?: string }[]
}
export interface SanityResult {
  settings: null | Partial<{
    heroLines: string[]; tagline: string[]; showreel: string; bio: string; previousClients: string[]; email: string
    location: string; availability: string; rep: { name?: string; email?: string }; socials: { label: string; href: string }[]
    portrait: SanityImage
  }>
  categories: { title: string; slug: string }[]
  projects: SanityProject[]
}

const SHAPES: Record<string, number> = { '16:9': 9 / 16, '9:16': 16 / 9, '4:5': 5 / 4, '1:1': 1 }
const paragraphs = (t?: string) => (t ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
const filled = <T>(v: T | null | undefined, fallback: T): T =>
  v == null || v === '' || (Array.isArray(v) && v.length === 0) ? fallback : v

// Vimeo or YouTube link -> provider + id
export function parseFilm(url?: string): Project['video'] {
  if (!url) return undefined
  const vimeo = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/)
  if (vimeo) return { provider: 'vimeo', id: vimeo[1]! }
  const yt = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)
  if (yt) return { provider: 'youtube', id: yt[1]! }
  return undefined
}

export async function fetchContent(projectId: string, dataset: string): Promise<Content> {
  const client = createClient({ projectId, dataset, apiVersion: '2025-02-19', useCdn: true, maxRetries: 2, timeout: 8000 })
  return mapContent(await client.fetch<SanityResult>(QUERY), projectId, dataset)
}

export function mapContent(res: SanityResult, projectId: string, dataset: string): Content {
  const builder = createImageUrlBuilder({ projectId, dataset })
  const url = (i: SanityImage, w = 2000) => builder.image(i as never).width(w).fit('max').auto('format').quality(80).url()
  const ratio = (d?: Dims, fallback = 1) => (d?.width && d?.height ? d.height / d.width : fallback)

  const toMedia = (m: SanityMedia | SanityImage, defaultAlt: string): Media | null => {
    const alt = m.alt || defaultAlt
    const onHome = m.onHome !== false
    if ('_type' in m && m._type === 'clip') {
      if (!m.video) return null
      const poster = m.poster?.asset ? m.poster : undefined
      return {
        kind: 'video', video: m.video, src: poster ? url(poster) : '', alt, caption: m.caption || undefined, onHome,
        ratio: poster ? ratio(poster.dims) : SHAPES[m.shape ?? '16:9'] ?? 9 / 16,
      }
    }
    if (!m.asset) return null
    return { kind: 'image', src: url(m), ratio: ratio(m.dims), alt, caption: m.caption || undefined, onHome }
  }

  const fb = fallbackContent
  const s = res.settings ?? {}

  const site: Content['site'] = {
    ...fb.site,
    heroLines: filled(s.heroLines, fb.site.heroLines),
    tagline: filled(s.tagline, fb.site.tagline),
    email: filled(s.email, fb.site.email),
    location: filled(s.location, fb.site.location),
    availability: s.availability ?? fb.site.availability,
    rep: s.rep?.name && s.rep?.email ? { name: s.rep.name, email: s.rep.email } : fb.site.rep,
    showreel: parseFilm(s.showreel) ?? fb.site.showreel,
    socials: filled(s.socials, fb.site.socials),
    previousClients: filled(s.previousClients, fb.site.previousClients),
    bio: filled(paragraphs(s.bio), fb.site.bio),
    portrait: (s.portrait?.asset && toMedia(s.portrait, 'Portrait of Afeez Amao')) || fb.site.portrait,
  }

  const projects: Project[] = res.projects.map((p) => {
    const cover = toMedia(p.cover, `${p.title}, cover still`)!
    return {
      slug: p.slug,
      title: p.title,
      client: p.client || p.title,
      year: p.year || '—',
      role: p.role || 'Director',
      location: p.location || 'London',
      featured: !!p.featured,
      categories: (p.categories ?? []).filter((c): c is string => !!c),
      cover,
      stills: (p.media ?? []).map((m) => toMedia(m, m._type === 'clip' ? `${p.title}, clip` : `${p.title}, still`)).filter((m): m is Media => !!m),
      loop: p.loop || undefined,
      video: parseFilm(p.film),
      body: filled(paragraphs(p.description), [`${p.title}. Directed and shot by Afeez Amao.`]),
      credits: filled(p.credits, [{ role: 'Director', name: 'Afeez Amao' }]),
    }
  })

  // Until the first project is published, keep showing the placeholder work
  if (!projects.length) return { ...fb, site, source: 'fallback' }
  return { site, categories: res.categories, projects, source: 'sanity' }
}
