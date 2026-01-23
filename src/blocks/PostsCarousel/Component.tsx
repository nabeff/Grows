// src/blocks/PostsCarousel/Component.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { PostsCarousel as PostsCarouselBlock, Post, Media as MediaType, Category } from '@/payload-types'
import NewsCarouselClient, { type LiteNewsPost } from './PostsCarouselClient'

function getText(v: unknown): string {
  if (typeof v === 'string' || typeof v === 'number') return String(v)
  return ''
}

function formatSubtitle(publishedAt?: string | null): string | null {
  if (!publishedAt) return null
  const d = new Date(publishedAt)
  if (Number.isNaN(d.getTime())) return null

  // ex: "Press release - May 14, 2024"
  const formatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `Press release - ${formatted}`
}

function pickCategoryLabel(categories: (string | Category)[] | null | undefined): string | null {
  const first = (categories ?? [])[0]
  if (!first) return null
  if (typeof first === 'string') return null
  return getText(first.title ?? first.slug)
}

export default async function PostsCarousel({ titleLeft, titleRight, viewAll, limit }: PostsCarouselBlock) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: typeof limit === 'number' ? limit : 6,
    depth: 2,
    where: { _status: { equals: 'published' } },
    select: {
      id: true,
      title: true,
      slug: true,
      heroImage: true,
      publishedAt: true,
      categories: true,
    },
  })

  const lite: LiteNewsPost[] = (docs as unknown as Post[]).map((p) => ({
    id: p.id,
    slug: getText(p.slug),
    title: getText(p.title),
    heroImage: (p.heroImage as MediaType) ?? null,
    categoryLabel: pickCategoryLabel(p.categories as any),
    subtitle: formatSubtitle(p.publishedAt ? String(p.publishedAt) : null),
  }))

  return (
    <NewsCarouselClient
      titleLeft={getText(titleLeft)}
      titleRight={getText(titleRight)}
      viewAll={Array.isArray(viewAll) ? viewAll : []}
      posts={lite}
    />
  )
}
