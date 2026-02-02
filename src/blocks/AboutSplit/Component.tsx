// src/blocks/AboutSplit/Component.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { Media } from '@/components/Media'
import type { AboutSplitBlock as Props, Media as MediaType } from '@/payload-types'
import { TextReveal } from '@/components/TextReveal'

export const AboutSplitBlock: React.FC<Props> = ({ image, title, text }) => {
  const img = image as MediaType | null

  const sectionRef = useRef<HTMLElement | null>(null)
  const imgWrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sectionEl = sectionRef.current
    const imgWrapEl = imgWrapRef.current
    if (!sectionEl || !imgWrapEl) return

    let raf = 0

    const update = () => {
      raf = 0
      const rect = sectionEl.getBoundingClientRect()
      const vh = window.innerHeight || 0

      // progress: 0 when section top hits bottom of viewport, 1 when section bottom hits top of viewport
      const total = rect.height + vh
      const progressed = (vh - rect.top) / (total || 1)
      const clamped = Math.max(0, Math.min(1, progressed))

      // tweak strength here
      const offset = (clamped - 0.5) * 100 // px
      imgWrapEl.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    const onScrollOrResize = () => {
      if (raf) return
      raf = window.requestAnimationFrame(update)
    }

    onScrollOrResize()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="container py-12 lg:py-16 mt-[80px] overflow-hidden">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
        {/* Left image (565/565) */}
        <div className="min-w-0 relative overflow-hidden rounded-[28px] bg-black/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
          <div className="relative aspect-square w-full overflow-hidden">
            {/* Parallax layer - negative inset creates overflow for parallax movement */}
            <div
              ref={imgWrapRef}
              className="absolute -inset-[60px] will-change-transform"
              style={{ transform: 'translate3d(0, 0, 0)' }}
            >
              {img ? <Media resource={img} fill imgClassName="object-cover" /> : null}
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="min-w-0 max-w-2xl flex flex-col justify-center">
          {title ? (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold w-full tracking-tight text-black">
              <TextReveal as="span" text={title} />
            </h1>
          ) : null}

          {text ? (
            <div className="mt-6 space-y-6 text-base md:text-lg leading-relaxed text-black/80 w-full">
              {String(text)
                .split('\n')
                .filter((p) => p.trim().length > 0)
                .map((p, i) => (
                  <p key={i} className="min-w-0">
                    <TextReveal as="span" text={p} />
                  </p>
                ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default AboutSplitBlock
