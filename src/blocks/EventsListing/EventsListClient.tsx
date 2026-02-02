// src/blocks/EventsListing/EventsListClient.tsx
'use client'

import React, { useMemo, useState } from 'react'
import { EventCard } from '@/components/events/EventCard'
import { getEventStatus, type EventStatus } from '@/utilities/events'
import { cn } from '@/utilities/ui'

// shadcn select (Radix)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Filter = 'all' | EventStatus

type LiteEvent = {
  id: number | string
  title: string
  date: string
  location: string
  downloadFile?: any
}

const BRAND = '#18CB96'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'past', label: 'Past' },
]

export const EventsListClient: React.FC<{
  events: LiteEvent[]
  renderOnlyFilter?: boolean
}> = ({ events, renderOnlyFilter }) => {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    const withStatus = events.map((e) => ({ ...e, status: getEventStatus(e.date) }))
    const list = filter === 'all' ? withStatus : withStatus.filter((e) => e.status === filter)

    return [...list].sort((a, b) => {
      const at = new Date(a.date).getTime()
      const bt = new Date(b.date).getTime()
      return filter === 'past' ? bt - at : at - bt
    })
  }, [events, filter])

  const FilterUI = (
    <div className={cn('flex items-center gap-3', renderOnlyFilter ? 'text-white' : '')}>
      <span className={cn('text-sm', renderOnlyFilter ? 'text-white/80' : 'text-foreground/70')}>
        Filter:
      </span>

      <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <SelectTrigger
          className={cn(
            // base
            'h-10 rounded-full px-4 pr-12 text-sm shadow-sm border transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[rgba(24,203,150,0.25)]',
            // hero variant
            renderOnlyFilter
              ? 'bg-white/95 text-black border-white/20'
              : 'bg-white text-black border-black/10',
            // hover border brand
            'hover:border-[#18CB96]',
          )}
        >
          <SelectValue placeholder="All" />
        </SelectTrigger>

        <SelectContent className={cn('rounded-2xl border border-black/10 bg-white p-2 shadow-xl')}>
          {FILTERS.map((f) => (
            <SelectItem
              key={f.value}
              value={f.value}
              className={cn(
                'rounded-xl px-3 py-2 text-sm cursor-pointer',
                // default: white bg + brand text
                'text-[#18CB96]',
                // hover / keyboard highlight: brand bg + white text
                'data-[highlighted]:bg-[#18CB96] data-[highlighted]:text-white',
                // selected: keep readable + subtle brand tint
                'data-[state=checked]:bg-[rgba(24,203,150,0.12)] data-[state=checked]:text-[#18CB96]',
                // prevent default focus outlines weirdness
                'outline-none',
              )}
            >
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  if (renderOnlyFilter) return FilterUI

  return (
    <div>
      {/* FILTER (normal listing position too) */}
      {/* FILTER */}
      <div className="w-full flex justify-end">
        <div className="mb-8 flex items-center justify-end gap-3 w-fit">
          <span className="text-sm text-black/70">Filter:</span>

          <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <SelectTrigger
              className={cn(
                'h-10 rounded-full px-4  text-sm shadow-sm border transition-colors gap-8',
                'bg-white text-black border-black/10 hover:border-[#18CB96]',
                'focus:outline-none focus:ring-2 focus:ring-[rgba(24,203,150,0.25)]',
              )}
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>

            <SelectContent className="rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
              {FILTERS.map((f) => (
                <SelectItem
                  key={f.value}
                  value={f.value}
                  className={cn(
                    'rounded-xl px-3 py-2 text-sm cursor-pointer outline-none',
                    'text-[#18CB96]',
                    'data-[highlighted]:bg-[#18CB96] data-[highlighted]:text-white',
                    'data-[state=checked]:bg-[rgba(24,203,150,0.12)] data-[state=checked]:text-[#18CB96]',
                  )}
                >
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-8 md:grid-cols-2">
        {filtered.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            downloadFile={event.downloadFile}
          />
        ))}
      </div>
    </div>
  )
}
