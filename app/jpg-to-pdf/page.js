import JpgToPdfTool from '@/components/tooliyapa/JpgToPdfTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('jpg-to-pdf')

export default function Page() {
  return (
    <ToolPageLayout toolId="jpg-to-pdf">
      <JpgToPdfTool />
    </ToolPageLayout>
  )
}
