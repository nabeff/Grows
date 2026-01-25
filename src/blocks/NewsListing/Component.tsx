import React from 'react'
import type { NewsListingBlock as Props } from '@/payload-types'
import NewsListingClient from './NewsListingClient'
import { TextReveal } from '@/components/TextReveal'

function getText(v: unknown): string {
  if (typeof v === 'string' || typeof v === 'number') return String(v)
  return ''
}

export const NewsListingBlock: React.FC<Props> = ({ title, text }) => {
  const resolvedTitle = getText(title)
  const resolvedText = getText(text)

  return (
    <section className="container py-12 lg:py-16 text-black">
      {/* Title */}
      {resolvedTitle ? (
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none">
          <TextReveal as="span" text={resolvedTitle} />
        </h1>
      ) : null}

      {/* Text */}
      {resolvedText ? (
        <p className="mt-6 max-w-3xl text-base md:text-lg text-black/70">
          <TextReveal as="span" text={resolvedText} />
        </p>
      ) : null}

      {/* Filter + Grid + Pagination */}
      <NewsListingClient />
    </section>
  )
}

export default NewsListingBlock
