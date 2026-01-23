import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { EventsUpcomingBlock as EventsUpcomingProps, Event } from '@/payload-types'
import { getEventStatus } from '@/utilities/events'
import UpcomingEventsCarousel from './UpcomingEventsCarousel'

function getText(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return ''
}

export type LiteEvent = {
  id: number | string
  title: string
  date: string
  location: string
  link: any
}

export default async function EventsUpcomingBlock({
  title,
  description,
  viewAll,
}: EventsUpcomingProps) {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'events',
    limit: 50,
    sort: 'date',
    depth: 1,
    select: {
      id: true,
      title: true,
      date: true,
      location: true,
      link: true,
    },
  })

  const events = docs as unknown as Event[]
  if (!events.length) return null

  const liteEvents: LiteEvent[] = events
    .map((e) => ({
      id: e.id,
      title: getText(e.title),
      date: String(e.date),
      location: getText(e.location),
      link: (e as any).link,
    }))
    .filter((e) => getEventStatus(e.date) === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (!liteEvents.length) return null

  return (
    <section className="container py-12 lg:py-16 text-black my-[4rem]">
      <UpcomingEventsCarousel
        title={getText(title)}
        description={getText(description)}
        viewAll={Array.isArray(viewAll) ? viewAll : []}
        events={liteEvents}
      />
    </section>
  )
}
