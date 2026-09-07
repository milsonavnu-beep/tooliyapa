import PageNumbersTool from '@/components/tooliyapa/PageNumbersTool'
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

const description = 'Add page numbers to every page of a PDF in six header or footer positions, with plain, total-page, or “Page” formatting. Runs in your browser.'

export const metadata = createPageMetadata({ title: 'Add Page Numbers to PDF — Browser Tool', description, pathname: '/page-numbers' })

const faqs = [
  { question: 'Where can I place the page numbers?', answer: 'Choose top left, top center, top right, bottom left, bottom center, or bottom right. The number is placed with a small margin from the selected edge.' },
  { question: 'Which numbering formats are available?', answer: 'You can use a plain number such as “1”, a current-and-total format such as “1 / 12”, or a label such as “Page 1”.' },
  { question: 'Can I choose a different starting number?', answer: 'No. The first PDF page is numbered 1, and each following page increases by one.' },
  { question: 'Can I number only selected pages?', answer: 'No. The tool adds a number to every page in the uploaded PDF. Split the document first if you need to work with only part of it.' },
  { question: 'Can I change the font, size, or color?', answer: 'No. The tool uses a consistent 11-point Helvetica font in dark gray so setup stays simple.' },
  { question: 'Will it cover existing headers or footers?', answer: 'It can. Numbers are drawn onto the page near the selected edge without moving existing content. Choose a position with clear space and inspect the downloaded PDF.' },
  { question: 'Does adding numbers change the original file?', answer: 'No. The browser creates a new downloadable PDF. Your selected source file is not overwritten.' },
]

const relatedTools = [
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Put pages in their final order before numbering them.' },
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Combine documents first so numbering follows the final page sequence.' },
  { href: '/split-pdf', title: 'Split PDF', description: 'Create a smaller page set if only part of a document should be numbered.' },
  { href: '/watermark', title: 'Watermark PDF', description: 'Add a separate text or image mark to PDF pages.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/page-numbers" name="Add Page Numbers to PDF" description={description} faqs={faqs} />
      <PageNumbersTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Choose one PDF by clicking the upload area or dragging the file onto it.',
          'Pick one of six positions at the top or bottom of each page.',
          'Choose plain numbers, current page with total pages, or the “Page 1” format.',
          'Select Add page numbers, download the new PDF, and inspect the placement.',
        ]} />

        <ToolInfoSection title="What this tool does">
          <p>The tool creates a new copy of your PDF and draws a number on every page. Numbering always starts at 1 on the first PDF page and follows the document&apos;s current page order.</p>
          <p>You can use top-left, top-center, top-right, bottom-left, bottom-center, or bottom-right placement. Formats are a plain number, “current / total,” or “Page current.” The number uses 11-point Helvetica in dark gray.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When to use this tool" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Add simple navigation to reports, handouts, proposals, or meeting packets.</li>
            <li>• Number a merged document after all sections are in their final order.</li>
            <li>• Show the total length of a document with the “1 / N” format.</li>
            <li>• Add a consistent header or footer number without installing desktop software.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'Numbers are added to every page; page ranges and skipped pages are not supported.',
          'Numbering begins at 1 and the starting value cannot be changed.',
          'Font, size, color, and margin are fixed and cannot be customized.',
          'The tool draws over the existing page without creating extra header or footer space, so it may overlap content near an edge.',
          'Password-protected, encrypted, or damaged PDFs may not process successfully.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Prepare before numbering">
          <p>Merge, split, remove, and reorder pages before adding numbers so the sequence matches the final document. After downloading, check pages with crowded headers or footers. If a number overlaps existing content, run the original PDF again and choose another corner or edge position.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
