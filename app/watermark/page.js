import WatermarkTool from '@/components/tooliyapa/WatermarkTool'
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

const description = 'Add the same centered text watermark to every PDF page. Adjust opacity, rotation, and text size, then download a new watermarked PDF from your browser.'

export const metadata = createPageMetadata({ title: 'Add Text Watermark to PDF', description, pathname: '/watermark' })

const faqs = [
  { question: 'Can I add an image or logo watermark?', answer: 'No. This tool adds text only. It does not upload or place image and logo watermarks.' },
  { question: 'Which pages receive the watermark?', answer: 'Every page receives the same watermark text and settings. There is no page-range control or different-text-per-page option.' },
  { question: 'Which watermark settings can I change?', answer: 'You can enter the text, set opacity from 5% to 100%, rotation from -90° to 90°, and text size from 20pt to 200pt.' },
  { question: 'Can I choose the font, color, or position?', answer: 'No. The tool uses Helvetica Bold in a fixed dark-red color and places the text around the center of each page. Free positioning, corner placement, and tiled patterns are not available.' },
  { question: 'Is there a page preview before I apply the watermark?', answer: 'No. This page does not render a visual PDF preview. Download and inspect the new file, then adjust the original settings and try again if needed.' },
  { question: 'Does a text watermark secure or protect the PDF?', answer: 'No. A watermark is a visible marking, not encryption, DRM, copy protection, tamper prevention, or proof of legal ownership.' },
  { question: 'Will my original PDF be changed?', answer: 'No. The browser creates a new file whose name ends in “-watermarked.pdf”; it does not overwrite the selected original.' },
]

const relatedTools = [
  { href: '/page-numbers', title: 'Add Page Numbers', description: 'Place consistent page numbers in a header or footer position.' },
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Put pages in final order before applying one watermark to all of them.' },
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Combine documents before adding the same visible marking to every page.' },
  { href: '/compress-pdf', title: 'Compress PDF', description: 'Try lossless structural optimization after watermarking.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/watermark" name="Add Text Watermark to PDF" description={description} faqs={faqs} />
      <WatermarkTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Upload one PDF and enter the text that should appear on every page.',
          'Set opacity between 5% and 100%, rotation between -90° and 90°, and size between 20pt and 200pt.',
          'Select Add watermark to create a new PDF with the same centered text treatment on each page.',
          'Download the file ending in “-watermarked.pdf” and inspect every page for readability.',
        ]} />

        <ToolInfoSection title="What this text watermark tool does">
          <p>The tool draws the same text around the center of every page in a PDF. The default text is <span className="font-medium">CONFIDENTIAL</span>. It uses Helvetica Bold and a fixed dark-red color, while you control opacity, rotation, and font size.</p>
          <p>Processing creates a new PDF rather than overwriting the selected file. This is a text-only workflow: it does not add logos or other image watermarks, and it does not offer different wording or settings for individual pages.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When a visible text watermark is useful" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Mark a working document as DRAFT or REVIEW COPY.</li>
            <li>• Label internal material with CONFIDENTIAL or INTERNAL USE.</li>
            <li>• Identify demonstration documents with SAMPLE.</li>
            <li>• Add a consistent status label across every page before circulation.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'Only text watermarks are supported; image and logo uploads are not available.',
          'The same text and settings apply to every page. Page ranges and per-page text are not supported.',
          'Helvetica Bold, the dark-red color, and center-area placement are fixed. There are no font, color, free-position, corner, or repeating-pattern controls.',
          'There is no visual page preview before processing, so the downloaded PDF must be checked for overlap and legibility.',
          'A visible watermark does not encrypt the PDF, prevent copying or editing, provide DRM, prove ownership, or prevent tampering.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Choose readable watermark settings">
          <p>Start with concise wording such as CONFIDENTIAL, DRAFT, INTERNAL USE, SAMPLE, or REVIEW COPY. A lower opacity can keep underlying content readable, while a larger size or steeper rotation can make the label more prominent. Because page layouts vary, one setting may overlap content differently from page to page.</p>
          <p>There is no preview in the tool, so open the downloaded copy and inspect light and dark pages, dense text, charts, and page edges. If the marking is distracting or hard to read, return to the original PDF and create another copy with adjusted opacity, rotation, or size.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
