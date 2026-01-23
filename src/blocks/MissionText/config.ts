import type { Block } from 'payload'

export const MissionText: Block = {
  slug: 'missionText',
  interfaceName: 'MissionTextBlock', // ✅ add this
  labels: {
    singular: 'Mission Text',
    plural: 'Mission Text Blocks',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
  ],
}
