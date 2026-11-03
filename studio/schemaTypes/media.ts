import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'
import {PlayIcon} from '@sanity/icons/Play'

const alt = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description: 'A short description for screen readers, e.g. "Model in a red coat on a rooftop".',
})
const caption = defineField({
  name: 'caption',
  title: 'Caption',
  type: 'string',
  description: 'Optional. Shown under the image on the project page.',
})
const onHome = defineField({
  name: 'onHome',
  title: 'Show on the home globe',
  type: 'boolean',
  initialValue: true,
})

// A still image in a project
export const still = defineType({
  name: 'still',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [alt, caption, onHome],
})

// A video file uploaded straight to Sanity. Best for short clips (under ~30s, under ~50MB).
// Full-length films should go on Vimeo or YouTube and be linked in the project's "Film link".
export const clip = defineType({
  name: 'clip',
  title: 'Video clip',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'video',
      title: 'Video file',
      type: 'file',
      options: {accept: 'video/mp4,video/webm,video/quicktime'},
      description: 'MP4 works everywhere. Keep clips short: they play muted and on loop.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      options: {hotspot: true},
      description: 'Shown before the clip plays, and on the home globe. Use a frame from the clip.',
    }),
    defineField({
      name: 'shape',
      title: 'Shape',
      type: 'string',
      initialValue: '16:9',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Landscape 16:9', value: '16:9'},
          {title: 'Portrait 9:16', value: '9:16'},
          {title: 'Portrait 4:5', value: '4:5'},
          {title: 'Square', value: '1:1'},
        ],
      },
      description: 'Only used when there is no poster image (the poster’s shape wins).',
    }),
    alt,
    caption,
    onHome,
  ],
  preview: {
    select: {title: 'caption', alt: 'alt', media: 'poster', file: 'video.asset.originalFilename'},
    prepare: ({title, alt, media, file}) => ({
      title: title || alt || file || 'Video clip',
      subtitle: 'Video',
      media: media ?? PlayIcon,
    }),
  },
})
