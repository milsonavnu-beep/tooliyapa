import UnlockPdfTool from '@/components/tooliyapa/UnlockPdfTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('unlock-pdf')

export default function Page() {
  return (
    <ToolPageLayout toolId="unlock-pdf">
      <UnlockPdfTool />
    </ToolPageLayout>
  )
}
