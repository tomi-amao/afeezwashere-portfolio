import Lenis from 'lenis'
import gsap from 'gsap'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return { provide: { lenis } }
})
