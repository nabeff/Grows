'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import type { Header } from '@/payload-types'
import { Media } from '@/components/Media'
import { HeaderNav } from './Nav'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const lastScrollY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  const forceBlack = useMemo(() => {
    const rules = (data as any)?.forceBlackOn || []
    const current = pathname || '/'

    return rules.some((r: any) => {
      const rule = (r?.path || '').trim()
      if (!rule) return false

      if (rule === '*') return true

      if (rule.endsWith('/*')) {
        const prefix = rule.slice(0, -2)
        return current === prefix || current.startsWith(prefix + '/')
      }

      return current === rule
    })
  }, [data, pathname])

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const onScroll = () => {
      // throttle to animation frame for smoother transitions
      if (rafId.current) return

      rafId.current = window.requestAnimationFrame(() => {
        const currentY = window.scrollY
        const goingDown = currentY > lastScrollY.current
        const delta = Math.abs(currentY - lastScrollY.current)

        // smooth background trigger
        setScrolled(currentY > 10)

        // ignore tiny scroll noise
        if (delta >= 8) {
          if (currentY < 20) setHidden(false)
          else setHidden(goingDown)
        }

        lastScrollY.current = currentY
        rafId.current = null
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId.current) window.cancelAnimationFrame(rafId.current)
    }
  }, [])

  const headerIsDarkGlass = forceBlack || scrolled

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full',
        // ✅ one transition for EVERYTHING we change
        'will-change-[transform,background-color,backdrop-filter]',
        'transition-[transform,background-color,backdrop-filter] duration-500 ease-in-out',
        hidden ? '-translate-y-full' : 'translate-y-0',
        headerIsDarkGlass
          ? 'bg-black/60 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent backdrop-blur-0 border-b border-transparent',
      )}
    >
      <div className="container">
        <div className="relative py-5 md:py-6 flex items-center justify-between">
          <Link href="/" className="relative shrink-0">
            {data.logo && (
              <Media resource={data.logo} priority className="h-10 w-auto object-contain" />
            )}
          </Link>

          <div className="flex items-center gap-8">
            <HeaderNav data={data} />
            {data?.cta?.link && <CMSLink {...data.cta.link} />}
          </div>
        </div>
      </div>
    </header>
  )
}
