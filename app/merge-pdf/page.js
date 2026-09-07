import MergePdfTool from '@/components/tooliyapa/MergePdfTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'Merge PDF — Free Online PDF Merger', description: 'Combine multiple PDFs into one file in any order. 100% free, fast, and processed in your browser.', pathname: '/merge-pdf' })
export default function Page() { return <MergePdfTool /> }
