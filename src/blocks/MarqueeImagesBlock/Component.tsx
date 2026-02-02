// src/blocks/MarqueeImages/Component.tsx
'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import type { MarqueeImagesBlock as MarqueeImagesBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

type MediaItem = any

export const MarqueeImagesBlock: React.FC<MarqueeImagesBlockProps> = ({ images }) => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)

  // marquee motion
  const xPos = useRef(0)
  const lastScrollY = useRef(0)
  const direction = useRef(1) // 1 = LTR, -1 = RTL
  const speedBoost = useRef(0)

  // refs for parallax (move ONLY the image layer)
  const parallaxRefs = useRef<Array<HTMLDivElement | null>>([])

  /* ===== SPEED TUNING ===== */
  const GAP_REM = 2
  const BASE_DURATION = 22
  const BOOST_DURATION = 12
  const BOOST_FORCE = 0.3
  const FRICTION = 0.88

  /* ===== PARALLAX TUNING ===== */
  const PARALLAX_PX = 40 // how much the image shifts inside the card
  const PARALLAX_SCALE = 1.12 // scale up so it can move without showing empty edges

  const items = useMemo(() => {
    const list = (images || []).map((i) => i?.image).filter(Boolean) as MediaItem[]
    return [...list, ...list, ...list]
  }, [images])

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const isInView = () => {
      const el = sectionRef.current
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight
    }

    // ✅ parallax: move the image INSIDE each card (not the whole row)
    let rafParallax = 0
    const updateParallax = () => {
      rafParallax = 0
      const sectionEl = sectionRef.current
      if (!sectionEl) return

      const rect = sectionEl.getBoundingClientRect()
      const vh = window.innerHeight || 0

      const total = rect.height + vh
      const progressed = (vh - rect.top) / (total || 1)
      const clamped = Math.max(0, Math.min(1, progressed))

      // -PARALLAX_PX/2 .. +PARALLAX_PX/2
      const y = (clamped - 0.5) * PARALLAX_PX

      const refs = parallaxRefs.current
      for (let i = 0; i < refs.length; i++) {
        const el = refs[i]
        if (!el) continue

        // tiny depth variation per card (optional but nice)
        const depth = 1 + ((i % 6) - 3) * 0.03 // 0.91..1.09 approx
        el.style.transform = `translate3d(0, ${y * depth}px, 0) scale(${PARALLAX_SCALE})`
      }
    }

    const onScroll = () => {
      if (!isInView()) return

      const current = window.scrollY
      const delta = current - lastScrollY.current
      lastScrollY.current = current

      if (delta > 0) {
        direction.current = 1
        speedBoost.current += BOOST_FORCE
      } else if (delta < 0) {
        direction.current = -1
        speedBoost.current += BOOST_FORCE
      }

      if (rafParallax) return
      rafParallax = window.requestAnimationFrame(updateParallax)
    }

    const onResize = () => {
      updateParallax()
    }

    // first paint
    updateParallax()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    // marquee rAF loop
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const el = trackRef.current
      if (!el) return

      const dt = (now - last) / 1000
      last = now

      const wrapWidth = el.scrollWidth / 3 || 1

      const baseSpeed = wrapWidth / BASE_DURATION
      const boostSpeed = wrapWidth / BOOST_DURATION
      const speed = baseSpeed + speedBoost.current * (boostSpeed - baseSpeed)

      xPos.current += direction.current * speed * dt

      if (xPos.current <= -wrapWidth) xPos.current += wrapWidth
      if (xPos.current >= 0) xPos.current -= wrapWidth

      el.style.transform = `translate3d(${xPos.current}px, 0, 0)`

      speedBoost.current *= FRICTION
      if (speedBoost.current < 0.01) {
        speedBoost.current = 0
        direction.current = 1
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (rafParallax) window.cancelAnimationFrame(rafParallax)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!items.length) return null

  return (
    <section ref={sectionRef} className="w-full overflow-hidden py-12 select-none">
      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center will-change-transform"
          style={{ gap: `${GAP_REM}rem` }}
        >
          {items.map((img, idx) => (
            <div key={idx} className="shrink-0 overflow-hidden rounded-2xl bg-black/20">
              {/* card frame (clipping) */}
              <div className="relative w-[233px]  md:w-[333px] aspect-[313/422] overflow-hidden">
                {/* ✅ parallax layer moves inside the clipped frame */}
                <div
                  ref={(el) => {
                    parallaxRefs.current[idx] = el
                  }}
                  className="absolute inset-0 will-change-transform"
                  style={{ transform: `translate3d(0, 0, 0) scale(${PARALLAX_SCALE})` }}
                >
                  <Media resource={img} fill className="object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarqueeImagesBlock
