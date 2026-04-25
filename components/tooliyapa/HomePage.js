'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Combine, Minimize2, Shield, Zap, Lock } from 'lucide-react'

export default function HomePage({ onSelectTool }) {
  const tools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into a single document in the order you choose.',
      icon: Combine,
      gradient: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce PDF file size while preserving the best possible quality.',
      icon: Minimize2,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
  ]

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
          Merge or compress PDFs right in your browser. No signup, no uploads, no waiting.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="group cursor-pointer p-6 sm:p-8 border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-200 bg-white"
            >
              <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${tool.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{tool.description}</p>
              <Button
                className={`w-full bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-white border-0`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectTool(tool.id)
                }}
              >
                Open tool
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: Zap, title: 'Lightning Fast', desc: 'Processed in your browser — no upload delays.' },
          { icon: Shield, title: 'Private & Secure', desc: 'Your files never touch our servers. Ever.' },
          { icon: Lock, title: '100% Free', desc: 'No accounts, no watermarks, no limits.' },
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
