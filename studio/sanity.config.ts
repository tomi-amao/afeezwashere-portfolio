import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {CogIcon} from '@sanity/icons/Cog'
import {DocumentVideoIcon} from '@sanity/icons/DocumentVideo'
import {TagIcon} from '@sanity/icons/Tag'
import {schemaTypes} from './schemaTypes'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'missing-project-id'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const SINGLETONS = new Set(['settings'])

export default defineConfig({
  name: 'afeezwashere',
  title: 'Afeez Was Here',
  projectId,
  dataset,
  // The Studio is served by the site itself at /studio
  basePath: '/studio',
  plugins: [
    structureTool({
      title: 'Content',
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({type: 'project', title: 'Projects (drag to reorder)', icon: DocumentVideoIcon, S, context}),
            orderableDocumentListDeskItem({type: 'category', title: 'Categories (drag to reorder)', icon: TagIcon, S, context}),
            S.divider(),
            S.listItem()
              .title('Site settings')
              .icon(CogIcon)
              .child(S.document().schemaType('settings').documentId('settings').title('Site settings')),
          ]),
    }),
    visionTool({defaultApiVersion: '2025-02-19'}),
  ],
  schema: {
    types: schemaTypes,
    // Settings is a single document: hide it from "Create new"
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.has(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
