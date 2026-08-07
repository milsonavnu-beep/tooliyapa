import ToolCard from '@/components/tooliyapa/ToolCard'
import { getRelatedTools } from '@/lib/tools/registry'

export default function RelatedTools({ toolId, title = 'Related tools' }) {
  const related = getRelatedTools(toolId)
  if (!related.length) return null

  return (
    <section className="mt-10" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} compact />
        ))}
      </div>
    </section>
  )
}
