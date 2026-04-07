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
      name: 'endDate',
      type: 'date',
      required: false,
      label: 'End Date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Optional. For multi-day events, set the end date.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'text',
          required: false,
          label: 'Start Time',
          admin: { placeholder: 'e.g. 9:00 AM', width: '33%' },
        },
        {
          name: 'endTime',
          type: 'text',
          required: false,
          label: 'End Time',
          admin: { placeholder: 'e.g. 5:00 PM', width: '33%' },
        },
        {
          name: 'timezone',
          type: 'text',
          required: false,
          label: 'Timezone',
          admin: { placeholder: 'e.g. GMT+1', width: '33%' },
        },
      ],
    },
    {
      name: 'eventType',
      type: 'select',
      required: false,
      label: 'Event Type',
      options: [
        { label: 'In-Person', value: 'in-person' },
        { label: 'Virtual', value: 'virtual' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
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
      name: 'description',
      type: 'richText',
      required: false,
      label: 'Description',
    },

    {
      name: 'eventImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Event Image / Flyer',
      admin: {
        description: 'Flyer or poster image displayed on the event detail page.',
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

    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      admin: {
        description: 'Add images to the event gallery. Shown on past event pages.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Host / Contact Info',
      fields: [
        {
          name: 'hostName',
          type: 'text',
          required: false,
          label: 'Host Name',
        },
        {
          name: 'hostPhone',
          type: 'text',
          required: false,
          label: 'Host Phone',
        },
        {
          name: 'hostEmail',
          type: 'text',
          required: false,
          label: 'Host Email',
        },
      ],
    },

    slugField(),
  ],
  timestamps: true,
}

export default Events
