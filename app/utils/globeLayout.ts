// Places media on latitude rings around a sphere, like the bands of a globe.
// Each ring gets a share of the items in proportion to its circumference,
// and alternate rings are offset by half a step so the cards interlock.
export interface GlobeItem {
  id: string
  slug: string
  title: string
  year: string
  src: string
  ratio: number // height / width
  alt: string
  loop?: string // muted mp4 played while hovered
  lat: number   // degrees, + is up
  lon: number   // degrees
}

export function globeLayout<T extends Omit<GlobeItem, 'lat' | 'lon'>>(items: T[], rings = 5, maxLat = 56): (T & { lat: number; lon: number })[] {
  const lats = Array.from({ length: rings }, (_, i) => rings === 1 ? 0 : -maxLat + (2 * maxLat * i) / (rings - 1))
  const weights = lats.map((l) => Math.cos((l * Math.PI) / 180))
  const total = weights.reduce((a, b) => a + b, 0)

  // Largest-remainder split so the counts add up to items.length exactly
  const raw = weights.map((w) => (w / total) * items.length)
  const counts = raw.map(Math.floor)
  let left = items.length - counts.reduce((a, b) => a + b, 0)
  raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => { if (left-- > 0) counts[i]!++ })

  // Deal items round the rings so one project's images spread over the globe
  const order = [...items.keys()].sort((a, b) => ((a * 7919) % 97) - ((b * 7919) % 97))
  const out: (T & { lat: number; lon: number })[] = []
  let k = 0
  lats.forEach((lat, r) => {
    const n = counts[r]!
    for (let j = 0; j < n; j++) {
      const it = items[order[k++]!]!
      out.push({ ...it, lat, lon: (360 * (j + (r % 2 ? 0.5 : 0))) / n })
    }
  })
  return out
}
