// Imports the placeholder content from app/data/site.ts into Sanity:
// 4 categories, 10 projects (with their placeholder images) and Site settings.
// Safe to re-run: anything that already exists (matched by web address) is left alone.
//
//   cd studio && npm install
//   npx sanity login                      # once
//   SANITY_STUDIO_PROJECT_ID=ibi7qe65 npx sanity exec scripts/seed.ts --with-user-token
import {createReadStream} from 'node:fs'
import {basename, resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'
import {fallbackContent, type Media} from '../../app/data/site'

const client = getCliClient({apiVersion: '2025-02-19'})
const publicDir = resolve(process.cwd(), '../public')
const key = () => Math.random().toString(36).slice(2, 12)
// Increasing ranks in the format @sanity/orderable-document-list expects
const rank = (i: number) => `0|${(i + 1).toString(36).padStart(6, '0')}:`

const uploaded = new Map<string, string>()
async function upload(src: string) {
  if (!uploaded.has(src)) {
    const asset = await client.assets.upload('image', createReadStream(resolve(publicDir, `.${src}`)), {filename: basename(src)})
    uploaded.set(src, asset._id)
  }
  return {_type: 'image', asset: {_type: 'reference', _ref: uploaded.get(src)!}}
}
const still = async (m: Media, withKey = false) => ({
  ...(withKey ? {_key: key()} : {}),
  ...(await upload(m.src)),
  _type: 'still',
  alt: m.alt,
  ...(m.caption ? {caption: m.caption} : {}),
  onHome: m.onHome,
})

async function existingIds(type: string) {
  const rows = await client.fetch<{_id: string; slug: string}[]>(
    `*[_type == $type && !(_id in path("drafts.**"))]{_id, "slug": slug.current}`,
    {type},
  )
  return new Map(rows.map((r) => [r.slug?.replace(/^\/+|\/+$/g, ''), r._id]))
}

async function main() {
  const {site, categories, projects} = fallbackContent
  console.log(`Importing into project ${client.config().projectId} / ${client.config().dataset}`)

  const cats = await existingIds('category')
  for (const [i, c] of categories.entries()) {
    if (cats.has(c.slug)) { console.log(`= category ${c.title} (exists)`); continue }
    const _id = `category-${c.slug}`
    await client.createIfNotExists({_id, _type: 'category', title: c.title, slug: {_type: 'slug', current: c.slug}, orderRank: rank(i)})
    cats.set(c.slug, _id)
    console.log(`+ category ${c.title}`)
  }

  const existing = await existingIds('project')
  for (const [i, p] of projects.entries()) {
    if (existing.has(p.slug)) { console.log(`= project ${p.title} (exists)`); continue }
    await client.createIfNotExists({
      _id: `project-${p.slug}`,
      _type: 'project',
      title: p.title,
      slug: {_type: 'slug', current: p.slug},
      client: p.client,
      year: p.year === '—' ? undefined : p.year,
      role: p.role,
      location: p.location,
      featured: !!p.featured,
      categories: p.categories.filter((s) => cats.has(s)).map((s) => ({_key: key(), _type: 'reference', _ref: cats.get(s)!})),
      cover: await still(p.cover),
      media: await Promise.all(p.stills.map((m) => still(m, true))),
      description: p.body.join('\n\n'),
      credits: p.credits.map((c) => ({_key: key(), _type: 'credit', ...c})),
      orderRank: rank(i),
    })
    console.log(`+ project ${p.title}`)
  }

  await client.createIfNotExists({
    _id: 'settings',
    _type: 'settings',
    heroLines: site.heroLines,
    tagline: site.tagline,
    bio: site.bio.join('\n\n'),
    portrait: {...(await upload(site.portrait.src)), alt: site.portrait.alt},
    previousClients: site.previousClients,
    email: site.email,
    location: site.location,
    socials: site.socials.map((s) => ({_key: key(), _type: 'social', ...s})),
  })
  console.log('= Site settings (created if missing)')
  console.log('Done. Changes show on the site within about a minute.')
}

main().catch((err) => { console.error(err); process.exit(1) })
