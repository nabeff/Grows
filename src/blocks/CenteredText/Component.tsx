'use client'

import React from 'react'
import type { CenteredTextBlock as CenteredTextBlockProps } from '@/payload-types'

export const CenteredTextBlock: React.FC<CenteredTextBlockProps> = ({ text }) => {
  if (!text) return null

  return (
    <section className="w-full py-12 mb-12">
      <div className="flex items-center justify-center px-4">
        <h2 className="font-heading text-black text-center text-3xl sm:text-4xl lg:text-3xl leading-tight max-w-3xl">
          {text}
        </h2>
      </div>
    </section>
  )
}
