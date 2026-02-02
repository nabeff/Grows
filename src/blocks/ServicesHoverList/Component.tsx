'use client'

import React, { useMemo } from 'react'
import type { ServicesHoverListBlock as ServicesHoverListBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { TextReveal } from '@/components/TextReveal'

export const ServicesHoverListBlock: React.FC<ServicesHoverListBlockProps> = ({
  title,
  intro,
  services,
  minHeight,
}) => {
  const items = useMemo(() => services || [], [services])
  const resolvedMinHeight = minHeight ?? 520

  if (!items.length) return null

  return (
    <section className="w-full" style={{ backgroundColor: '#E9FBF5' }}>
      <div className="container py-16 lg:py-20">
        {/* Top title + intro */}
        <div className="max-w-3xl">
          {title && (
            <h2 className="font-heading text-3xl md:text-5xl lg:text-7xl leading-tight text-black font-bold">
              <TextReveal as="span" text={title} />
            </h2>
          )}

          {intro && (
            <p className="mt-6 text-base lg:text-lg text-black">
              <TextReveal as="span" text={intro} />
            </p>
          )}
        </div>

        {/* List */}
        <div className="mt-14" style={{ minHeight: resolvedMinHeight }}>
          <ul className="divide-y divide-black/10">
            {items.map((item, i) => {
              return (
                <li key={item.id || i} className="group relative py-10 lg:py-12">
                  {/* Big list title (always visible) */}
                  <div
                    className={cn(
                      'w-full text-left text-black',
                      'font-heading font-bold text-2xl md:text-3xl lg:text-4xl max-w-2xl leading-[1.05]',
                      'transition-opacity duration-300',
                      'group-hover:opacity-25',
                    )}
                  >
                    <TextReveal as="span" text={item?.name ?? ''} />
                  </div>

                  {/* Overlay panel (hover-only) */}
                  <div
                    className={cn(
                      'absolute inset-0 pointer-events-none',
                      'opacity-0 group-hover:opacity-100',
                      'transition-opacity duration-200',
                    )}
                  >
                    {/* Background wipe */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className={cn(
                          'absolute inset-0 bg-[#BFF1E5]',
                          'origin-left scale-x-0 group-hover:scale-x-100',
                          'transition-transform duration-500',
                          'ease-[cubic-bezier(0.22,1,0.36,1)]',
                        )}
                      />
                    </div>

                    {/* Content reveal */}
                    <div
                      className={cn(
                        'relative h-full w-full flex items-center px-6 md:px-10',
                        'translate-y-2 opacity-0',
                        'group-hover:translate-y-0 group-hover:opacity-100',
                        'transition-all duration-400',
                        'ease-[cubic-bezier(0.22,1,0.36,1)]',
                      )}
                    >
                      <div className="w-full">
                        {item?.eyebrow && (
                          <p
                            className={cn(
                              'font-heading font-semibold text-sm text-black/80',
                              'translate-y-1 opacity-0',
                              'group-hover:translate-y-0 group-hover:opacity-100',
                              'transition-all duration-500 delay-75',
                              'ease-[cubic-bezier(0.22,1,0.36,1)]',
                            )}
                          >
                            <TextReveal as="span" text={item.eyebrow} />
                          </p>
                        )}

                        {item?.description && (
                          <p
                            className={cn(
                              'mt-3 text-sm md:text-xl text-black leading-relaxed max-w-xl',
                              'translate-y-1 opacity-0',
                              'group-hover:translate-y-0 group-hover:opacity-100',
                              'transition-all duration-500 delay-100',
                              'ease-[cubic-bezier(0.22,1,0.36,1)]',
                            )}
                          >
                            <TextReveal as="span" text={item.description} />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
