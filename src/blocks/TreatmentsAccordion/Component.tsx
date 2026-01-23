// src/blocks/TreatmentsAccordion/Component.tsx
'use client'

import React, { useMemo, useState } from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType, TreatmentsAccordionBlock as Props } from '@/payload-types'

export const TreatmentsAccordionBlock: React.FC<Props> = ({ image, title, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items])
  const bg = image as MediaType | null

  return (
    <section className="container py-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT: Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          {bg ? <Media resource={bg} fill imgClassName="object-cover" /> : null}
        </div>

        {/* RIGHT: Title + Accordion */}
        <div className="flex flex-col justify-between text-black">
          {title ? (
            <h2 className="mb-10 text-2xl md:text-3xl lg:text-6xl font-bold ">{title}</h2>
          ) : null}

          <div className="w-full">
            {safeItems.map((it, idx) => {
              const isOpen = openIndex === idx
              const label = typeof it?.label === 'string' ? it.label : ''
              const text = typeof it?.text === 'string' ? it.text : ''

              return (
                <div key={idx} className="border-b border-[#18CB96]/20">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    onMouseEnter={() => setOpenIndex(idx)}
                    onFocus={() => setOpenIndex(idx)}
                    onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg md:text-xl font-bold">{label}</span>

                    <span className="flex h-8 w-8 items-center justify-center bg-[#18CB96] p-2 rounded-full">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        aria-hidden
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                      >
                        <path
                          d="M7 17L17 7"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 7h10v10"
                          fill="none"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-6 text-base md:text-lg text-black/80">{text}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TreatmentsAccordionBlock
