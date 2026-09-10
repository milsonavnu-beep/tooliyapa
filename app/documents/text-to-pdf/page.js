import { DocumentToolPage } from '@/components/tooliyapa/DocumentUI'
import { documentMetadata } from '@/lib/document-tools'
export const metadata = documentMetadata('text-pdf')
export default function Page(){ return <DocumentToolPage toolId="text-pdf"/> }
