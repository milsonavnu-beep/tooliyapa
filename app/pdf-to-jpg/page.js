import PdfToJpgTool from '@/components/tooliyapa/PdfToJpgTool'
import {
  CheckCircle2,
  HowToUse,
  PrivacyNote,
  RelatedTools,
  ToolFAQ,
  ToolInfoSection,
  ToolLimitations,
  ToolPageContent,
  ToolStructuredData,
} from '@/components/tooliyapa/ToolPageContent'
import { createPageMetadata } from '@/lib/site'

const description = 'Render every page of one PDF as a separate JPG image in your browser. Preview pages and download individual JPGs or trigger each download with Download all.'

export const metadata = createPageMetadata({ title: 'PDF to JPG Converter Online', description, pathname: '/pdf-to-jpg' })

const faqs = [
  { question: 'Does the tool convert every PDF page?', answer: 'Yes. It renders every page in order and creates one JPG per source page. There is currently no page-selection or page-range control.' },
  { question: 'What happens to selectable text and vector graphics?', answer: 'The page is rasterized, so selectable or searchable text and vector content become pixels in the JPG. The image is a visual rendering, not an editable equivalent of the source PDF.' },
  { question: 'Are PDF links, forms, annotations, and layers preserved?', answer: 'Not as interactive PDF features. The JPG may show their visible appearance at render time, but links, form behavior, annotations, layers, and other interactivity do not remain interactive in an image.' },
  { question: 'Does Download all create a ZIP file?', answer: 'No. Download all triggers a separate JPG download for each page. Your browser may ask for permission to allow multiple downloads.' },
  { question: 'How are the JPG files named?', answer: 'Each filename uses the source PDF name followed by “-page-N.jpg,” where page numbering begins at 1.' },
  { question: 'Does conversion overwrite the original PDF?', answer: 'No. The source PDF remains unchanged. The browser creates page previews and separate JPG files for you to download.' },
]

const relatedTools = [
  { href: '/jpg-to-pdf', title: 'JPG and PNG to PDF', description: 'Combine image files into one PDF with one image per page.' },
  { href: '/split-pdf', title: 'Split PDF', description: 'Keep PDF format while extracting selected pages or separating every page.' },
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Reorder, rotate, or remove PDF pages before rasterizing them.' },
  { href: '/page-numbers', title: 'Add Page Numbers', description: 'Add visible numbering before converting pages to static images.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/pdf-to-jpg" name="PDF to JPG Converter" description={description} faqs={faqs} />
      <PdfToJpgTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Add one PDF by dropping it into the upload area or choosing it from your device.',
          'Select Convert to JPG and wait while every PDF page is rendered.',
          'Review the image previews and page numbers after conversion finishes.',
          'Download a specific JPG, or use Download all to trigger a separate download for every page.',
        ]} />

        <ToolInfoSection title="What PDF rasterization creates">
          <p>The browser loads one PDF with pdf.js, renders every page to a canvas at render scale 2, and encodes each canvas as JPEG at quality 0.92. It produces one JPG for every source page, numbered from 1, and shows previews before download.</p>
          <p>This is rasterization: text, lines, and vector artwork become image pixels. Selectable or searchable text is no longer text in the JPG, and forms, links, annotations, layers, and interactive behavior are not preserved as interactive PDF features.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When JPG page images are useful" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Create static page previews for a document listing or catalog.</li>
            <li>• Use a PDF page in a service or workflow that requires JPG.</li>
            <li>• Place a page visual into a presentation or another document.</li>
            <li>• Share a noninteractive snapshot of how a page renders.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'Every page is converted. There is no page-selection control on this route.',
          'Rasterization turns searchable text and vector content into pixels; it does not preserve PDF interactivity or editable structure.',
          'The output is rendered at the implementation’s scale rather than preserving an undefined “original PDF resolution” exactly.',
          'Download all starts separate JPG downloads and does not create a ZIP archive.',
          'Long, high-resolution, or visually complex PDFs can consume substantial browser memory and processing time or fail to render.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Check image output before sharing">
          <p>Open several previews and downloaded images at the size in which they will be used. Check small text, thin lines, diagrams, transparency, annotations, and page edges. A JPG captures a rendered appearance but cannot reproduce the source PDF&apos;s searchable text or interactive behavior.</p>
          <p>If you need only certain pages, split the PDF first; this converter always processes all pages. When using Download all, confirm that the browser allowed every separate download and that page numbers are complete.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
