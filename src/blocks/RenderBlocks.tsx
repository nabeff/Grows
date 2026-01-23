import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { HeroImageTitleBlock } from './HeroImageTitleBlock/Component'
import { MarqueeImagesBlock } from './MarqueeImagesBlock/Component'
import { CenteredTextBlock } from './CenteredText/Component'
import { ServicesHoverListBlock } from './ServicesHoverList/Component'
import EventsUpcomingBlock from './EventsUpcoming/Component'
import EventsListingBlock from './EventsListing/Component'
import ImpactHeroBlock from './ImpactHero/Component'
import PostsCarouselBlock from './PostsCarousel/Component'
import AboutSplitBlock from './AboutSplit/Component' // ✅ add
import MissionTextBlock from './MissionText/Component'
import TreatmentsAccordionBlock from './TreatmentsAccordion/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  heroImageTitle: HeroImageTitleBlock,
  marqueeImages: MarqueeImagesBlock,
  centeredText: CenteredTextBlock,
  servicesHoverList: ServicesHoverListBlock,
  eventsListing: EventsListingBlock,
  eventsUpcoming: EventsUpcomingBlock,
  impactHero: ImpactHeroBlock,
  postsCarousel: PostsCarouselBlock,
  aboutSplit: AboutSplitBlock,
    missionText: MissionTextBlock,
treatmentsAccordion: TreatmentsAccordionBlock
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
