import type { Block } from 'payload'
import { link } from '@/fields/link'

export const ServicesHoverList: Block = {
  slug: 'servicesHoverList',
  interfaceName: 'ServicesHoverListBlock',
  labels: {
    singular: 'Services Hover List',
    plural: 'Services Hover Lists',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro text',
    },
    {
      name: 'minHeight',
      type: 'number',
      defaultValue: 520,
      label: 'List min-height (px)',
      admin: {
        description: 'Keeps the section stable while hovering',
      },
    },
    {
      name: 'services',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Service name (big list text)',
        },
        {
          name: 'eyebrow',
          type: 'text',
          label: 'Small label (ex: For Distributors)',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        link({
          overrides: {
            label: 'Button link',
          },
        }),
      ],
    },
  ],
}
