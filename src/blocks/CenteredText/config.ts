import type { Block } from 'payload'

export const CenteredText: Block = {
  slug: 'centeredText',
  interfaceName: 'CenteredTextBlock',
  labels: {
    singular: 'Centered Text',
    plural: 'Centered Text Blocks',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Text',
    },
  ],
}
