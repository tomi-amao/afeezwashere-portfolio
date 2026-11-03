export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  // Set SANITY_PROJECT_ID (and optionally SANITY_DATASET) in Vercel to read
  // content from Sanity. Without it the site uses app/data/site.ts.
  runtimeConfig: {
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID || '',
      dataset: process.env.SANITY_DATASET || 'production',
    },
  },
  routeRules: {
    '/studio/**': { headers: { 'x-robots-tag': 'noindex' } },
  },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'fade', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Afeez Was Here',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Afeez Amao — film, direction and photography. London / Amsterdam.' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Free stand-ins for ABC Monument Grotesk and ABC Diatype Mono (see README)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap' },
      ],
    },
  },
})
