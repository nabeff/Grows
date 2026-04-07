'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Media } from '@/components/Media'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { Media as MediaType } from '@/payload-types'

type GalleryItem = {
  image: MediaType
  id?: string | null
}

const isVideo = (media: MediaType) => media.mimeType?.includes('video')

export const EventGallery: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open = (index: number) => setLightboxIndex(index)
  const close = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === 0 ? items.length - 1 : lightboxIndex - 1)
  }, [lightboxIndex, items.length])

  const next = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex(lightboxIndex === items.length - 1 ? 0 : lightboxIndex + 1)
  }, [lightboxIndex, items.length])

  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightboxIndex, prev, next])

  if (!items.length) return null

  const currentMedia = lightboxIndex !== null ? items[lightboxIndex]?.image : null

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const video = isVideo(item.image)
          return (
            <button
              key={item.id || index}
              onClick={() => open(index)}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18CB96]"
            >
              <Media
                resource={item.image}
                imgClassName="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                videoClassName="object-cover w-full h-full pointer-events-none"
                fill
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 z-10 bg-black/0 transition-all duration-300 group-hover:bg-black/30 flex items-end justify-center">
                <span className="text-white text-sm font-medium pb-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  View {video ? 'video' : 'photo'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && currentMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-2 sm:left-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Content */}
          <div
            className="mx-16 sm:mx-20 flex items-center justify-center"
            style={{ width: '85vw', height: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(currentMedia) ? (
              <video
                key={lightboxIndex}
                controls
                autoPlay
                playsInline
                className="max-h-[85vh] max-w-[85vw] rounded-lg"
              >
                <source
                  src={getMediaUrl(currentMedia.url)}
                  type={currentMedia.mimeType || 'video/mp4'}
                />
              </video>
            ) : (
              <div className="relative w-full h-full">
                <ImageMedia
                  resource={currentMedia}
                  fill
                  imgClassName="rounded-lg object-contain"
                  size="85vw"
                  priority
                />
              </div>
            )}
          </div>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-2 sm:right-4 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
            {lightboxIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </>
  )
}
