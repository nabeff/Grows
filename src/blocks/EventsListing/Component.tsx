// src/blocks/EventsListing/Component.tsx
import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { EventsListingBlock as Props, Event, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { EventsListClient } from './EventsListClient'
import { TextReveal } from '@/components/TextReveal'

function getText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return ''
}

type LiteEvent = {
  id: number | string
  title: string
  date: string
  location: string
  downloadFile?: any
}

export const EventsListingBlock = async (props: Props) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'events',
    limit: 200,
    sort: 'date',
    depth: 1,
    select: {
      id: true,
      title: true,
      date: true,
      location: true,
      downloadFile: true,
    },
  })

  const events = docs as unknown as Event[]
  if (!events.length) return null

  const liteEvents: LiteEvent[] = events.map((e) => ({
    id: e.id,
    title: getText(e.title),
    date: String(e.date),
    location: getText(e.location),
    downloadFile: (e as any).downloadFile,
  }))

  const heroImage = props.heroImage as MediaType | null
  const heroTitle = getText(props.title)

  return (
    <section>
      {/* HERO */}
      <div className="relative h-[340px] md:h-[420px] w-full overflow-hidden">
        {heroImage ? <Media resource={heroImage} fill imgClassName="object-cover" /> : null}

        {/* Title + Filter inline */}
        <div className="relative container h-full flex items-end pb-10">
          <div className="w-full flex items-end justify-between gap-6">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white">
              <TextReveal as="span" text={heroTitle} />
            </h1>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="container py-12 lg:py-16">
        <EventsListClient events={liteEvents} />
      </div>
    </section>
  )
}

export default EventsListingBlock
