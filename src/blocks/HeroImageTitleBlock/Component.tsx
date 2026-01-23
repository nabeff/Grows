import React from 'react'
import type { HeroImageTitleBlock as HeroImageTitleBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const HeroImageTitleBlock: React.FC<HeroImageTitleBlockProps> = ({
  backgroundImage,
  title,
  title2,
}) => {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden ">
      {backgroundImage && (
        <Media
          resource={backgroundImage}
          htmlElement={null}
          videoClassName="absolute inset-0 w-full h-full object-cover"
          className="absolute inset-0"
        />
      )}

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative h-full">
        <div className="container h-full flex flex-col items-center justify-end pb-10 md:pb-14 lg:pb-16 gap-4 text-center">
          <h1 className="text-white font-semibold leading-tight text-4xl md:text-6xl lg:text-7xl max-w-5xl">
            {title}
          </h1>
          <p className="text-white  leading-tight text-xl md:text-4xl lg:text-xl max-w-5xl">
            {title2}
          </p>
        </div>
      </div>
    </section>
  )
}
