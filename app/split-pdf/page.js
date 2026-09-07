import SplitPdfTool from '@/components/tooliyapa/SplitPdfTool'
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

const description = 'Select PDF pages from browser-rendered thumbnails and extract them into one PDF, or create a separate PDF for every page. Processing stays in your browser.'

export const metadata = createPageMetadata({ title: 'Split PDF Pages Online', description, pathname: '/split-pdf' })

const faqs = [
  { question: 'How do I choose pages to extract?', answer: 'Choose Extract pages, then click the page thumbnails. You can select or clear every displayed page with the Select all and Clear controls. There is no typed page-range field in this tool.' },
  { question: 'Is the first page numbered 1?', answer: 'Yes. Thumbnail labels and downloaded filenames use human-readable numbering that begins with page 1, even though PDF processing uses zero-based indices internally.' },
  { question: 'What does Extract pages create?', answer: 'It creates one new PDF containing all selected pages in their original document order. Pages you did not select are not included in that output.' },
  { question: 'What does Split every page create?', answer: 'It creates one single-page PDF for each source page. The results appear as a list of individual download buttons rather than one ZIP archive.' },
  { question: 'Can I change the order of extracted pages?', answer: 'No. Selected pages are sorted into their original order before the output is created. Use Organize PDF on the downloaded extraction if you need a different sequence.' },
  { question: 'How are split files named?', answer: 'An extraction uses the source name followed by the first and last selected page numbers. Every-page mode names each result with the source name and its individual page number.' },
  { question: 'Can it split password-protected or damaged PDFs?', answer: 'Not reliably. PDFs that require a password, use unsupported encryption, are damaged, or cannot be rendered by the browser may fail.' },
]

const relatedTools = [
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Combine an extracted section with other PDF documents.' },
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Reorder, rotate, or remove pages when you need more than extraction.' },
  { href: '/page-numbers', title: 'Add Page Numbers', description: 'Number every page in the extracted PDF after checking its sequence.' },
  { href: '/compress-pdf', title: 'Compress PDF', description: 'Try lossless optimization on the smaller document you created.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/split-pdf" name="Split PDF Pages" description={description} faqs={faqs} />
      <SplitPdfTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Upload one PDF and wait while the browser renders a thumbnail for each page.',
          'Choose Extract pages and click the thumbnails you need, or choose Split every page.',
          'Start the split and wait for the selected output or individual page files to be created.',
          'Download the combined extraction, or download each single-page PDF from the result list.',
        ]} />

        <ToolInfoSection title="What this split tool creates">
          <p>Extract pages mode uses thumbnail selection rather than a typed range. The tool sorts the selected page numbers and creates one PDF containing those pages in their original order. Unselected pages remain in your source file but are omitted from the new extraction.</p>
          <p>Split every page mode creates a separate one-page PDF for each source page. Each file has its own download button; the browser does not bundle the results into a ZIP. Page labels and filenames start at 1.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When splitting is useful" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Extract a chapter or a set of report pages into one focused document.</li>
            <li>• Separate scanned invoices, forms, or attachments into individual page files.</li>
            <li>• Share only relevant pages while leaving the original PDF unchanged.</li>
            <li>• Create a smaller page set before merging, numbering, or organizing it.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'Page selection is by clicking thumbnails; typed page numbers and page-range syntax are not available.',
          'Extracted pages keep their original relative order and cannot be rearranged on this page.',
          'Every-page mode provides separate downloads and does not create a ZIP or automatically download all files at once.',
          'All page thumbnails are rendered in the browser, so PDFs with many complex pages can take significant time and memory.',
          'Password-protected, encrypted, damaged, unusually structured, or unrenderable PDFs may fail to load or split.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Choose the right pages before splitting">
          <p>Use the thumbnail labels to confirm that your selection begins and ends where expected. In Extract pages mode, nonconsecutive selections are allowed, but the output always follows the source document&apos;s order. The filename shows only the first and last selected page, so inspect the downloaded PDF to confirm every intended page is present.</p>
          <p>If your goal is simply to delete a few pages while keeping and rearranging the rest, Organize PDF may be the clearer workflow. Keep the original document until you have checked the new files.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
