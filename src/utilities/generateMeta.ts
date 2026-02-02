import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

const SITE_URL = 'https://www.grows.ma'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  let url = SITE_URL + '/rectangle.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? SITE_URL + ogUrl : SITE_URL + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title || 'Grows'

  return {
    description: doc?.meta?.description,
    alternates: {
      canonical: SITE_URL + (Array.isArray(doc?.slug) ? '/' + doc?.slug.join('/') : '/'),
    },
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: SITE_URL + (Array.isArray(doc?.slug) ? '/' + doc?.slug.join('/') : '/'),
    }),
    title,
  }
}
