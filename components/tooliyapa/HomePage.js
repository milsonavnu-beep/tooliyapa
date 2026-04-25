'use client'

import { Card } from '@/components/ui/card'
import {
  Combine, Minimize2, Scissors, RotateCw, Image as ImageIcon, FileImage,
  Hash, Type, Layers, Unlock, Shield, Zap, Lock,
} from 'lucide-react'

const TOOLS = [
  { id: 'merge',    title: 'Merge PDF',     desc: 'Combine multiple PDFs into one.',          icon: Combine,    color: 'red',    iconBg: 'bg-red-50',     iconColor: 'text-red-600' },
  { id: 'split',    title: 'Split PDF',     desc: 'Extract pages or split into ranges.',       icon: Scissors,   color: 'amber',  iconBg: 'bg-amber-50',   iconColor: 'text-amber-600' },
  { id: 'compress', title: 'Compress PDF',  desc: 'Reduce file size with quality control.',    icon: Minimize2,  color: 'emerald',iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { id: 'rotate',   title: 'Rotate PDF',    desc: 'Rotate all or selected pages.',             icon: RotateCw,   color: 'blue',   iconBg: 'bg-blue-50',    iconColor: 'text-blue-600' },
  { id: 'organize', title: 'Organize PDF',  desc: 'Delete or reorder pages.',                  icon: Layers,     color: 'violet', iconBg: 'bg-violet-50',  iconColor: 'text-violet-600' },
  { id: 'jpg2pdf',  title: 'JPG to PDF',    desc: 'Convert images to a single PDF.',           icon: FileImage,  color: 'pink',   iconBg: 'bg-pink-50',    iconColor: 'text-pink-600' },
  { id: 'pdf2jpg',  title: 'PDF to JPG',    desc: 'Export each page as a JPG image.',          icon: ImageIcon,  color: 'orange', iconBg: 'bg-orange-50',  iconColor: 'text-orange-600' },
  { id: 'pagenum',  title: 'Page Numbers',  desc: 'Add page numbers to your PDF.',             icon: Hash,       color: 'cyan',   iconBg: 'bg-cyan-50',    iconColor: 'text-cyan-600' },
  { id: 'watermark',title: 'Watermark',     desc: 'Add a text watermark to every page.',        icon: Type,       color: 'fuchsia',iconBg: 'bg-fuchsia-50', iconColor: 'text-fuchsia-600' },
  { id: 'unlock',   title: 'Unlock PDF',    desc: 'Remove PDF passwords (when known).',        icon: Unlock,     color: 'slate',  iconBg: 'bg-slate-100',  iconColor: 'text-slate-700' },
]

export default function HomePage({ onSelectTool }) {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-medium mb-5">
          <Lock className="w-3 h-3" /> 100% browser-based · Your files never leave your device
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
          Every PDF tool you need,
          <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            fast & free.
          </span>
        </h1>
        <p className="mt-5 text-lg text-gray-600">
          A complete suite of PDF tools — merge, split, compress, convert, rotate, organize and more. Right in your browser.
        </p>
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Card
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group cursor-pointer p-5 border border-gray-200 hover:border-red-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${tool.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{tool.title}</h3>
              <p className="text-xs text-gray-500 leading-snug">{tool.desc}</p>
            </Card>
          )
        })}
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: Zap,    title: 'Lightning Fast',   desc: 'Processed in your browser — no upload delays.' },
          { icon: Shield, title: 'Private & Secure', desc: 'Your files never touch our servers. Ever.' },
          { icon: Lock,   title: '100% Free',        desc: 'No accounts, no watermarks, no limits.' },
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-gray-700" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{f.title}</h4>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
