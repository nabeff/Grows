import type { Block } from 'payload'

export const MarqueeImagesBlock: Block = {
  slug: 'marqueeImages',
  interfaceName: 'MarqueeImagesBlock',
  fields: [
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
    },
  ],
  labels: {
    singular: 'Marquee Images',
    plural: 'Marquee Images',
  },
}
