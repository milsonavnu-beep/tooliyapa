import { DocumentToolPage } from '@/components/tooliyapa/DocumentUI'
import { documentMetadata } from '@/lib/document-tools'
export const metadata = documentMetadata('markdown-word')
export default function Page(){ return <DocumentToolPage toolId="markdown-word"/> }
