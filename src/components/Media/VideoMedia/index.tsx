'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: video } = videoRef
    if (!video) return

    const onSuspend = () => {
      // Video loading was suspended (often due to network / resource constraints)
      // Keeping this for debugging hooks if needed later.
    }

    video.addEventListener('suspend', onSuspend)
    return () => video.removeEventListener('suspend', onSuspend)
  }, [])

  if (resource && typeof resource === 'object') {
    const { url, mimeType, filename } = resource as any

    // Prefer Payload-provided URL (works across environments).
    // Fallback to common Payload file route patterns (adjust if your config differs).
    const src =
      (typeof url === 'string' && url.length > 0 && getMediaUrl(url)) ||
      getMediaUrl(`/api/media/file/${filename}`) ||
      getMediaUrl(`/media/${filename}`)

    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        onClick={onClick}
        ref={videoRef}
        className={cn('absolute inset-0 w-full h-full object-cover', videoClassName)}
      >
        <source src={src} type={mimeType ?? 'video/mp4'} />
      </video>
    )
  }

  return null
}
