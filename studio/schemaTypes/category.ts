import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({name: 'title', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: {source: 'title'},
      description: 'Click "Generate". The category lives at /work/category/<this>.',
      validation: (r) => r.required(),
    }),
    orderRankField({type: 'category'}),
  ],
})
