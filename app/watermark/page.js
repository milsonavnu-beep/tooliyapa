import WatermarkTool from '@/components/tooliyapa/WatermarkTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('watermark')

export default function Page() {
  return (
    <ToolPageLayout toolId="watermark">
      <WatermarkTool />
    </ToolPageLayout>
  )
}
