// src/blocks/AboutSplit/Component.tsx
import React from 'react'
import { Media } from '@/components/Media'
import type { AboutSplitBlock as Props, Media as MediaType } from '@/payload-types'

export const AboutSplitBlock: React.FC<Props> = ({ image, title, text }) => {
  const img = image as MediaType | null

  return (
    <section className="container py-12 lg:py-16 mt-[80px]">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* Left image (565/565) */}
        <div className="relative overflow-hidden rounded-[28px] bg-black/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
          <div className="relative aspect-square w-full">
            {img ? <Media resource={img} fill imgClassName="object-cover" /> : null}
          </div>
        </div>

        {/* Right content */}
        <div className="max-w-2xl">
          {title ? (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-black">
              {title}
            </h2>
          ) : null}

          {text ? (
            <div className="mt-6 space-y-6 text-base md:text-lg leading-relaxed text-black/80">
              {String(text)
                .split('\n')
                .filter((p) => p.trim().length > 0)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default AboutSplitBlock
