import type { Metadata } from 'next'

const SITE_URL = 'https://www.grows.ma'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Grows improves healthcare in Morocco. We offer patient support programs, HEOR studies, and medical events. Partner with us for better patient impact.',
  images: [
    {
      url: `${SITE_URL}/rectangle.webp`,
    },
  ],
  siteName: 'Grows',
  title: 'Healthcare Consulting & Patient Support in Morocco | Grows',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
