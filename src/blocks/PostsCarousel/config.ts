import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

export const PostsCarousel: Block = {
  slug: 'postsCarousel',
  interfaceName: 'PostsCarousel',
  labels: { singular: 'Posts Carousel', plural: 'Posts Carousels' },
  fields: [
    {
      name: 'titleLeft',
      type: 'text',
      required: true,
      defaultValue: 'Our',
    },
    {
      name: 'titleRight',
      type: 'text',
      required: true,
      defaultValue: 'News',
    },

    {
      name: 'limit',
      type: 'number',
      required: false,
      defaultValue: 6,
      min: 3,
      max: 12,
    },

    linkGroup({
      overrides: {
        name: 'viewAll',
        label: 'View All Button',
        required: false,
        minRows: 0,
        maxRows: 1,
        defaultValue: [
          {
            label: 'View All',
            type: 'internal',
            link: '/news',
            appearance: 'default',
            newTab: false,
          },
        ],
      },
    }),
  ],
}
