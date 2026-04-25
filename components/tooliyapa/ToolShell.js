'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function ToolShell({ onBack, icon: Icon, title, description, accent = 'red', children }) {
  const accentMap = {
    red:      { bg: 'bg-red-50',      text: 'text-red-600' },
    emerald:  { bg: 'bg-emerald-50',  text: 'text-emerald-600' },
    amber:    { bg: 'bg-amber-50',    text: 'text-amber-600' },
    blue:     { bg: 'bg-blue-50',     text: 'text-blue-600' },
    violet:   { bg: 'bg-violet-50',   text: 'text-violet-600' },
    pink:     { bg: 'bg-pink-50',     text: 'text-pink-600' },
    orange:   { bg: 'bg-orange-50',   text: 'text-orange-600' },
    cyan:     { bg: 'bg-cyan-50',     text: 'text-cyan-600' },
    fuchsia:  { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-600' },
    slate:    { bg: 'bg-slate-100',   text: 'text-slate-700' },
  }
  const c = accentMap[accent] || accentMap.red
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to all tools
      </Button>
      <div className="text-center mb-8">
        <div className={`inline-flex w-14 h-14 rounded-2xl ${c.bg} items-center justify-center mb-4`}>
          <Icon className={`w-7 h-7 ${c.text}`} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-2 text-gray-600">{description}</p>}
      </div>
      {children}
    </div>
  )
}
