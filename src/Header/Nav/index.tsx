// src/Header/Nav.tsx
'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map(({ link }, i) => (
        <CMSLink key={i} {...link} />
      ))}
    </nav>
  )
}
