'use client'

import React from 'react'
import type { CenteredTextBlock as CenteredTextBlockProps } from '@/payload-types'
import { TextReveal } from '@/components/TextReveal'

export const CenteredTextBlock: React.FC<CenteredTextBlockProps> = ({ text }) => {
  if (!text) return null

  return (
    <section className="w-full py-12 mb-12">
      <div className="flex items-center justify-center px-4">
        <h2 className="font-heading text-black text-center text-3xl sm:text-4xl lg:text-4xl leading-tight w-full max-w-3xl">
          <TextReveal as="span" text={text} />
        </h2>
      </div>
    </section>
  )
}
