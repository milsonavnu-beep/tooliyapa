import UnlockPdfTool from '@/components/tooliyapa/UnlockPdfTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({
  title: 'Remove PDF Restrictions — Owner Permissions',
  description: 'Remove common owner-permission restrictions from PDFs you can already open. Does not decrypt open-password encryption. Runs in your browser.',
  pathname: '/unlock-pdf',
})
export default function Page() { return <UnlockPdfTool /> }
