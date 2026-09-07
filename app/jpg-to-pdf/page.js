import JpgToPdfTool from '@/components/tooliyapa/JpgToPdfTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'JPG to PDF — Convert Images to PDF', description: 'Convert JPG, JPEG and PNG images into a single PDF document. Free and instant.', pathname: '/jpg-to-pdf' })
export default function Page() { return <JpgToPdfTool /> }
