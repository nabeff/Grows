import type { Block } from 'payload'

export const EventsListing: Block = {
  slug: 'eventsListing',
  interfaceName: 'EventsListingBlock',
  labels: {
    singular: 'Events Listing',
    plural: 'Events Listings',
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Background Image',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Hero Title',
      defaultValue: 'Events',
    },
  ],
}

export default EventsListing
