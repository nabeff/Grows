import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Event } from '../payload-types'

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  const path = `/events/${doc.slug}`
  payload.logger.info(`Revalidating event at path: ${path}`)
  revalidatePath(path)
  revalidatePath('/events')
  revalidatePath('/')
  revalidateTag('events-sitemap')

  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    const oldPath = `/events/${previousDoc.slug}`
    payload.logger.info(`Revalidating old event at path: ${oldPath}`)
    revalidatePath(oldPath)
  }

  return doc
}

export const revalidateEventDelete: CollectionAfterDeleteHook<Event> = ({
  doc,
  req: { context },
}) => {
  if (context.disableRevalidate) return doc

  if (doc?.slug) revalidatePath(`/events/${doc.slug}`)
  revalidatePath('/events')
  revalidatePath('/')
  revalidateTag('events-sitemap')

  return doc
}
