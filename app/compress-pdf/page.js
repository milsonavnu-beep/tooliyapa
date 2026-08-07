import CompressPdfTool from '@/components/tooliyapa/CompressPdfTool'
export const metadata = {
  title: 'Compress PDF — Lossless PDF Optimization',
  description: 'Lossless PDF optimization in your browser (object streams + optional metadata strip). Image-heavy files may not shrink. Files are not uploaded to Tooliyapa servers.',
  alternates: { canonical: '/compress-pdf' },
}
export default function Page() { return <CompressPdfTool /> }
