'use client'

import React, { useEffect } from 'react'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import type { Header as HeaderType } from '@/payload-types'

type Props = {
  open: boolean
  onClose: () => void
  data: HeaderType
}

export function MobileMenu({ open, onClose, data }: Props) {
  // lock body scroll when open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const navItems = data?.navItems || []
  const cta = data?.cta?.link

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60]',
        'transition-opacity duration-300 ease-in-out',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm',
          'transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* Panel (full width + full height) */}
      <div
        className={cn(
          'absolute inset-0 bg-black text-white',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="container h-full py-6 flex flex-col">
          {/* Top row */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'h-11 w-11 grid place-items-center rounded-full',
                'bg-white/10 hover:bg-white/15 transition-colors',
              )}
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M18 6L6 18"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d="M6 6l12 12"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Links */}

          <div className="flex flex-col justify-evenly h-full">
            <nav className="mt-10 flex flex-col gap-6 items-center">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  {...(link as any)}
                  onClick={onClose as any}
                  className={cn(
                    'text-4xl font-bold leading-tight',
                    'text-white hover:text-white/80 transition-colors',
                  )}
                />
              ))}
            </nav>

            {/* CTA at bottom */}
            <div className=" pt-10 w-full flex justify-center">
              {cta ? (
                <CMSLink
                  {...(cta as any)}
                  onClick={onClose as any}
                  className={cn(
                    'w-fit inline-flex justify-center',
                    'rounded-full py-2 text-base font-semibold',
                  )}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
