'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ToolShell({ icon: Icon, title, description, accent = 'red', children }) {
  const accentMap = {
    red:      { bg: 'bg-red-50 dark:bg-red-950/40',         text: 'text-red-600' },
    emerald:  { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600' },
    amber:    { bg: 'bg-amber-50 dark:bg-amber-950/40',     text: 'text-amber-600' },
    blue:     { bg: 'bg-blue-50 dark:bg-blue-950/40',       text: 'text-blue-600' },
    violet:   { bg: 'bg-violet-50 dark:bg-violet-950/40',   text: 'text-violet-600' },
    pink:     { bg: 'bg-pink-50 dark:bg-pink-950/40',       text: 'text-pink-600' },
    orange:   { bg: 'bg-orange-50 dark:bg-orange-950/40',   text: 'text-orange-600' },
    cyan:     { bg: 'bg-cyan-50 dark:bg-cyan-950/40',       text: 'text-cyan-600' },
    fuchsia:  { bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', text: 'text-fuchsia-600' },
    slate:    { bg: 'bg-slate-100 dark:bg-slate-800',       text: 'text-slate-700 dark:text-slate-300' },
  }
  const c = accentMap[accent] || accentMap.red
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <Link href="/"><Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-1" /> Back to all tools</Button></Link>
      <div className="text-center mb-8">
        <div className={`inline-flex w-14 h-14 rounded-2xl ${c.bg} items-center justify-center mb-4`}>
          <Icon className={`w-7 h-7 ${c.text}`} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50">{title}</h1>
        {description && <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
      {children}
    </div>
  )
}
