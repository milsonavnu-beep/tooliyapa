'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function AdSenseScript() {
  const pathname = usePathname()

  if (pathname === '/privacy') return null

  return (
    <Script
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5475600467474553"
      crossOrigin="anonymous"
    />
  )
}
