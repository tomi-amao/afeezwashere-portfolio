// The Studio is a single-page app: any /studio/* address that isn't a real file
// (e.g. /studio/structure/project) gets its index.html. Its JS and CSS under
// /studio/static are plain files served straight from public/.
export default defineEventHandler(async (event) => {
  const html = await useStorage('assets:server').getItem<string>('studio.html')
  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  setHeader(event, 'cache-control', 'no-cache')
  if (html) return html
  setResponseStatus(event, 404)
  return '<!doctype html><meta charset="utf-8"><title>Studio not set up</title><body style="font:16px system-ui;padding:3rem;max-width:40rem">'
    + '<h1>The Studio isn’t set up yet</h1><p>Add <code>SANITY_PROJECT_ID</code> to the Vercel project’s environment variables and redeploy. See the README.</p>'
})
