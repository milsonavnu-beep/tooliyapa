import UnlockPdfTool from '@/components/tooliyapa/UnlockPdfTool'
export const metadata = {
  title: 'Remove PDF Restrictions — Owner Permissions',
  description: 'Remove common owner-permission restrictions from PDFs you can already open. Does not decrypt open-password encryption. Runs in your browser.',
  alternates: { canonical: '/unlock-pdf' },
}
export default function Page() { return <UnlockPdfTool /> }
