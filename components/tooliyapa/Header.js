'use client'

import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

const NAV = [
  { id: 'merge', label: 'Merge' },
  { id: 'split', label: 'Split' },
  { id: 'compress', label: 'Compress' },
  { id: 'rotate', label: 'Rotate' },
  { id: 'organize', label: 'Organize' },
  { id: 'jpg2pdf', label: 'JPG→PDF' },
  { id: 'pdf2jpg', label: 'PDF→JPG' },
]

export default function Header({ onLogoClick, onSelectTool, currentView }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <button onClick={onLogoClick} className="flex items-center gap-2 group shrink-0" aria-label="Tooliyapa Home">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Tooliya<span className="text-red-600">pa</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto">
          {NAV.map((n) => (
            <Button
              key={n.id}
              variant={currentView === n.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSelectTool(n.id)}
              className={currentView === n.id ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {n.label}
            </Button>
          ))}
        </nav>
      </div>
    </header>
  )
}
