'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import type { MarqueeImagesBlock as MarqueeImagesBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

type MediaItem = any

export const MarqueeImagesBlock: React.FC<MarqueeImagesBlockProps> = ({ images }) => {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)

  const xPos = useRef(0)
  const lastScrollY = useRef(0)
  const direction = useRef(1) // 1 = LTR, -1 = RTL
  const speedBoost = useRef(0)

  /* ===== SPEED TUNING ===== */
  const GAP_REM = 2
  const BASE_DURATION = 22 // faster normal
  const BOOST_DURATION = 12 // very fast on scroll
  const BOOST_FORCE = 0.3 // doubled boost
  const FRICTION = 0.88

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

    const onScroll = () => {
      if (!isInView()) return

      const current = window.scrollY
      const delta = current - lastScrollY.current
      lastScrollY.current = current

      if (delta > 0) {
        // scroll down → faster LTR
        direction.current = 1
        speedBoost.current += BOOST_FORCE
      } else if (delta < 0) {
        // scroll up → reverse
        direction.current = -1
        speedBoost.current += BOOST_FORCE
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

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

      const speed =
        baseSpeed + speedBoost.current * (boostSpeed - baseSpeed)

      xPos.current += direction.current * speed * dt

      if (xPos.current <= -wrapWidth) xPos.current += wrapWidth
      if (xPos.current >= 0) xPos.current -= wrapWidth

      el.style.transform = `translate3d(${xPos.current}px, 0, 0)`

      // decay boost
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
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!items.length) return null

  return (
    <section
      ref={sectionRef}
      className="w-full overflow-hidden py-12 select-none"
    >
      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center will-change-transform"
          style={{ gap: `${GAP_REM}rem` }}
        >
          {items.map((img, idx) => (
            <div key={idx} className="shrink-0 overflow-hidden rounded-2xl bg-black/20">
              <div className="relative w-[333px] aspect-[313/422]">
                <Media resource={img} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
