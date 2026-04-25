'use client'

import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

export default function Header({ onLogoClick, onSelectTool, currentView }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group"
          aria-label="Tooliyapa Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Tooliya<span className="text-red-600">pa</span>
          </span>
        </button>

        <nav className="hidden sm:flex items-center gap-1">
          <Button
            variant={currentView === 'merge' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSelectTool('merge')}
            className={currentView === 'merge' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Merge PDF
          </Button>
          <Button
            variant={currentView === 'compress' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSelectTool('compress')}
            className={currentView === 'compress' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Compress PDF
          </Button>
        </nav>
      </div>
    </header>
  )
}
