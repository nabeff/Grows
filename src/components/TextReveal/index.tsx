'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/utilities/ui'

gsap.registerPlugin(ScrollTrigger)

type AllowedTags = 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type TextRevealProps = {
  text: string | string[]
  className?: string
  as?: AllowedTags
}

const DEFAULTS = {
  start: 'top 85%',
  once: true,
  delay: 0.2,
  duration: 1.2,
  staggerAmount: 0.25,
  skewY: 7,
  y: 100,
  lineClassName: 'h-[1.25em]',
} as const

export const TextReveal: React.FC<TextRevealProps> = ({ text, className, as = 'div' }) => {
  const rootRef = useRef<HTMLElement | null>(null)
  const measureRef = useRef<HTMLSpanElement | null>(null)
  const [lines, setLines] = useState<string[]>([])

  const raw = useMemo(() => {
    if (Array.isArray(text)) return text.filter(Boolean)
    return String(text || '')
  }, [text])

  // Build lines (array, \n, or auto-wrap by width)
  useEffect(() => {
    const el = rootRef.current
    const measurer = measureRef.current
    if (!el || !measurer) return

    const compute = () => {
      // If already array => use as-is
      if (Array.isArray(raw)) {
        setLines(raw.filter(Boolean))
        return
      }

      const str = String(raw).trim()
      if (!str) {
        setLines([])
        return
      }

      // If user provided explicit lines
      if (str.includes('\n')) {
        setLines(
          str
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean),
        )
        return
      }

      // Auto-wrap into lines by available width
      const width = el.getBoundingClientRect().width
      if (!width) {
        setLines([str])
        return
      }

      const words = str.split(/\s+/).filter(Boolean)
      const out: string[] = []
      let current = ''

      // Ensure measurer is single-line
      measurer.style.whiteSpace = 'nowrap'

      for (const w of words) {
        const candidate = current ? `${current} ${w}` : w
        measurer.textContent = candidate

        const candidateWidth = measurer.getBoundingClientRect().width

        if (candidateWidth <= width) {
          current = candidate
        } else {
          if (current) out.push(current)
          // start new line with the word
          current = w
        }
      }

      if (current) out.push(current)

      setLines(out.length ? out : [str])
    }

    compute()

    const ro = new ResizeObserver(() => compute())
    ro.observe(el)

    return () => ro.disconnect()
  }, [raw])

  // Animate when in view
  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const spans = el.querySelectorAll<HTMLElement>('[data-reveal-span]')
    if (!spans.length) return

    gsap.set(spans, { y: DEFAULTS.y, skewY: DEFAULTS.skewY, opacity: 1 })

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: DEFAULTS.start,
            once: DEFAULTS.once,
          },
        })
        .to(spans, {
          y: 0,
          skewY: 0,
          ease: 'power4.out',
          duration: DEFAULTS.duration,
          delay: DEFAULTS.delay,
          stagger: { amount: DEFAULTS.staggerAmount },
        })
    }, el)

    return () => ctx.revert()
  }, [lines.length])

  const Tag = as as any

  return (
    <Tag ref={rootRef} className={cn(className, 'relative block w-full')}>
      {/* hidden measurer (inherits font styles because it's inside same element) */}
      <span
        ref={measureRef}
        className="pointer-events-none absolute -left-[9999px] top-0 opacity-0"
        aria-hidden="true"
      />

      {lines.map((line, idx) => (
        <span key={idx} className={cn('relative block overflow-hidden', DEFAULTS.lineClassName)}>
          <span
            data-reveal-span
            className="block will-change-transform whitespace-nowrap"
            style={{ display: 'inline-block' }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
