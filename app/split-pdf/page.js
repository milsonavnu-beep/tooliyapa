import SplitPdfTool from '@/components/tooliyapa/SplitPdfTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('split-pdf')

export default function Page() {
  return (
    <ToolPageLayout toolId="split-pdf">
      <SplitPdfTool />
    </ToolPageLayout>
  )
}
