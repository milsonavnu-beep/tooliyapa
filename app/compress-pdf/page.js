import CompressPdfTool from '@/components/tooliyapa/CompressPdfTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('compress-pdf')

export default function Page() {
  return (
    <ToolPageLayout toolId="compress-pdf">
      <CompressPdfTool />
    </ToolPageLayout>
  )
}
