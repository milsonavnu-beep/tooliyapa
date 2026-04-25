'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FileText, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/merge-pdf', label: 'Merge' },
  { href: '/split-pdf', label: 'Split' },
  { href: '/compress-pdf', label: 'Compress' },
  { href: '/rotate-pdf', label: 'Rotate' },
  { href: '/organize-pdf', label: 'Organize' },
  { href: '/jpg-to-pdf', label: 'JPG→PDF' },
  { href: '/pdf-to-jpg', label: 'PDF→JPG' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" className="h-9 w-9">
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}

export default function Header() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="Tooliyapa Home">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Tooliya<span className="text-red-600">pa</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map((n) => {
            const active = pathname === n.href
            return (
              <Link key={n.href} href={n.href}>
                <Button variant={active ? 'default' : 'ghost'} size="sm" className={active ? 'bg-red-600 hover:bg-red-700 text-white' : ''}>
                  {n.label}
                </Button>
              </Link>
            )
          })}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <ThemeToggle />
        </nav>
        <div className="md:hidden"><ThemeToggle /></div>
      </div>
    </header>
  )
}
