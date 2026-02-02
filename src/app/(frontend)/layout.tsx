import type { Metadata } from 'next'
import React from 'react'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'

import { cn } from '@/utilities/ui'
import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'

const SITE_URL = 'https://www.grows.ma'

const saans = localFont({
  src: [
    { path: '../../../public/fonts/Saans-Medium.otf', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/Saans-SemiBold.otf', weight: '600', style: 'normal' },
  ],
  variable: '--font-saans',
  display: 'swap',
})


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(inter.variable, saans.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favico.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Healthcare Consulting & Patient Support in Morocco | Grows',
  description:
    'Grows improves healthcare in Morocco. We offer patient support programs, HEOR studies, and medical events. Partner with us for better patient impact.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@grows_ma',
  },
}
