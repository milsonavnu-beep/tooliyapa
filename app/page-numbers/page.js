import PageNumbersTool from '@/components/tooliyapa/PageNumbersTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('page-numbers')

export default function Page() {
  return (
    <ToolPageLayout toolId="page-numbers">
      <PageNumbersTool />
    </ToolPageLayout>
  )
}
