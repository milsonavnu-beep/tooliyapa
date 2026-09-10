import { DocumentsCategoryPage } from '@/components/tooliyapa/DocumentUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Free Online Document Tools', description: 'Convert, inspect, extract, and reformat DOCX, Markdown, PDF text, plain text, and XLSX files with privacy-first browser tools.', pathname: '/documents' })
export default function Page(){ return <DocumentsCategoryPage/> }
