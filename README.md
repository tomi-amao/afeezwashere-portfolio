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

- Content comes from **Sanity** when `SANITY_PROJECT_ID` is set (see below). `app/data/site.ts` is the fallback: it is used until Sanity is connected, until the first project is published, and for any Settings field left empty.
- `public/placeholders/` has generated placeholder images used by the fallback content.
- `app/components/InfiniteCanvas.vue` is the home canvas (drift, drag with inertia, wheel, wrap, culling, hover labels).
- Routes: `/` home, `/work` and `/work/category/:slug` open the Work panel, `/about` opens Who's Afeez?, `/work/:slug` is a project page, `?contact=1` opens the contact overlay on any page.

## Content editing (Sanity)

The Sanity Studio is built into the site and lives at **/studio** (e.g. https://afeezwashere.vercel.app/studio). Editors sign in there with their Sanity account.

- **Projects (drag to reorder)**: each project has a cover image, a grid of images and video clips (drag to reorder, drop many files at once), an optional Vimeo/YouTube film link, an optional hover loop, details, write-up and credits.
- **Categories (drag to reorder)**: the Work panel filters.
- **Site settings**: wordmark lines, background phrase, showreel, bio, portrait, previous clients, contact details and socials.

Published changes show on the site within about a minute. No redeploy is needed. Changing the schema (fields) in `studio/schemaTypes` does need a deploy.

Long films belong on Vimeo or YouTube (paste the link into "Film link"). Upload only short clips and loops to Sanity, since video bandwidth counts against the Sanity plan.

### Environment variables (Vercel)

| Name | Value |
| --- | --- |
| `SANITY_PROJECT_ID` | The project ID from sanity.io/manage |
| `SANITY_DATASET` | Optional, defaults to `production` |

The dataset must be **public** (the default), so the site can read published content without a token. The Studio's origin (e.g. `https://afeezwashere.vercel.app`) must be added under API → CORS origins with credentials allowed.

### How it fits together

- `studio/` is the Studio (its own `package.json`). `npm run build` builds it into `public/studio` via `scripts/build-studio.mjs`, skipping it when `SANITY_PROJECT_ID` is unset. `server/routes/studio` serves its `index.html` for deep links.
- `server/api/content.get.ts` fetches everything in one GROQ query (`server/utils/sanity.ts`), maps it onto the shapes in `app/data/site.ts` and caches it for 60 seconds. If Sanity can't be reached it serves the fallback content.
- `app/plugins/content.ts` loads that once per page load; components read it with `useContent()`.
- `cd studio && npx sanity login && SANITY_STUDIO_PROJECT_ID=<id> npm run seed` imports the placeholder categories, projects (with images) and settings from `app/data/site.ts` into Sanity. It skips anything that already exists, so it's safe to re-run.
- Run the Studio locally with `SANITY_STUDIO_PROJECT_ID=<id> npm run studio` (http://localhost:3333/studio). Add `http://localhost:3333` as a CORS origin first.

## Fonts

Inter Tight and JetBrains Mono (Google Fonts) stand in for ABC Monument Grotesk and ABC Diatype Mono. Swap them in `nuxt.config.ts` and `app/assets/css/main.css` if you buy the Dinamo licences.
