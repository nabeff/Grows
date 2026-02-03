import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    // LEFT
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      required: false,
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },

    // RIGHT COLUMNS
    {
      name: 'columns',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },

    // SOCIAL (icon image + link)
    {
      name: 'social',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        link({
          appearances: false,
        }),
      ],
    },

    // PHONES
    {
      name: 'phones',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g. Collaboration, Patient Support',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },

    // BOTTOM
    {
      name: 'bottomText',
      type: 'text',
      required: false,
    },
    {
      name: 'bottomLinks',
      type: 'array',
      admin: { initCollapsed: true },
      fields: [
        link({
          appearances: false,
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
