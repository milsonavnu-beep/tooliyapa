import RotatePdfTool from '@/components/tooliyapa/RotatePdfTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'Rotate PDF — Rotate Pages Online', description: 'Rotate all pages or selected pages of a PDF by 90, 180 or 270 degrees.', pathname: '/rotate-pdf' })
export default function Page() { return <RotatePdfTool /> }
