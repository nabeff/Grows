// src/blocks/AboutSplit/config.ts
import type { Block } from 'payload'

export const AboutSplit: Block = {
  slug: 'aboutSplit',
  interfaceName: 'AboutSplitBlock',
  labels: {
    singular: 'About Split',
    plural: 'About Splits',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Use line breaks to create separate paragraphs.',
        rows: 8,
      },
    },
  ],
}
