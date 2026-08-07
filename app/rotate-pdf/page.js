import RotatePdfTool from '@/components/tooliyapa/RotatePdfTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('rotate-pdf')

export default function Page() {
  return (
    <ToolPageLayout toolId="rotate-pdf">
      <RotatePdfTool />
    </ToolPageLayout>
  )
}
