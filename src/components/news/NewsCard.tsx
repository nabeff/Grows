'use client'

import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { TextReveal } from '@/components/TextReveal'

const BRAND = '#18CB96'

type Props = {
  href: string
  image?: MediaType | null
  category?: string | null
  title: string
  subtitle?: string | null // "Press release - May 14, 2024"
  className?: string
}

export const NewsCard: React.FC<Props> = ({
  href,
  image,
  category,
  title,
  subtitle,
  className,
}) => {
  const router = useRouter()

  const go = useCallback(() => {
    router.push(href)
  }, [router, href])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      go()
    }
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={onKeyDown}
      aria-label={title}
      className={clsx(
        'group relative overflow-hidden rounded-3xl bg-black cursor-pointer',
        'shadow-[0_10px_25px_rgba(0,0,0,0.12)]',
        'transition-transform duration-300 hover:-translate-y-1',
        className,
      )}
    >
      {/* Arrow circle — pinned top-right */}
      <div
        aria-hidden
        className="absolute top-6 right-6 md:top-7 md:right-7 z-20 shrink-0 grid h-12 w-12 place-items-center rounded-full shadow-lg transition-transform duration-200 group-hover:rotate-[-45deg] group-hover:scale-[1.2]"
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
      </div>
  
      {/* Background image */}
      <div className="absolute inset-0">
        {image ? <Media resource={image} fill imgClassName="object-cover" /> : null}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
      </div>
  
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-7">
        <div className="space-y-3">
          {category ? (
            <p className="text-white/85 text-sm md:text-base font-medium">
              <TextReveal as="span" text={category} />
            </p>
          ) : null}
  
          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight">
            <TextReveal as="span" text={title} />
          </h3>
        </div>
  
        <div className="mt-8">
          {subtitle ? (
            <p className="text-white/90 text-sm md:text-base">
              <TextReveal as="span" text={subtitle} />
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
