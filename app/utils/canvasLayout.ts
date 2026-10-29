// Deterministic scatter so the canvas looks the same on every load.
// Positions are fractions of the tile, so the tile can be resized to fit any screen.
export const SIZES = { xs: 5, s: 8.5, m: 12.5, l: 17, xl: 26 } as const // rem widths seen on GA
export type CanvasSize = keyof typeof SIZES

export interface CanvasItem {
  id: string
  slug: string
  title: string
  year: string
  src: string
  ratio: number
  w: number
  fx: number
  fy: number
  z: number
}

export function layout<T extends { canvasSize: CanvasSize }>(items: T[], seed = 7) {
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const cols = 8, rows = Math.ceil(items.length / cols) || 1
  // Shuffle grid cells so one project's images don't sit in a row
  const cells = items.map((_, i) => i).sort(() => rnd() - 0.5)
  return items.map((it, i) => {
    const cell = cells[i]!
    const c = cell % cols, r = Math.floor(cell / cols)
    return {
      ...it,
      w: SIZES[it.canvasSize],
      fx: (c + rnd() * 0.55) / cols,
      fy: (r + rnd() * 0.55) / rows,
      z: Math.floor(rnd() * 3),
    }
  })
}

// Shared with the ghost-type layer for parallax
export const canvasOffset = { x: 0, y: 0 }
