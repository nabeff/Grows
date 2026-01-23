// src/blocks/ImpactHero/config.ts
import type { Block } from 'payload'

export const ImpactHero: Block = {
  slug: 'impactHero',
  interfaceName: 'ImpactHeroBlock',
  labels: { singular: 'Impact Hero', plural: 'Impact Heroes' },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Image',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Small Title',
      defaultValue: 'Our Impact',
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Main Text',
      admin: { rows: 4 },
    },
  ],
}

export default ImpactHero
