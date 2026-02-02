'use client'

import React from 'react'
import type {
  ContactSplitBlock as ContactSplitBlockProps,
  Media as MediaType,
} from '@/payload-types'
import { Media } from '@/components/Media'
import { FormBlock } from '@/blocks/Form/Component'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const ContactSplitBlock: React.FC<ContactSplitBlockProps> = (props) => {
  const { title, intro, image, form, enableIntro, introContent, phones, email, social } = props

  const media = image as MediaType | null

  // ✅ fix types for FormBlock
  const resolvedEnableIntro = Boolean(enableIntro)
  const resolvedIntroContent =
    introContent && typeof introContent === 'object'
      ? (introContent as DefaultTypedEditorState)
      : undefined

  return (
    <section className="w-full ">
      <div className="container py-16 lg:py-20">
        {/* <h1 className="font-heading font-bold text-black leading-[0.95] text-6xl sm:text-7xl lg:text-[84px]">
          {title}
        </h1> */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT */}
          <div>
            {intro && <p className="mt-6 max-w-sm text-black/80 text-sm">{intro}</p>}

            {media && (
              <div className="mt-8 overflow-hidden rounded-2xl">
                <div className="relative w-full aspect-[1/1]">
                  <Media resource={media} fill className="object-cover" priority />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-evenly gap-4">
            <h1 className="font-heading font-bold text-black leading-[0.95] text-3xl md:text-5xl lg:text-6xl ">
              {title}
            </h1>
            <div className="">
              <FormBlock
                enableIntro={resolvedEnableIntro}
                introContent={resolvedIntroContent}
                form={form as any}
              />
            </div>

            <div className="flex flex-col gap-2">
              {Array.isArray(phones) && phones.length > 0 && (
                <div className="space-y-1 text-sm text-black/70">
                  {phones.map((p, i) => (
                    <div key={i}>{p?.phone}</div>
                  ))}
                </div>
              )}

              {email && <div className="font-heading font-bold text-black text-lg">{email}</div>}

              {social?.link && (
                <div>
                  <CMSLink
                    {...social.link}
                    appearance="inline"
                    className="u-underline text-black"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
