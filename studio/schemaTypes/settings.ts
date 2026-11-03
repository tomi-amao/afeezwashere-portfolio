import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const settings = defineType({
  name: 'settings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'home', title: 'Home', default: true},
    {name: 'about', title: 'About'},
    {name: 'contact', title: 'Contact'},
  ],
  fields: [
    defineField({
      name: 'heroLines',
      title: 'Wordmark lines',
      type: 'array',
      group: 'home',
      of: [defineArrayMember({type: 'string'})],
      description: 'The big lines on the home page, top to bottom.',
    }),
    defineField({
      name: 'tagline',
      title: 'Background phrase',
      type: 'array',
      group: 'home',
      of: [defineArrayMember({type: 'string'})],
      validation: (r) => r.max(2),
      description: 'Two short lines repeated faintly behind the globe.',
    }),
    defineField({
      name: 'showreel',
      title: 'Showreel link (Vimeo or YouTube)',
      type: 'url',
      group: 'home',
      description: 'Optional. Shown at the top of the Work panel.',
    }),

    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 6, group: 'about', description: 'Leave a blank line between paragraphs.'}),
    defineField({
      name: 'portrait',
      title: 'Portrait',
      type: 'image',
      group: 'about',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'previousClients',
      title: 'Previous clients',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),

    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact'}),
    defineField({name: 'location', title: 'Based in', type: 'string', group: 'contact'}),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      group: 'contact',
      description: 'Optional, e.g. "Booking Q1 2027".',
    }),
    defineField({
      name: 'rep',
      title: 'Representation',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({name: 'name', title: 'Agency / rep', type: 'string'}),
        defineField({name: 'email', title: 'Email', type: 'string'}),
      ],
    }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'href', title: 'Link', type: 'url', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
