import { DocumentToolPage } from '@/components/tooliyapa/DocumentUI'
import { documentMetadata } from '@/lib/document-tools'
export const metadata = documentMetadata('word-styles')
export default function Page(){ return <DocumentToolPage toolId="word-styles"/> }
