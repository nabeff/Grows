import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Post, Media as MediaType, Category } from '@/payload-types'
import { NewsCard } from '@/components/news/NewsCard'

function getText(v: unknown): string {
  if (typeof v === 'string' || typeof v === 'number') return String(v)
  return ''
}

function getCategoryLabel(categories: (string | Category)[] | null | undefined): string | null {
  const first = (categories ?? [])[0]
  if (!first || typeof first === 'string') return null
  return String(first.title ?? first.slug ?? '').trim() || null
}

function formatSubtitle(publishedAt?: string | null): string | null {
  if (!publishedAt) return null
  const d = new Date(publishedAt)
  if (Number.isNaN(d.getTime())) return null
  const formatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return `Press release - ${formatted}`
}

export default async function NewsPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 24,
    overrideAccess: false,
    sort: '-publishedAt',
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

  const docs = posts.docs as unknown as Post[]

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-10">
        <h1 className="text-5xl md:text-7xl font-extrabold">News</h1>
      </div>

      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {docs.map((p) => (
            <div key={p.id} className="min-h-[340px] md:min-h-[380px] flex">
              <NewsCard
                className="w-full h-full"
                href={`/news/${getText(p.slug)}`}
                image={(p.heroImage as MediaType) ?? null}
                category={getCategoryLabel(p.categories as any)}
                title={getText(p.title)}
                subtitle={formatSubtitle(p.publishedAt ? String(p.publishedAt) : null)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
