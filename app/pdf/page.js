import Link from 'next/link'
import ToolCard from '@/components/tooliyapa/ToolCard'
import ToolSearch from '@/components/tooliyapa/ToolSearch'
import ToolBreadcrumbs, { categoryBreadcrumbItems } from '@/components/tooliyapa/ToolBreadcrumbs'
import ToolPrivacyBadge from '@/components/tooliyapa/ToolPrivacyBadge'
import JsonLd from '@/components/tooliyapa/JsonLd'
import { getCategoryBySlug } from '@/lib/tools/categories'
import { getToolsByCategory } from '@/lib/tools/registry'
import { buildCategoryMetadata } from '@/lib/tools/metadata'
import { categoryPageJsonLd } from '@/lib/tools/jsonld'

export const metadata = buildCategoryMetadata('pdf')

export default function PdfCategoryPage() {
  const category = getCategoryBySlug('pdf')
  const tools = getToolsByCategory('pdf')
  const crumbs = categoryBreadcrumbItems(category)

  return (
    <>
      <JsonLd data={categoryPageJsonLd('pdf')} />
      <div className="container mx-auto px-4 py-10 sm:py-14 max-w-6xl">
        <ToolBreadcrumbs items={crumbs} />

        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50">{category.name}</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{category.description}</p>
          <div className="mt-4">
            <ToolPrivacyBadge />
          </div>
        </div>

        <div className="max-w-xl mb-8">
          <ToolSearch placeholder="Filter PDF tools…" />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {tools.length} tools ·{' '}
          <Link href="/" className="text-red-600 hover:underline">
            Back to home
          </Link>
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </>
  )
}
