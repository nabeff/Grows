// src/blocks/NewsListing/config.ts
import type { Block } from 'payload'

export const NewsListing: Block = {
  slug: 'newsListing',
  interfaceName: 'NewsListingBlock',
  labels: { singular: 'News Listing', plural: 'News Listings' },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'News' },
    { name: 'text', type: 'textarea', required: false },
  ],
}
