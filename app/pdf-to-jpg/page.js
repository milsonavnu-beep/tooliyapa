import PdfToJpgTool from '@/components/tooliyapa/PdfToJpgTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'PDF to JPG — Convert PDF Pages to Images', description: 'Render every page of a PDF as a high-quality JPG image. Free in-browser conversion.', pathname: '/pdf-to-jpg' })
export default function Page() { return <PdfToJpgTool /> }
