import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

export const EventsUpcoming: Block = {
  slug: 'eventsUpcoming',
  interfaceName: 'EventsUpcomingBlock',
  labels: {
    singular: 'Upcoming Events',
    plural: 'Upcoming Events',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Upcoming Events',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { rows: 3 },
    },

    // ✅ same pattern as PostsCarousel
    linkGroup({
      overrides: {
        name: 'viewAll',
        label: 'View All Button',
        required: true,
        minRows: 1,
        maxRows: 1,
        defaultValue: [
          {
            label: 'View All',
            type: 'internal',
            link: '/events',
            appearance: 'green',
            newTab: false,
          },
        ],
      },
    }),
  ],
}

export default EventsUpcoming
