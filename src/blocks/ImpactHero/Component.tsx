// src/blocks/ImpactHero/Component.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { Media } from '@/components/Media'
import type { ImpactHeroBlock as Props, Media as MediaType } from '@/payload-types'
import { TextReveal } from '@/components/TextReveal'

export const ImpactHeroBlock: React.FC<Props> = ({ backgroundImage, title, text }) => {
  const bg = backgroundImage as MediaType | null

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

      const total = rect.height + vh
      const progressed = (vh - rect.top) / (total || 1)
      const clamped = Math.max(0, Math.min(1, progressed))

      const offset = (clamped - 0.5) * 200

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
    <section ref={sectionRef} className="relative w-full overflow-hidden my-10">
      <div className="relative min-h-[420px] md:min-h-[520px] lg:min-h-[620px]">
        {/* Parallax image layer - negative inset creates overflow for parallax movement */}
        <div
          ref={imgWrapRef}
          className="absolute -inset-[120px] will-change-transform"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {bg ? <Media resource={bg} fill imgClassName="object-cover" /> : null}
        </div>

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* content */}
        <div className="relative container mx-auto flex min-h-[420px] md:min-h-[520px] lg:min-h-[620px] items-center justify-center px-4">
          <div className="text-center text-white max-w-5xl w-full">
            {text ? (
              <h2 className="text-2xl md:text-3xl lg:text-6xl font-bold leading-tight">
                <TextReveal as="span" text={text} />
              </h2>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImpactHeroBlock
