'use client'

import Link from 'next/link'
import { Shield, Zap, Lock } from 'lucide-react'
import DiceLogo from '@/components/tooliyapa/DiceLogo'
import ToolCard from '@/components/tooliyapa/ToolCard'
import ToolSearch from '@/components/tooliyapa/ToolSearch'
import ToolPrivacyBadge from '@/components/tooliyapa/ToolPrivacyBadge'
import { getActiveTools } from '@/lib/tools/registry'
import { getActiveCategories } from '@/lib/tools/categories'

export default function HomePage() {
  const tools = getActiveTools()
  const categories = getActiveCategories()
  const pdfCategory = categories.find((c) => c.id === 'pdf')

  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="flex justify-center mb-6">
          <DiceLogo size={88} />
        </div>
        <div className="flex justify-center mb-5">
          <ToolPrivacyBadge />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Every PDF tool you need,
          <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
            fast & free.
          </span>
        </h1>
        <p className="mt-5 text-lg text-gray-600 dark:text-gray-400">
          A complete suite of PDF tools — merge, split, compress, convert, rotate, organize and more. Right
          in your browser.
        </p>
        <div className="mt-8 max-w-xl mx-auto text-left">
          <ToolSearch placeholder="Search tools (e.g. combine pdf, image to pdf)…" />
        </div>
      </div>

      {pdfCategory && (
        <section className="max-w-6xl mx-auto mb-8" aria-labelledby="pdf-tools-heading">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 id="pdf-tools-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {pdfCategory.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pdfCategory.shortDescription}</p>
            </div>
            <Link
              href={pdfCategory.href}
              className="text-sm font-medium text-red-600 hover:text-red-700 underline-offset-2 hover:underline"
            >
              View all PDF tools
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { icon: Zap, title: 'Lightning Fast', desc: 'Processed in your browser — no upload delays.' },
          {
            icon: Shield,
            title: 'Files stay local',
            desc: 'Your PDFs are not uploaded to Tooliyapa servers.',
          },
          { icon: Lock, title: '100% Free', desc: 'No accounts, no watermarks, no limits.' },
        ].map((f) => {
          const Icon = f.icon
          return (
            <div key={f.title} className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
