import type { Block } from 'payload'

export const HeroImageTitleBlock: Block = {
  slug: 'heroImageTitle',
  interfaceName: 'HeroImageTitleBlock',
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Image',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title (bottom text)',
    },
     {
      name: 'title2',
      type: 'text',
      required: true,
      label: 'Title2 (bottom text)',
    },
  ],
  labels: {
    singular: 'Hero Image + Bottom Title',
    plural: 'Hero Image + Bottom Titles',
  },
}
