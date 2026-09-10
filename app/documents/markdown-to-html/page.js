import { DocumentToolPage } from '@/components/tooliyapa/DocumentUI'
import { documentMetadata } from '@/lib/document-tools'
export const metadata = documentMetadata('markdown-html')
export default function Page(){ return <DocumentToolPage toolId="markdown-html"/> }
