import SplitPdfTool from '@/components/tooliyapa/SplitPdfTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'Split PDF — Extract & Split Pages Online', description: 'Extract specific pages or split every page into a separate PDF. Free and private.', pathname: '/split-pdf' })
export default function Page() { return <SplitPdfTool /> }
