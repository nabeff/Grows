import type { Block } from 'payload'

export const TextMarquee: Block = {
  slug: 'textMarquee',
  interfaceName: 'TextMarqueeBlock',
  labels: {
    singular: 'Logos Marquee',
    plural: 'Logos Marquees',
  },
  fields: [
    {
      name: 'logos',
      type: 'array',
      required: true,
      minRows: 4,
      label: 'Logos',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo Image',
        },
      ],
    },
    {
      name: 'speedSeconds',
      type: 'number',
      required: false,
      defaultValue: 28,
      label: 'Speed (seconds per loop)',
      admin: {
        description: 'Lower = faster. Example: 20 is faster than 35.',
      },
    },
  ],
}
