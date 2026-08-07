import OrganizePdfTool from '@/components/tooliyapa/OrganizePdfTool'
import ToolPageLayout from '@/components/tooliyapa/ToolPageLayout'
import { buildToolMetadata } from '@/lib/tools/metadata'

export const metadata = buildToolMetadata('organize-pdf')

export default function Page() {
  return (
    <ToolPageLayout toolId="organize-pdf">
      <OrganizePdfTool />
    </ToolPageLayout>
  )
}
