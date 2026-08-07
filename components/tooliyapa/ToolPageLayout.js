import JsonLd from '@/components/tooliyapa/JsonLd'
import RelatedTools from '@/components/tooliyapa/RelatedTools'
import ToolBreadcrumbs, { toolBreadcrumbItems } from '@/components/tooliyapa/ToolBreadcrumbs'
import ToolFaq from '@/components/tooliyapa/ToolFaq'
import ToolHowToUse from '@/components/tooliyapa/ToolHowToUse'
import ToolLimitations from '@/components/tooliyapa/ToolLimitations'
import { getToolById, getToolCategory } from '@/lib/tools/registry'
import { toolPageJsonLd } from '@/lib/tools/jsonld'

/**
 * Shared product chrome around a tool engine component.
 * Does not import PDF libraries — only registry metadata + children.
 */
export default function ToolPageLayout({ toolId, children }) {
  const tool = getToolById(toolId)
  if (!tool) {
    throw new Error(`ToolPageLayout: unknown toolId "${toolId}"`)
  }

  const category = getToolCategory(tool)
  const crumbs = toolBreadcrumbItems(tool, category)
  const schemas = toolPageJsonLd(tool.id)

  return (
    <>
      <JsonLd data={schemas} />
      <div className="container mx-auto px-4 pt-6 sm:pt-8 max-w-4xl">
        <ToolBreadcrumbs items={crumbs} />
      </div>
      {children}
      <div className="container mx-auto px-4 pb-10 sm:pb-14 max-w-4xl">
        <ToolHowToUse steps={tool.howToUse} />
        <ToolLimitations limitations={tool.limitations} />
        <ToolFaq faq={tool.faq} />
        <RelatedTools toolId={tool.id} />
      </div>
    </>
  )
}
