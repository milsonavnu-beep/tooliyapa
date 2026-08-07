'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Menu, X, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import DiceLogo from '@/components/tooliyapa/DiceLogo'
import ToolSearch from '@/components/tooliyapa/ToolSearch'
import { getFeaturedTools, getNavTools } from '@/lib/tools/registry'
import { getActiveCategories } from '@/lib/tools/categories'

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="h-9 w-9"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const categories = getActiveCategories()
  const featured = getFeaturedTools().slice(0, 4)
  const allNav = getNavTools()

  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded-md focus:shadow focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Tooliyapa Home">
          <DiceLogo size={40} className="group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold tracking-tight">
            Tooliya<span className="text-red-600">pa</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
          {categories.map((cat) => {
            const active = pathname === cat.href || pathname.startsWith(`${cat.href}/`)
            return (
              <Link key={cat.id} href={cat.href}>
                <Button
                  variant={active ? 'default' : 'ghost'}
                  size="sm"
                  className={active ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                >
                  {cat.name}
                </Button>
              </Link>
            )
          })}
          {featured.map((n) => {
            const active = pathname === n.href
            return (
              <Link key={n.href} href={n.href}>
                <Button
                  variant={active ? 'default' : 'ghost'}
                  size="sm"
                  className={active ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                >
                  {n.navLabel || n.name}
                </Button>
              </Link>
            )
          })}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Open tool search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="w-4 h-4" />
          </Button>
          <ThemeToggle />
        </nav>

        <div className="flex lg:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Open tool search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="w-4 h-4" />
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="h-9 w-9"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 py-3 max-w-2xl">
            <ToolSearch compact autoFocus placeholder="Search tools…" onNavigate={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <nav className="container mx-auto px-4 py-3 grid grid-cols-2 gap-2" aria-label="Mobile">
            {categories.map((cat) => {
              const active = pathname === cat.href
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition col-span-2 ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
            {allNav.map((n) => {
              const active = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {n.navLabel || n.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
