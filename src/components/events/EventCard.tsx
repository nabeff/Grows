import React from 'react'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { formatEventDate, getEventStatus, getStatusDotClass } from '@/utilities/events'

type Props = {
  title: string
  date: string
  location: string
  link: any // if you have a type for CMSLink props, replace this
  className?: string
}

export const EventCard: React.FC<Props> = ({ title, date, location, link, className }) => {
  const status = getEventStatus(date)
  const dotClass = getStatusDotClass(status)

  return (
    <CMSLink
      {...link}
      className={cn(
        'group block rounded-2xl bg-white shadow-md',
        'transition-transform duration-200 hover:-translate-y-[2px]',
        className,
      )}
    >
      <div className="flex h-full flex-col p-8">
        {/* Date */}
        <p className="text-sm  text-black">{formatEventDate(date)}</p>

        {/* Title */}
        <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight  text-black">
          {title}
        </h2>

        {/* Bottom */}
        <div className="mt-auto flex items-end justify-between pt-10">
          <div className="flex items-center gap-3">
            <span className={cn('h-5 w-5 rounded-full', dotClass)} />
            {status === 'live' ? <span className="text-xl font-bold  text-black">Live</span> : null}
          </div>

          <p className="text-sm  text-black/70">{location}</p>
        </div>
      </div>
    </CMSLink>
  )
}
