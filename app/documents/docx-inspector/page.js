import { DocumentToolPage } from '@/components/tooliyapa/DocumentUI'
import { documentMetadata } from '@/lib/document-tools'
export const metadata = documentMetadata('docx-inspector')
export default function Page(){ return <DocumentToolPage toolId="docx-inspector"/> }
