import type { Metadata } from 'next'
import React, { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { formatEventDate, getEventStatus } from '@/utilities/events'
import type { Event, Form, Media as MediaType } from '@/payload-types'
import { EventGallery } from '@/components/events/EventGallery'
import { FormBlock } from '@/blocks/Form/Component'
import PageClient from './page.client'
import Link from 'next/link'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const events = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return events.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

function formatDateRange(date: string, endDate?: string | null): string {
  const start = formatEventDate(date)
  if (!endDate) return start
  const end = formatEventDate(endDate)
  return `${start} – ${end}`
}

function formatTime(time: string): string {
  // If already formatted (e.g. "9:00 AM", "14h30"), return as-is
  if (/[hH:aApP]/.test(time)) return time
  // Otherwise append "h" (e.g. "12" → "12h")
  return `${time}h`
}

function formatTimeRange(
  startTime?: string | null,
  endTime?: string | null,
): string | null {
  if (!startTime) return null
  let result = formatTime(startTime)
  if (endTime) result += ` – ${formatTime(endTime)}`
  return result
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  'in-person': 'In-Person',
  virtual: 'Virtual',
  hybrid: 'Hybrid',
}

export default async function EventDetail({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const url = '/events/' + decodedSlug
  const event = await queryEventBySlug({ slug: decodedSlug })

  if (!event) return <PayloadRedirects url={url} />

  const status = getEventStatus(event.date)
  const dateLabel = formatDateRange(event.date, event.endDate)
  const timeLabel = formatTimeRange(event.startTime, event.endTime)
  const eventTypeLabel = event.eventType ? EVENT_TYPE_LABELS[event.eventType] : null
  const eventImage = event.eventImage as MediaType | null
  const hasContact = event.hostName || event.hostPhone || event.hostEmail
  const shareUrl = `https://www.grows.ma/events/${decodedSlug}`
  const galleryItems = (event.gallery || []).filter(
    (item) => item.image && typeof item.image === 'object',
  ) as Array<{ image: MediaType; id?: string | null }>

  let registrationForm: Form | null = null
  if (status === 'upcoming') {
    if (event.registrationForm && typeof event.registrationForm === 'object') {
      registrationForm = event.registrationForm as Form
    } else {
      registrationForm = (await queryDefaultRegistrationForm()) as Form | null
    }
  }

  return (
    <article className="pt-32 pb-20">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="container">
        {/* Back link */}
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#18CB96] transition-colors hover:text-[#14b886]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Events
        </Link>

        <div className="grid gap-12 lg:grid-cols-[3fr_2fr]">
          {/* LEFT COLUMN */}
          <div>
            {/* Status banner */}
            <div className="mt-4">
              {status === 'past' ? (
                <span className="inline-flex rounded-full bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600">
                  Past Event
                </span>
              ) : status === 'live' ? (
                <span className="inline-flex rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-600">
                  Happening Now
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-[#18CB96]/10 px-4 py-1.5 text-sm font-medium text-[#18CB96]">
                  Upcoming
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-black">
              {event.title}
            </h1>

            {/* Date & Time */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-base font-medium text-black/80">
              <span>{dateLabel}</span>
              {timeLabel && (
                <>
                  <span className="text-black/30">|</span>
                  <span>{timeLabel}</span>
                </>
              )}
            </div>

            {/* Event type & location */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-black/80">
              {eventTypeLabel && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-black/50">Type of event:</span>
                  <span className="inline-flex rounded-full bg-[#18CB96]/10 px-3 py-0.5 text-sm font-medium text-[#18CB96]">
                    {eventTypeLabel}
                  </span>
                </div>
              )}
              {eventTypeLabel && event.location && <span className="text-black/30">|</span>}
              <span>{event.location}</span>
            </div>

            {/* Green divider */}
            <div className="mt-8 h-1 w-16 rounded-full bg-[#18CB96]" />

            {/* Our social */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm text-black/50">Our social:</span>
              <a
                href="https://www.linkedin.com/company/grows-ma"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:bg-[#18CB96]/10 hover:text-[#18CB96]"
                aria-label="LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold text-black mb-4">About this event</h2>
                <RichText
                  className="max-w-[52rem] text-[13px] md:text-base !text-black blacktext"
                  data={event.description}
                  enableGutter={false}
                />
              </div>
            )}

            {/* Registration form – inside left column, upcoming events only */}
            {registrationForm && (
              <div className="mt-12">
                <h2 className="text-lg font-bold text-black mb-4">Register for this event</h2>
                <FormBlock
                  enableIntro={false}
                  form={registrationForm as never}
                  contextFields={{
                    eventTitle: event.title,
                    eventSlug: event.slug || '',
                    eventDate: dateLabel,
                    eventLocation: event.location,
                  }}
                />
              </div>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-8">
            {/* Event image / flyer */}
            {eventImage && (
              <div className="overflow-hidden rounded-2xl">
                <Media resource={eventImage} imgClassName="w-full h-auto object-cover" />
              </div>
            )}

            {/* Contact card */}
            {hasContact && (
              <div className="rounded-2xl bg-white px-5 py-5 shadow-sm">
                <h3 className="text-lg font-bold text-black">Questions? Talk to your event host</h3>
                <div className="mt-3">
                  {event.hostName && (
                    <div className="flex items-start gap-3 py-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18CB96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm text-black/80">{event.hostName}</span>
                        {event.hostRole && (
                          <span className="text-xs text-black/50">{event.hostRole}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {event.hostPhone && (
                    <a href={`tel:${event.hostPhone}`} className="flex items-center gap-3 py-2 group">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18CB96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <span className="text-sm text-black/80 group-hover:text-[#18CB96] transition-colors">{event.hostPhone}</span>
                    </a>
                  )}
                  {event.hostEmail && (
                    <a href={`mailto:${event.hostEmail}`} className="flex items-center gap-3 py-2 group">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18CB96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span className="text-sm text-black/80 group-hover:text-[#18CB96] transition-colors">{event.hostEmail}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery – full width below both columns */}
        {status === 'past' && galleryItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black">Gallery</h2>
            <div className="mt-6">
              <EventGallery items={galleryItems} />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

const SITE_URL = 'https://www.grows.ma'

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const event = await queryEventBySlug({ slug: decodedSlug })

  const title = event?.title || 'Event | Grows Morocco'

  return {
    title,
    description: event
      ? `${event.title} — ${formatEventDate(event.date)} in ${event.location}`
      : 'View event details from Grows Morocco.',
    alternates: {
      canonical: `${SITE_URL}/events/${decodedSlug}`,
    },
  }
}

const queryDefaultRegistrationForm = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'forms',
    limit: 1,
    pagination: false,
    where: { title: { equals: 'Event Registration' } },
  })
  return result.docs?.[0] || null
})

const queryEventBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'events',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2,
    where: { slug: { equals: slug } },
  })

  return (result.docs?.[0] as Event) || null
})
