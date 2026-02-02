import type { Metadata } from 'next'
import React, { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { getReadingTimeMinutes } from '@/utilities/readingTime'
import type { Post, Media as MediaType, Category } from '@/payload-types'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
    where: { _status: { equals: 'published' } },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

function getCategoryLabel(categories: (string | Category)[] | null | undefined): string | null {
  const first = (categories ?? [])[0]
  if (!first || typeof first === 'string') return null
  return String(first.title ?? first.slug ?? '').trim() || null
}

function formatDate(publishedAt?: string | null): string | null {
  if (!publishedAt) return null
  const d = new Date(publishedAt)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function NewsArticle({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const url = '/news/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const category = getCategoryLabel(post.categories as any)
  const dateLabel = formatDate(post.publishedAt ? String(post.publishedAt) : null)
  const minutes = getReadingTimeMinutes(post.content)

  const hero = (post.heroImage as MediaType) ?? null

  return (
    <article className="pt-24 pb-20">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container">
        {/* top meta line */}
        <div className="text-base text-black/90 flex items-center gap-2">
          {category ? <span>{category}</span> : null}
          {category && dateLabel ? <span>•</span> : null}
          {dateLabel ? <span>{dateLabel}</span> : null}
        </div>

        {/* title */}
        <h1 className="mt-4 text-3xl md:text-5xl lg:text-7xl font-bold text-black ">{post.title}</h1>

        {/* reading time pill */}
        <div className="mt-4">
          <span className="inline-flex rounded-full bg-[#18CB96] px-6 py-2 text-base font-medium text-white">
            {minutes} min read
          </span>
        </div>

        {/* hero image */}
        {hero ? (
          <div className="mt-10 overflow-hidden rounded-3xl">
            <div className="relative aspect-[16/5] w-full">
              <Media resource={hero} fill imgClassName="object-cover" />
            </div>
          </div>
        ) : null}

        {/* content */}
        <div className="mt-12">
          <RichText
            className="max-w-[52rem] mx-auto !text-black blacktext"
            data={post.content}
            enableGutter={false}
          />
        </div>
      </div>
    </article>
  )
}

const SITE_URL = 'https://www.grows.ma'

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  const title = post?.title ? `${post.title} | Grows` : 'Healthcare News & Expert Insights | Grows Morocco'

  return {
    title,
    description: post?.meta?.description || 'Read the latest healthcare news and expert insights from Grows Morocco.',
    alternates: {
      canonical: `${SITE_URL}/news/${decodedSlug}`,
    },
  }
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })

  return (result.docs?.[0] as Post) || null
})
