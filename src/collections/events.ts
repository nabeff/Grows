import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'location', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' }, // keeps it “day based”
      },
    },

    // location shown bottom-right: "Zurich, Switzerland"
    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Displayed as “City, Country” on the card bottom-right.',
      },
    },

    // whole card clickable
    {
      name: 'link',
      type: 'group',
      label: 'Link',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Internal', value: 'reference' },
            { label: 'External', value: 'custom' },
          ],
          defaultValue: 'custom',
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages'], // add other collections if needed
          required: false,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'reference',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: false,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'custom',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: false,
          localized: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },

    slugField(),
  ],
  timestamps: true,
}

export default Events
