import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Served under the site's /studio path rather than a *.sanity.studio host.
  // Set it only here: a basePath in sanity.config.ts would stack on top (/studio/studio)
  project: {basePath: '/studio'},
})
