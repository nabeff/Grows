'use client'

import React from 'react'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'

type LogoItem = { logo: any }

type Props = {
  logos?: LogoItem[] | null
  speedSeconds?: number | null
}

export const TextMarqueeBlock: React.FC<Props> = ({ logos, speedSeconds }) => {
  const duration = typeof speedSeconds === 'number' && speedSeconds > 0 ? speedSeconds : 28
  const list = Array.isArray(logos) ? logos : []
  const track = [...list, ...list]

  if (!list.length) return null

  return (
    <section className="w-full overflow-hidden my-2">
      <div className="relative py-16">
        <div className="py-6 md:py-12 border-[0.5px] border-black/20">
          <div
            className="flex w-max items-center gap-16 md:gap-24 lg:gap-32 will-change-transform"
            style={{ animation: `logos-marquee-ltr ${duration}s linear infinite` }}
          >
            {track.map((item, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-center',
                  'h-20 md:h-24 lg:h-28',
                  'opacity-90 hover:opacity-100 transition-opacity',
                )}
              >
                <Media
                  resource={item.logo}
                  className="h-full w-auto"
                  imgClassName="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes logos-marquee-ltr {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
        `}</style>
      </div>
    </section>
  )
}

export default TextMarqueeBlock
