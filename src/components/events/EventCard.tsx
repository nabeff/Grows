import React from 'react'
import { cn } from '@/utilities/ui'
import { formatEventDate, getEventStatus, getStatusDotClass } from '@/utilities/events'
import { TextReveal } from '@/components/TextReveal'
import type { Media } from '@/payload-types'

type Props = {
  title: string
  date: string
  location: string
  downloadFile?: Media | string | null
  className?: string
}

export const EventCard: React.FC<Props> = ({ title, date, location, downloadFile, className }) => {
  const status = getEventStatus(date)
  const dotClass = getStatusDotClass(status)

  const cardContent = (
    <div className="flex h-full flex-col p-8">
      {/* Date */}
      <p className="text-sm text-black">
        <TextReveal as="span" text={formatEventDate(date)} />
      </p>

      {/* Title */}
      <h2 className="mt-5 text-2xl md:text-3xl font-bold leading-tight tracking-tight text-black">
        <TextReveal as="span" text={title} />
      </h2>

      {/* Bottom */}
      <div className="mt-auto flex items-end justify-between pt-10">
        <div className="flex items-center gap-3">
          <span className={cn('h-5 w-5 rounded-full', dotClass)} />
          {status === 'live' ? (
            <span className="text-xl font-bold text-black">
              <TextReveal as="span" text="Live" />
            </span>
          ) : null}
        </div>

        <p className="text-sm text-black/70">
          <TextReveal as="span" text={location} />
        </p>
      </div>
    </div>
  )

  const cardClasses = cn(
    'group block rounded-2xl bg-white shadow-md',
    className,
  )

  // If download file exists, make card clickable for download
  if (downloadFile && typeof downloadFile === 'object' && downloadFile.url) {
    return (
      <a
        href={downloadFile.url}
        download={downloadFile.filename || 'download'}
        className={cn(cardClasses, 'transition-transform duration-200 hover:-translate-y-[2px] cursor-pointer')}
      >
        {cardContent}
      </a>
    )
  }

  // No file - render as non-clickable div
  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  )
}
