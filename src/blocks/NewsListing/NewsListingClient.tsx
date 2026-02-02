// src/blocks/NewsListing/NewsListingClient.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import type { Category, Media as MediaType } from '@/payload-types'
import { NewsCard } from '@/components/news/NewsCard'
import { cn } from '@/utilities/ui'

// shadcn select (Radix)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type PostDoc = {
  id: string | number
  slug?: string | null
  title?: string | null
  heroImage?: MediaType | null
  publishedAt?: string | null
  createdAt?: string | null
  categories?: (string | Category)[] | null
}

type ApiResponse = {
  docs: PostDoc[]
  page: number
  totalPages: number
}

type Sort = 'latest' | 'new'

const BRAND = '#18CB96'
const MINT = '#D9F6EE'

const SORTS: { value: Sort; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'new', label: 'New' },
]

function formatSubtitle(publishedAt?: string | null): string | null {
  if (!publishedAt) return null
  const d = new Date(publishedAt)
  if (Number.isNaN(d.getTime())) return null
  const formatted = d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return `Press release - ${formatted}`
}

function pickCategoryLabel(categories: (string | Category)[] | null | undefined): string | null {
  const first = (categories ?? [])[0]
  if (!first) return null
  if (typeof first === 'string') return null
  return (first.title as any) ?? (first.slug as any) ?? null
}

const SkeletonCard = () => (
  <div
    className={clsx(
      'w-full h-full rounded-3xl bg-black/[0.04] overflow-hidden',
      'shadow-[0_10px_25px_rgba(0,0,0,0.08)]',
    )}
  >
    <div className="h-full w-full animate-pulse">
      <div className="h-[72%] w-full bg-black/[0.06]" />
      <div className="p-6 md:p-7 space-y-4">
        <div className="h-4 w-24 rounded bg-black/[0.08]" />
        <div className="h-8 w-3/4 rounded bg-black/[0.08]" />
        <div className="h-4 w-40 rounded bg-black/[0.08]" />
        <div className="pt-4 flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-black/[0.08]" />
          <div className="h-12 w-12 rounded-full bg-black/[0.08]" />
        </div>
      </div>
    </div>
  </div>
)

export default function NewsListingClient() {
  const [sort, setSort] = useState<Sort>('latest')
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<PostDoc[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const sortParam = useMemo(() => {
    if (sort === 'latest') return '-publishedAt'
    return '-createdAt'
  }, [sort])

  useEffect(() => {
    let alive = true
    const run = async () => {
      setLoading(true)
      try {
        const qs = new URLSearchParams()
        qs.set('limit', '4') // ✅ fetch 4 news per page
        qs.set('page', String(page))
        qs.set('depth', '2')
        qs.set('sort', sortParam)
        qs.set('where[_status][equals]', 'published')

        const res = await fetch(`/api/posts?${qs.toString()}`, { cache: 'no-store' })
        const json = (await res.json()) as ApiResponse

        if (!alive) return
        setDocs(Array.isArray(json?.docs) ? json.docs : [])
        setTotalPages(Number(json?.totalPages) || 1)
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
  }, [page, sortParam])

  const btn =
    'h-10 w-10 rounded-full grid place-items-center shadow-lg transition-transform duration-200 hover:scale-[1.06] active:scale-[0.98]'
  const btnDisabled = 'opacity-30 pointer-events-none'

  return (
    <div className="mt-10">
      {/* Filter (same styling as Events filter) */}
      <div className="w-full flex justify-end">
        <div className="mb-8 flex items-center justify-end gap-3 w-fit">
          <span className="text-sm text-black/70">Filter:</span>

          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v as Sort)
              setPage(1)
            }}
          >
            <SelectTrigger
              className={cn(
                'h-10 rounded-full px-4 text-sm shadow-sm border transition-colors gap-8',
                'bg-white text-black border-black/10 hover:border-[#18CB96]',
                'focus:outline-none focus:ring-2 focus:ring-[rgba(24,203,150,0.25)]',
              )}
            >
              <SelectValue placeholder="Latest" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
              {SORTS.map((s) => (
                <SelectItem
                  key={s.value}
                  value={s.value}
                  className={cn(
                    'rounded-xl px-3 py-2 text-sm cursor-pointer outline-none',
                    'text-[#18CB96]',
                    'data-[highlighted]:bg-[#18CB96] data-[highlighted]:text-white',
                    'data-[state=checked]:bg-[rgba(24,203,150,0.12)] data-[state=checked]:text-[#18CB96]',
                  )}
                >
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid (4) */}
      <div className={clsx('mt-10 grid gap-6', 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-0 min-h-[400px] md:min-h-[480px] lg:min-h-[568px]">
                <SkeletonCard />
              </div>
            ))
          : docs.map((p) => (
              <div key={p.id} className="min-w-0 min-h-[400px] md:min-h-[480px] lg:min-h-[568px]">
                <NewsCard
                  className="w-full h-full"
                  href={`/news/${p.slug ?? ''}`}
                  image={p.heroImage ?? null}
                  category={pickCategoryLabel(p.categories) ?? null}
                  title={p.title ?? ''}
                  subtitle={formatSubtitle(p.publishedAt ?? null)}
                />
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex w-full items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          aria-label="Previous"
          disabled={page <= 1 || loading}
          className={clsx(btn, (page <= 1 || loading) && btnDisabled)}
          style={{ background: MINT }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              fill="none"
              stroke="#111"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1
            const active = n === page
            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                disabled={loading}
                className={clsx(
                  'h-10 w-10 rounded-full text-sm font-semibold',
                  active ? 'text-black' : 'text-black/70',
                  active ? 'shadow-md' : '',
                  loading && btnDisabled,
                )}
                style={{ background: active ? MINT : 'transparent' }}
                aria-label={`Page ${n}`}
              >
                {n}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          aria-label="Next"
          disabled={page >= totalPages || loading}
          className={clsx(btn, (page >= totalPages || loading) && btnDisabled)}
          style={{ background: BRAND }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
