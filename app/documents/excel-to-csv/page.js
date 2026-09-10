import { DocumentToolPage } from '@/components/tooliyapa/DocumentUI'
import { documentMetadata } from '@/lib/document-tools'
export const metadata = documentMetadata('excel-csv')
export default function Page(){ return <DocumentToolPage toolId="excel-csv"/> }
