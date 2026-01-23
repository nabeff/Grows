import React from 'react'
import type { MissionTextBlock as Props } from '@/payload-types'

const MissionTextBlock: React.FC<Props> = ({ text }) => {
  return (
    <section className="bg-[#E9FBF5]">
      <div className="container py-16 md:py-20 lg:py-32 flex justify-center">
        <p className="m-0 text-center text-3xl sm:text-4xl md:text-4xl  font-bold leading-[1.08] text-black  max-w-3xl">
          {text}
        </p>
      </div>
    </section>
  )
}

export default MissionTextBlock
