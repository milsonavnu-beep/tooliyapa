import PdfToJpgTool from '@/components/tooliyapa/PdfToJpgTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('pdf-to-jpg')

export default function Page() {
  return (
    <ToolPageLayout toolId="pdf-to-jpg">
      <PdfToJpgTool />
    </ToolPageLayout>
  )
}
