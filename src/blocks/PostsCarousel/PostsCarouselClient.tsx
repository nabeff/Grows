'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { CMSLink } from '@/components/Link'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import type { Media as MediaType } from '@/payload-types'
import { NewsCard } from '@/components/news/NewsCard'
import { TextReveal } from '@/components/TextReveal'

const BRAND = '#18CB96'
const MINT = '#D9F6EE'

// 421 / 568
const CARD_ASPECT = 421 / 568

type CMSLinkProps = React.ComponentProps<typeof CMSLink>
type ViewAllItem = { link: CMSLinkProps }

export type LiteNewsPost = {
  id: string | number
  slug: string
  title: string
  categoryLabel?: string | null
  subtitle?: string | null
  heroImage?: MediaType | null
}

type Props = {
  titleLeft?: string | null // "Our"
  titleRight?: string | null // "News"
  viewAll?: ViewAllItem[] | null
  posts: LiteNewsPost[]
}

const NewsCarouselClient: React.FC<Props> = ({ titleLeft, titleRight, viewAll, posts }) => {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const viewAllLinks = useMemo(() => (Array.isArray(viewAll) ? viewAll : []), [viewAll])

  const syncButtons = useCallback(() => {
    if (!api) return
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [api])

  useEffect(() => {
    if (!api) return
    syncButtons()

    api.on('select', syncButtons)
    api.on('reInit', syncButtons)
    api.on('settle', syncButtons)

    return () => {
      api.off('select', syncButtons)
      api.off('reInit', syncButtons)
      api.off('settle', syncButtons)
    }
  }, [api, syncButtons])

  const btnBase =
    'inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-[1.08] active:scale-[0.98]'
  const btnDisabled = 'opacity-30 pointer-events-none'

  return (
    <section className="container py-12 lg:py-16 text-black">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 ">
          {titleLeft ? (
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none">
              <TextReveal as="span" text={titleLeft} />
            </h2>
          ) : null}
        </div>

        <div className="shrink-0 flex gap-3 flex-wrap">
          {viewAllLinks.map((l, i) => (
            <CMSLink key={i} {...l.link} />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: false, containScroll: 'trimSnaps' }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4 items-stretch">
          {posts.map((p) => (
            <CarouselItem
              key={p.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 min-w-0 flex"
            >
              {/* Fixed card aspect ratio (421/568) + preferred width (421px) */}
              <div className="w-full flex">
                <div
                  className="w-full max-w-[421px] flex"
                  style={{ aspectRatio: String(CARD_ASPECT) }}
                >
                  <NewsCard
                    className="w-full h-full"
                    href={`/news/${p.slug}`}
                    image={p.heroImage ?? null}
                    category={p.categoryLabel ?? null}
                    title={p.title}
                    subtitle={p.subtitle ?? null}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Buttons */}
      <div className="mt-10 flex w-full justify-end gap-3">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          aria-label="Previous"
          aria-disabled={!canPrev}
          className={clsx(btnBase, !canPrev && btnDisabled)}
          style={{ background: MINT }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
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

        <button
          type="button"
          onClick={() => api?.scrollNext()}
          aria-label="Next"
          aria-disabled={!canNext}
          className={clsx(btnBase, !canNext && btnDisabled)}
          style={{ background: BRAND }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="#111"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default NewsCarouselClient
