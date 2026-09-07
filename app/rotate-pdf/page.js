import RotatePdfTool from '@/components/tooliyapa/RotatePdfTool'
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

const description = 'Rotate every page or specified PDF pages by 90, 180, or 270 degrees and download a new copy. Select pages with numbers or comma-separated ranges.'

export const metadata = createPageMetadata({ title: 'Rotate PDF Pages Online', description, pathname: '/rotate-pdf' })

const faqs = [
  { question: 'Can I rotate only certain pages?', answer: 'Yes. Choose Specific pages and enter individual page numbers or inclusive ranges separated by commas, such as “1-3, 5”. Page numbering begins at 1.' },
  { question: 'Which rotation angles are available?', answer: 'Choose 90, 180, or 270 degrees. The selected amount is added to each target page’s existing PDF rotation.' },
  { question: 'What happens to pages outside my selection?', answer: 'They are copied into the downloaded PDF without an added rotation. Their order and existing rotation remain as they were in the source.' },
  { question: 'Is the rotation saved in the downloaded PDF?', answer: 'Yes. The tool saves a new PDF with the chosen page rotation applied. It does not overwrite the source file.' },
  { question: 'Does rotating a page reorder or crop it?', answer: 'No. Rotation changes page orientation metadata; it does not move the page to another position, crop its content, or intentionally resize its page box.' },
  { question: 'Can I preview rotated pages before downloading?', answer: 'No. This rotate screen shows the file and page count but not page thumbnails or a visual preview. Open the downloaded copy to verify orientation.' },
  { question: 'Can it rotate an encrypted or damaged PDF?', answer: 'Not reliably. Password-protected, unsupported encrypted, damaged, or unusually structured PDFs may fail to load or save.' },
]

const relatedTools = [
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Preview pages, rotate individual tiles, reorder them, or remove unwanted pages.' },
  { href: '/split-pdf', title: 'Split PDF', description: 'Extract selected pages when you need a separate document rather than a new orientation.' },
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Combine corrected PDFs after their page orientation has been checked.' },
  { href: '/page-numbers', title: 'Add Page Numbers', description: 'Number the document after orientation and page order are final.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/rotate-pdf" name="Rotate PDF Pages" description={description} faqs={faqs} />
      <RotatePdfTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Upload one PDF and confirm the page count shown beside its filename.',
          'Choose a clockwise rotation of 90, 180, or 270 degrees.',
          'Apply it to all pages, or enter specific page numbers and comma-separated ranges such as “1-3, 5”.',
          'Rotate the PDF, download the file ending in “-rotated.pdf,” and check the result.',
        ]} />

        <ToolInfoSection title="What page rotation changes">
          <p>The tool loads one PDF and adds the chosen angle to the existing rotation of either every page or the valid pages in your selection. A 90-degree choice is a clockwise quarter-turn, 180 degrees turns a page upside down, and 270 degrees is equivalent to a clockwise three-quarter-turn.</p>
          <p>The result is saved as a new PDF. Rotation does not rearrange pages, crop content, or intentionally change the page boxes; it updates how target pages are oriented when a PDF viewer displays them.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When page rotation is useful" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Correct sideways pages produced by a scanner or mobile capture.</li>
            <li>• Turn an upside-down form or attachment without rotating the entire document.</li>
            <li>• Apply one consistent orientation to every page of a PDF.</li>
            <li>• Correct orientation before organizing, merging, or numbering the final document.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'This screen does not render page previews, so use the source page numbers carefully and inspect the download.',
          'Specific-page input accepts whole page numbers and inclusive ranges separated by commas; invalid and out-of-range entries are ignored, and an empty valid selection cannot be processed.',
          'The same selected angle is applied to every target page in one run; different angles require separate runs or the Organize PDF tool.',
          'Rotation does not reorder, crop, deskew, or OCR page content.',
          'Password-protected, encrypted, damaged, unusually structured, or very large PDFs may fail or exceed the browser/device resources available.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Check orientation before saving your final copy">
          <p>PDF page numbers start at 1, so compare your selection with the source document before processing. Mixed-orientation files may need separate runs when different pages require different angles. For a thumbnail-based workflow with per-page clockwise rotation, use Organize PDF instead.</p>
          <p>Open the downloaded copy in the viewer your recipients are likely to use. Check that each target page is upright and that annotations, forms, signatures, and unusual page layouts still appear as expected.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
