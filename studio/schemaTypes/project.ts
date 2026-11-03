import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentVideoIcon} from '@sanity/icons/DocumentVideo'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

const filmUrl = /^(https?:\/\/)?(www\.)?(vimeo\.com|player\.vimeo\.com|youtube\.com|youtu\.be|youtube-nocookie\.com)\//i

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentVideoIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'media', title: 'Media', default: true},
    {name: 'details', title: 'Details'},
    {name: 'writeup', title: 'Write-up & credits'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: ['media', 'details'], validation: (r) => r.required()}),

    // Media
    defineField({
      name: 'cover',
      title: 'Cover image',
      type: 'still',
      group: 'media',
      description: 'The main image: used in the Work grid, at the top of the project page and on the home globe.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'media',
      title: 'Images and clips',
      type: 'array',
      group: 'media',
      description: 'Drag to reorder. Drop several images at once onto this box to upload them together.',
      of: [defineArrayMember({type: 'still'}), defineArrayMember({type: 'clip'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'film',
      title: 'Film link (Vimeo or YouTube)',
      type: 'url',
      group: 'media',
      description: 'Paste the link to the full film, e.g. https://vimeo.com/123456789. Adds a "Play film" button.',
      validation: (r) =>
        r.custom((v?: string) => !v || filmUrl.test(v) || 'Use a vimeo.com or youtube.com link'),
    }),
    defineField({
      name: 'hoverLoop',
      title: 'Hover loop',
      type: 'file',
      group: 'media',
      options: {accept: 'video/mp4,video/webm'},
      description: 'Optional. A few seconds of muted MP4 that plays when someone hovers the cover.',
    }),

    // Details
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'details',
      options: {source: 'title'},
      description: 'Click "Generate". The project lives at /work/<this>. Avoid changing it once shared.',
      validation: (r) => r.required(),
    }),
    defineField({name: 'client', title: 'Client', type: 'string', group: 'details'}),
    defineField({name: 'year', title: 'Year', type: 'string', group: 'details'}),
    defineField({name: 'role', title: 'Role', type: 'string', group: 'details', initialValue: 'Director'}),
    defineField({name: 'location', title: 'Shot in', type: 'string', group: 'details', initialValue: 'London'}),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'details',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'details',
      initialValue: false,
      description: 'Featured projects lead the Work grid and are shown larger.',
    }),

    // Write-up
    defineField({
      name: 'description',
      title: 'Write-up',
      type: 'text',
      rows: 6,
      group: 'writeup',
      description: 'Leave a blank line between paragraphs.',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      group: 'writeup',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'credit',
          fields: [
            defineField({name: 'role', title: 'Role', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'instagram', title: 'Instagram link', type: 'url'}),
          ],
          preview: {select: {title: 'name', subtitle: 'role'}},
        }),
      ],
    }),

    orderRankField({type: 'project'}),
  ],
  preview: {
    select: {title: 'title', client: 'client', year: 'year', media: 'cover'},
    prepare: ({title, client, year, media}) => ({
      title,
      subtitle: [client, year].filter(Boolean).join(' · '),
      media,
    }),
  },
})
