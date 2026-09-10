import { DocumentToolPage } from '@/components/tooliyapa/DocumentUI'
import { documentMetadata } from '@/lib/document-tools'
export const metadata = documentMetadata('pdf-word')
export default function Page(){ return <DocumentToolPage toolId="pdf-word"/> }
