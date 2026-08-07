import MergePdfTool from '@/components/tooliyapa/MergePdfTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('merge-pdf')

export default function Page() {
  return (
    <ToolPageLayout toolId="merge-pdf">
      <MergePdfTool />
    </ToolPageLayout>
  )
}
