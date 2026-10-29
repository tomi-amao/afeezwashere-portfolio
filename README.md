# afeezwashere

Design portfolio for Afeez, modelled on the General Admission site: an infinite, drifting, draggable image canvas with a blend-mode wordmark, faint "ghost" type behind it, and slide-in panels for Work and Who's Afeez?

Built with Nuxt, Lenis and GSAP. Deployed on Vercel; every push to `main` goes to production.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Where things live

- `app/data/site.ts` holds all content: projects, categories, bio, clients, contact. It stands in for the Sanity CMS from the build plan and uses the same shapes.
- `public/placeholders/` has generated placeholder images. Swap them for real stills, then point each project's `cover` and `stills` at them.
- `app/components/InfiniteCanvas.vue` is the home canvas (drift, drag with inertia, wheel, wrap, culling, hover labels).
- Routes: `/` home, `/work` and `/work/category/:slug` open the Work panel, `/about` opens Who's Afeez?, `/work/:slug` is a project page, `?contact=1` opens the contact overlay on any page.

## Adding a film

Set `video: { provider: 'vimeo', id: '123456789' }` on a project in `app/data/site.ts`. The project page then shows a Play button that loads the player.

## Fonts

Inter Tight and JetBrains Mono (Google Fonts) stand in for ABC Monument Grotesk and ABC Diatype Mono. Swap them in `nuxt.config.ts` and `app/assets/css/main.css` if you buy the Dinamo licences.
