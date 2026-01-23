// src/blocks/TreatmentsAccordion/config.ts
import type { Block } from 'payload'

export const TreatmentsAccordion: Block = {
  slug: 'treatmentsAccordion',
  interfaceName: 'TreatmentsAccordionBlock',
  labels: {
    singular: 'Treatments Accordion',
    plural: 'Treatments Accordions',
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
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
