'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import ToolSearch from '@/components/tooliyapa/ToolSearch'
import { PDF_TOOLS } from '@/lib/tools'

const FUTURE_CATEGORIES = ['Documents', 'Text', 'Converters']

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-11 w-11" />
  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark'
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} className="h-11 w-11 rounded-xl focus-visible:ring-teal-600">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const pdfMenuRef = useRef(null)
  const mobileMenuButtonRef = useRef(null)

  useEffect(() => {
    setOpen(false)
    if (pdfMenuRef.current) pdfMenuRef.current.open = false
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        mobileMenuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [open])

  const closePdfMenu = () => {
    if (pdfMenuRef.current) pdfMenuRef.current.open = false
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow">Skip to main content</a>
      <div className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between gap-5 px-4 sm:px-6">
        <Link href="/" className="relative h-11 w-[158px] shrink-0 overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:w-[174px]" aria-label="Tooliyapa home">
          <Image src="/branding/tooliyapa_logo_primary.png" alt="Tooliyapa" width={1254} height={1254} className="absolute left-0 top-1/2 h-auto w-full -translate-y-1/2 object-contain" sizes="(max-width: 640px) 158px, 174px" priority />
        </Link>

        <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Link href="/" className="rounded-lg px-3 py-2 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:hover:bg-slate-800">All Tools</Link>
          <details ref={pdfMenuRef} className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-lg px-3 py-2 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:hover:bg-slate-800">PDF Tools <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" /></summary>
            <div className="absolute left-1/2 top-full mt-3 grid w-[410px] -translate-x-1/2 grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              {PDF_TOOLS.map((tool) => <Link key={tool.href} href={tool.href} onClick={closePdfMenu} className={`rounded-lg px-3 py-2 text-sm hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-teal-950/50 ${pathname === tool.href ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200' : ''}`}>{tool.title}</Link>)}
            </div>
          </details>
          <Link href="/calculators" className={`rounded-lg px-3 py-2 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:hover:bg-slate-800 ${pathname.startsWith('/calculators') ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200' : ''}`}>Calculators</Link>
          {FUTURE_CATEGORIES.map((label) => <span key={label} aria-disabled="true" aria-label={`${label}, coming soon`} title="Coming soon" className="cursor-default rounded-lg px-2.5 py-2 text-slate-500 dark:text-slate-500">{label}</span>)}
        </nav>

        <div className="hidden xl:flex w-[230px] shrink-0 items-center gap-2"><ToolSearch compact className="min-w-0 flex-1" /><ThemeToggle /></div>
        <div className="flex items-center gap-1 xl:hidden">
          <ThemeToggle />
          <Button ref={mobileMenuButtonRef} variant="ghost" size="icon" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={`${open ? 'Close' : 'Open'} navigation menu`} className="h-11 w-11 rounded-xl focus-visible:ring-teal-600">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 xl:hidden">
          <div className="mx-auto max-w-[1360px] px-4 py-4 sm:px-6">
            <ToolSearch compact className="mb-4" />
            <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/" className="flex min-h-11 items-center rounded-lg bg-slate-50 px-3 py-2.5 font-medium dark:bg-slate-900">All Tools</Link>
              {PDF_TOOLS.map((tool) => <Link key={tool.href} href={tool.href} className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-slate-700 hover:bg-teal-50 dark:text-slate-200 dark:hover:bg-teal-950/40">{tool.title}</Link>)}
              <Link href="/calculators" className="flex min-h-11 items-center rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-teal-50 dark:text-slate-200 dark:hover:bg-teal-950/40">Calculators</Link>
              {FUTURE_CATEGORIES.map((label) => <span key={label} aria-disabled="true" aria-label={`${label}, coming soon`} className="flex min-h-11 flex-col justify-center rounded-lg px-3 py-2.5 text-slate-500">{label} <span className="block text-[10px] uppercase tracking-wide">Coming soon</span></span>)}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
