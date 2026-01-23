import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    {
  name: 'logo',
  type: 'upload',
  relationTo: 'media',
  required: true,
  label: 'Header Logo',
},
{
  name: 'forceBlackOn',
  label: 'Header always black on these paths',
  type: 'array',
  admin: { initCollapsed: true },
  fields: [
    {
      name: 'path',
      label: 'Path (example: /contact, /blog, /blog/*, *)',
      type: 'text',
      required: true,
    },
  ],
},

    {
      name: 'navItems',
      type: 'array',
      fields: [link({})],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Right Button',
      fields: [
        link({
      appearances: ['brand', 'outline', 'default', 'link', 'ghost', 'secondary', 'navlink', 'inline'],
          overrides: {
            label: 'Button Link',
            required: false,
          },
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
