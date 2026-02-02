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
        date: { pickerAppearance: 'dayOnly' },
      },
    },

    {
      name: 'location',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Displayed as "City, Country" on the card bottom-right.',
      },
    },

    {
      name: 'downloadFile',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Download File',
      admin: {
        description: 'Upload an image, PDF, or other file for users to download when clicking the event card.',
      },
    },

    slugField(),
  ],
  timestamps: true,
}

export default Events
