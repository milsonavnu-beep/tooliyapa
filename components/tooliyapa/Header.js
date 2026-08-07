'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import DiceLogo from '@/components/tooliyapa/DiceLogo'

const NAV = [
  { href: '/merge-pdf',    label: 'Merge' },
  { href: '/split-pdf',    label: 'Split' },
  { href: '/compress-pdf', label: 'Compress' },
  { href: '/rotate-pdf',   label: 'Rotate' },
  { href: '/organize-pdf', label: 'Organize' },
  { href: '/jpg-to-pdf',   label: 'JPG→PDF' },
  { href: '/pdf-to-jpg',   label: 'PDF→JPG' },
  { href: '/page-numbers', label: 'Page #' },
  { href: '/watermark',    label: 'Watermark' },
  { href: '/unlock-pdf',   label: 'Unlock' },
]

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label="Toggle theme" className="h-9 w-9">
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Tooliyapa Home">
          <DiceLogo size={40} className="group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold tracking-tight">
            Tooliya<span className="text-red-600">pa</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.slice(0, 7).map((n) => {
            const active = pathname === n.href
            return (
              <Link key={n.href} href={n.href}>
                <Button variant={active ? 'default' : 'ghost'} size="sm" className={active ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>{n.label}</Button>
              </Link>
            )
          })}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <ThemeToggle />
        </nav>

        <div className="flex lg:hidden items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" className="h-9 w-9">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <nav className="container mx-auto px-4 py-3 grid grid-cols-2 gap-2">
            {NAV.map((n) => {
              const active = pathname === n.href
              return (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${active ? 'bg-red-600 text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  {n.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
