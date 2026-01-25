import type { Block } from 'payload'

import { link } from '@/fields/link'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const ContactSplitBlock: Block = {
  slug: 'contactSplitBlock',
  interfaceName: 'ContactSplitBlock',
  labels: {
    singular: 'Contact Split',
    plural: 'Contact Split Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'intro',
      type: 'textarea',
      required: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },

    // Reuse plugin-form-builder form relationship
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: 'Intro Content',
    },

    // Phones (multiple)
    {
      name: 'phones',
      type: 'array',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },

    // Email (single)
    {
      name: 'email',
      type: 'text',
      required: false,
    },

    // Social (single link)
    {
      name: 'social',
      type: 'group',
      fields: [
        link({
          appearances: ['inline'],
        }),
      ],
    },
  ],
}
