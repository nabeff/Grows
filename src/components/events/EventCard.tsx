import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { formatEventDate, getEventStatus, getStatusDotClass } from '@/utilities/events'
import { TextReveal } from '@/components/TextReveal'

type Props = {
  title: string
  date: string
  location: string
  slug: string
  className?: string
}

export const EventCard: React.FC<Props> = ({ title, date, location, slug, className }) => {
  const status = getEventStatus(date)
  const dotClass = getStatusDotClass(status)

  return (
    <Link
      href={`/events/${slug}`}
      className={cn(
        'group block rounded-2xl bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer',
        className,
      )}
    >
      <div className="flex h-full flex-col p-8">
        {/* Date */}
        <p className="text-sm text-black">
          <TextReveal as="span" text={formatEventDate(date)} />
        </p>

        {/* Title */}
        <h2 className="mt-5 text-xl md:text-2xl font-bold leading-tight tracking-tight text-black">
          <TextReveal as="span" text={title} />
        </h2>

        {/* Bottom */}
        <div className="mt-auto flex items-end justify-between pt-10">
          <div className="flex items-center gap-2">
            <span className={cn('h-3 w-3 rounded-full', dotClass)} />
            <span className={cn(
              'text-xs font-medium',
              status === 'past' ? 'text-black/50' : status === 'live' ? 'text-red-500' : 'text-[#18CB96]',
            )}>
              {status === 'past' ? 'Past Event' : status === 'live' ? 'Live' : 'Upcoming'}
            </span>
          </div>

          <p className="text-sm text-black/70">
            <TextReveal as="span" text={location} />
          </p>
        </div>
      </div>
    </Link>
  )
}
