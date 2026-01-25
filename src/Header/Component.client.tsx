// src/Header/Component.client.tsx
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
import { MobileMenu } from './MobileMenu' // ✅ add

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // ✅ mobile menu
  const [mobileOpen, setMobileOpen] = useState(false)

  const lastScrollY = useRef(0)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  // ✅ close menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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
      if (rafId.current) return

      rafId.current = window.requestAnimationFrame(() => {
        const currentY = window.scrollY
        const goingDown = currentY > lastScrollY.current
        const delta = Math.abs(currentY - lastScrollY.current)

        setScrolled(currentY > 10)

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
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full',
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
              {/* Desktop CTA */}
              <div className="hidden md:block">
                {data?.cta?.link && <CMSLink {...data.cta.link} />}
              </div>
              {/* Mobile burger */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={cn(
                  'md:hidden h-11 w-11 grid place-items-center rounded-full',
                  headerIsDarkGlass
                    ? 'bg-white/10 hover:bg-white/15'
                    : 'bg-black/10 hover:bg-black/15',
                  'transition-colors',
                )}
                aria-label="Open menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    fill="none"
                    stroke="white" // ✅ always white
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ Full screen mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} data={data} />
    </>
  )
}
