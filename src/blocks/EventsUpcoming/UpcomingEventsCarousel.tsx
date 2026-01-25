'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CMSLink } from '@/components/Link'
import { EventCard } from '@/components/events/EventCard'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import clsx from 'clsx'
import { TextReveal } from '@/components/TextReveal'

type LiteEvent = {
  id: number | string
  title: string
  date: string
  location: string
  link: any
}

type CMSLinkProps = React.ComponentProps<typeof CMSLink>
type ViewAllItem = { link: CMSLinkProps }

const BRAND = '#18CB96'
const MINT = '#D9F6EE'

type Props = {
  title?: string | null
  description?: string | null
  viewAll?: ViewAllItem[] | null
  events: LiteEvent[]
}

const UpcomingEventsCarousel: React.FC<Props> = ({ title, description, viewAll, events }) => {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const viewAllLinks = useMemo(() => (Array.isArray(viewAll) ? viewAll : []), [viewAll])

  const sync = useCallback(() => {
    if (!api) return
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [api])

  useEffect(() => {
    if (!api) return

    // Sync once, then on all relevant carousel lifecycle events
    sync()
    api.on('init', sync)
    api.on('reInit', sync)
    api.on('select', sync)
    api.on('settle', sync)

    return () => {
      api.off('init', sync)
      api.off('reInit', sync)
      api.off('select', sync)
      api.off('settle', sync)
    }
  }, [api, sync])

  const scrollPrev = () => {
    if (!api) return
    api.scrollPrev()
    // Ensure state reflects post-scroll, even on fast clicks
    requestAnimationFrame(sync)
  }

  const scrollNext = () => {
    if (!api) return
    api.scrollNext()
    requestAnimationFrame(sync)
  }

  const btnBase =
    'inline-flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-[1.08] active:scale-[0.98]'
  const btnDisabled = 'opacity-30 pointer-events-none'

  return (
    <>
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
        <div className="flex max-w-4xl flex-col gap-2">
          {title ? (
            <h2 className="text-3xl md:text-4xl lg:text-6xl w-full font-bold">
              <TextReveal as="span" text={title} />
            </h2>
          ) : null}
        </div>

        <div className="shrink-0 pt-2 flex gap-3 flex-wrap">
          {viewAllLinks.map((l, i) => (
            <CMSLink key={i} {...l.link} />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: false,
          // ✅ best practice: keep snapping so edges are reliable
          dragFree: false,
          // ✅ prevents “half snaps” feeling
          containScroll: 'trimSnaps',
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4 items-stretch">
          {events.map((event) => (
            <CarouselItem
              key={event.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 min-w-0 flex"
            >
              {/* Equal height (and room for small screens so text doesn't overflow) */}
              <div className="w-full min-h-[320px] md:min-h-[360px] lg:min-h-[340px]">
                <EventCard
                  className="h-full"
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  link={event.link}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Buttons under carousel — right aligned */}
      <div className="mt-10 flex w-full justify-end gap-3">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Previous"
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
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Next"
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
    </>
  )
}

export default UpcomingEventsCarousel
