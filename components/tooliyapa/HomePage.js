'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
  Combine, Minimize2, Scissors, RotateCw, Image as ImageIcon, FileImage,
  Hash, Type, Layers, Unlock, Shield, Zap, Lock,
} from 'lucide-react'

const TOOLS = [
  { href: '/merge-pdf',     title: 'Merge PDF',    desc: 'Combine multiple PDFs into one.',         icon: Combine,   iconBg: 'bg-red-50 dark:bg-red-950/40',         iconColor: 'text-red-600' },
  { href: '/split-pdf',     title: 'Split PDF',    desc: 'Extract pages or split into ranges.',     icon: Scissors,  iconBg: 'bg-amber-50 dark:bg-amber-950/40',     iconColor: 'text-amber-600' },
  { href: '/compress-pdf',  title: 'Compress PDF', desc: 'Reduce file size with quality control.',  icon: Minimize2, iconBg: 'bg-emerald-50 dark:bg-emerald-950/40', iconColor: 'text-emerald-600' },
  { href: '/rotate-pdf',    title: 'Rotate PDF',   desc: 'Rotate all or selected pages.',           icon: RotateCw,  iconBg: 'bg-blue-50 dark:bg-blue-950/40',       iconColor: 'text-blue-600' },
  { href: '/organize-pdf',  title: 'Organize PDF', desc: 'Drag to reorder or delete pages.',        icon: Layers,    iconBg: 'bg-violet-50 dark:bg-violet-950/40',   iconColor: 'text-violet-600' },
  { href: '/jpg-to-pdf',    title: 'JPG to PDF',   desc: 'Convert images to a single PDF.',         icon: FileImage, iconBg: 'bg-pink-50 dark:bg-pink-950/40',       iconColor: 'text-pink-600' },
  { href: '/pdf-to-jpg',    title: 'PDF to JPG',   desc: 'Export each page as a JPG image.',        icon: ImageIcon, iconBg: 'bg-orange-50 dark:bg-orange-950/40',   iconColor: 'text-orange-600' },
  { href: '/page-numbers',  title: 'Page Numbers', desc: 'Add page numbers to your PDF.',           icon: Hash,      iconBg: 'bg-cyan-50 dark:bg-cyan-950/40',       iconColor: 'text-cyan-600' },
  { href: '/watermark',     title: 'Watermark',    desc: 'Add a text watermark to every page.',     icon: Type,      iconBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', iconColor: 'text-fuchsia-600' },
  { href: '/unlock-pdf',    title: 'Unlock PDF',   desc: 'Remove PDF passwords (when known).',      icon: Unlock,    iconBg: 'bg-slate-100 dark:bg-slate-800',       iconColor: 'text-slate-700 dark:text-slate-300' },
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-medium mb-5">
          <Lock className="w-3 h-3" /> 100% browser-based · Your files never leave your device
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Every PDF tool you need,
          <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">fast & free.</span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 dark:text-gray-400">A complete suite of PDF tools — merge, split, compress, convert, rotate, organize and more. Right in your browser.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="group cursor-pointer p-5 border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white dark:bg-gray-900 h-full">
                <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">{tool.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{tool.desc}</p>
              </Card>
            </Link>
          )
        })}
      </div>
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: Zap, title: 'Lightning Fast', desc: 'Processed in your browser — no upload delays.' },
          { icon: Shield, title: 'Private & Secure', desc: 'Your files never touch our servers. Ever.' },
          { icon: Lock, title: '100% Free', desc: 'No accounts, no watermarks, no limits.' },
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
