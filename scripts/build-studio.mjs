// Builds the Sanity Studio into public/studio so the site serves it at /studio.
// Skipped (with a note) until SANITY_PROJECT_ID is set, so the site still builds
// before Sanity is connected.
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const shell = 'server/assets/studio.html' // copy of the Studio's index.html for deep links

rmSync('public/studio', { recursive: true, force: true })
rmSync(shell, { force: true })

if (!projectId) {
  console.log('[studio] SANITY_PROJECT_ID is not set: skipping the Studio build. The site will use app/data/site.ts.')
  process.exit(0)
}

const run = (cmd) => execSync(cmd, {
  stdio: 'inherit',
  cwd: 'studio',
  env: { ...process.env, SANITY_STUDIO_PROJECT_ID: projectId, SANITY_STUDIO_DATASET: dataset, SANITY_TELEMETRY_DISABLED: '1' },
})
if (!existsSync('studio/node_modules/.bin/sanity')) run('npm ci --no-audit --no-fund')
run('npx sanity build ../public/studio -y')
mkdirSync('server/assets', { recursive: true })
copyFileSync('public/studio/index.html', shell)
console.log(`[studio] Built for project ${projectId} (${dataset}); served at /studio`)
