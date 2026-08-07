import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { getAccentClasses, getToolIcon } from '@/components/tooliyapa/tool-icons'

/**
 * Registry-driven tool card. Metadata only — never imports tool engines.
 */
export default function ToolCard({ tool, compact = false }) {
  if (!tool) return null
  const Icon = getToolIcon(tool.icon)
  const accent = getAccentClasses(tool.accent)

  return (
    <Link href={tool.href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl">
      <Card
        className={`group cursor-pointer border border-gray-200 dark:border-gray-800 ${accent.border} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white dark:bg-gray-900 h-full ${
          compact ? 'p-4' : 'p-5'
        }`}
      >
        <div
          className={`${compact ? 'w-10 h-10 mb-3' : 'w-12 h-12 mb-4'} rounded-xl ${accent.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <Icon className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} ${accent.text}`} aria-hidden="true" />
        </div>
        <h3 className={`${compact ? 'text-sm' : 'text-base'} font-bold text-gray-900 dark:text-gray-100 mb-1`}>
          {tool.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{tool.shortDescription}</p>
      </Card>
    </Link>
  )
}
