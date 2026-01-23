import React from 'react'
import Link from 'next/link'

import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer as FooterType, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()

  const logo = footerData?.logo as MediaType | null
  const columns = footerData?.columns || []
  const social = footerData?.social || []
  const bottomText = footerData?.bottomText
  const bottomLinks = footerData?.bottomLinks || []

  return (
    <footer className="mt-auto bg-white text-black">
      <div className="container py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* LEFT */}
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center">
              {logo ? (
                <div className="relative w-[360px] max-w-full">
                  <Media resource={logo} imgClassName="h-auto w-full object-contain" />
                </div>
              ) : null}
            </Link>

            {footerData?.tagline ? (
              <p className="mt-3 text-4xl font-light tracking-wide">{footerData.tagline}</p>
            ) : null}

            {footerData?.description ? (
              <p className="mt-10 max-w-md text-base leading-relaxed text-black/80">
                {footerData.description}
              </p>
            ) : null}

            {social.length ? (
              <div className="mt-10 flex items-center gap-4">
                {social.map((item, i) => {
                  const icon = (item.icon as MediaType) || null

                  return (
                    <CMSLink
                      key={i}
                      {...(item.link as any)}
                      className="inline-flex h-14 w-14 items-center justify-center rounded-xl transition hover:bg-black/5"
                      aria-label="Social"
                    >
                      {icon ? (
                        <span className="pointer-events-none relative h-8 w-8">
                          <Media resource={icon} imgClassName="h-full w-full object-contain" />
                        </span>
                      ) : null}
                    </CMSLink>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* RIGHT */}
          <div className="flex items-start gap-12">
            {columns.map((col, idx) => (
              <div key={idx}>
                <h4 className="text-xl font-bold">{col.title}</h4>

                <div className="mt-6 flex flex-col gap-3">
                  {(col.links || []).map((l, i) => (
                    <CMSLink
                      key={i}
                      {...(l.link as any)}
                      className="text-base text-black hover:underline"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-12 h-px w-full bg-black/20" />

        {/* BOTTOM */}
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {bottomText ? <p className="text-sm font-light">{bottomText}</p> : <span />}

          <div className="flex flex-wrap items-center gap-3 text-base font-semibold">
            {bottomLinks.map((l, i) => (
              <CMSLink
                key={i}
                {...(l.link as any)}
                className="underline underline-offset-4 hover:no-underline"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
