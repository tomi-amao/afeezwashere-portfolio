// Site content. Placeholder images live in /public/placeholders until the real
// stills and films are added. This file is the stand-in for the Sanity CMS
// described in the build plan: the shapes match its schemas.
import type { CanvasSize } from '~/utils/canvasLayout'

export interface Category { title: string; slug: string }
export interface Credit { role: string; name: string; instagram?: string }
export interface Project {
  slug: string
  title: string
  client: string
  year: string
  role: string
  categories: string[]
  cover: number          // placeholder image number
  stills: number[]
  canvasSizes: CanvasSize[] // one per image (cover first) on the home canvas
  video?: { provider: 'vimeo' | 'youtube'; id: string }
  loop?: string          // short muted mp4 that plays on hover (globe card + Work grid)
  featured?: boolean     // shown larger in the Work grid
  location: string       // for the "Afeez was here — London, 2024" stamp
  body: string[]
  credits: Credit[]
}

export const PLACEHOLDER_RATIOS: Record<number, number> = {1: 0.428, 2: 0.428, 3: 1.250, 4: 1.250, 5: 0.562, 6: 0.562, 7: 0.562, 8: 1.250, 9: 1.000, 10: 1.000, 11: 1.250, 12: 1.250, 13: 0.428, 14: 0.562, 15: 1.250, 16: 0.666, 17: 0.428, 18: 0.666, 19: 0.666, 20: 1.250, 21: 0.562, 22: 1.250, 23: 0.562, 24: 1.250, 25: 0.562, 26: 0.562, 27: 1.250, 28: 0.666, 29: 1.250, 30: 1.500, 31: 1.500, 32: 1.000, 33: 0.428, 34: 0.562, 35: 0.562, 36: 1.000, 37: 0.428, 38: 1.250, 39: 0.666, 40: 1.250}
// Alt text for a project image until real descriptions are written
export const altFor = (p: Pick<Project, 'title' | 'client' | 'cover'>, n: number) =>
  n === p.cover ? `${p.title}, cover still` : `${p.title}, still`
export const img = (n: number) => `/placeholders/p${String(n).padStart(2, '0')}.jpg`

export const site = {
  name: 'Afeez Was Here',
  heroLines: ['Afeez Was Here®', 'London — Amsterdam', 'Film · Direction · Photo'],
  tagline: ['Moving image', 'For the culture'],
  email: 'hello@afeezwashere.com',
  location: 'London & Amsterdam',
  // Shown in the contact overlay when set, e.g. 'Booking Q1 2027'
  availability: '',
  // Agency or rep, shown in the contact overlay when set
  rep: undefined as { name: string; email: string } | undefined,
  // 30–60s showreel at the top of the Work panel when set
  showreel: undefined as { provider: 'vimeo' | 'youtube'; id: string } | undefined,
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Vimeo', href: 'https://vimeo.com/' },
  ],
  previousClients: [
    'Nike', 'HYPEBEAST', 'Footlocker', 'Adidas Originals', 'Off-White', 'Daily Paper', 'Ganni',
    'Filling Pieces', 'Dreamville', 'G-Shock', 'Selfridges', 'AWGE', 'Tommy Hilfiger', 'Jordan Brand', 'Loewe',
  ],
  bio: [
    'Afeez Amao is a multidisciplinary creative based between London and Amsterdam, working across film, direction and photography.',
    'He directs and shoots for brands, musicians and athletes, from Daily Paper campaigns and Jordan Brand at Quai 54 to Davido at the O2.',
  ],
}

export const categories: Category[] = [
  { title: 'Film', slug: 'film' },
  { title: 'Brand', slug: 'brand' },
  { title: 'Music', slug: 'music' },
  { title: 'Photography', slug: 'photography' },
]

// Short neutral write-up until the real ones are written
const bodyFor = (s: Seed) => [`${s.title}${s.client !== s.title ? ` for ${s.client}` : ''}. Directed and shot by Afeez Amao.`]
const credits: Credit[] = [{ role: 'Director', name: 'Afeez Amao' }]

type Seed = Pick<Project, 'slug' | 'title' | 'client' | 'year' | 'categories' | 'featured'>
const seeds: Seed[] = [
  { slug: 'hypebeast-diaries-bianca-saunders', title: 'Hypebeast Diaries: Bianca Saunders', client: 'HYPEBEAST', year: '—', categories: ['film'] },
  { slug: 'daily-paper-ss24', title: "Daily Paper SS'24", client: 'Daily Paper', year: '2024', categories: ['brand', 'film'] },
  { slug: 'daily-paper-ss23', title: "Daily Paper SS'23", client: 'Daily Paper', year: '2023', categories: ['brand', 'film'] },
  { slug: 'daily-paper-fw22', title: "Daily Paper FW'22", client: 'Daily Paper', year: '2022', categories: ['brand', 'film'] },
  { slug: 'tycoone-davido-o2-arena', title: 'Tycoone / Davido O2 Arena', client: 'Tycoone', year: '—', categories: ['music', 'film'], featured: true },
  { slug: 'filling-pieces-x-daily-paper', title: 'Filling Pieces × Daily Paper', client: 'Filling Pieces', year: '—', categories: ['brand'] },
  { slug: 'ramla-ali', title: 'Ramla Ali', client: 'Ramla Ali', year: '—', categories: ['film', 'photography'] },
  { slug: 'loewe-x-on', title: 'Loewe × On', client: 'Loewe', year: '—', categories: ['brand', 'film', 'photography'], featured: true },
  { slug: 'g-shock-x-daily-paper', title: 'G-Shock × Daily Paper', client: 'G-Shock', year: '—', categories: ['brand'] },
  { slug: 'footlocker-x-jordan-quai-54', title: 'Footlocker × Jordan Quai 54', client: 'Footlocker', year: '—', categories: ['film'], featured: true },
]

// A few large anchors, many small images, like the GA canvas
const sizeCycle: CanvasSize[][] = [
  ['xl', 's', 'xs', 'm'], ['l', 'm', 's', 'xs'], ['m', 's', 'l', 's'], ['xl', 'xs', 'm', 's'],
  ['l', 's', 'm', 'xs'], ['m', 'l', 's', 's'], ['xl', 'm', 'xs', 's'], ['l', 's', 's', 'm'],
  ['m', 'xs', 'l', 's'], ['xl', 's', 'm', 'xs'],
]

export const projects: Project[] = seeds.map((s, i) => ({
  ...s,
  role: 'Director',
  cover: i * 4 + 1,
  stills: [i * 4 + 2, i * 4 + 3, i * 4 + 4],
  canvasSizes: sizeCycle[i]!,
  location: 'London',
  body: bodyFor(s),
  credits,
}))

export const countFor = (slug?: string) =>
  slug ? projects.filter((p) => p.categories.includes(slug)).length : projects.length
