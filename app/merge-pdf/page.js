import MergePdfTool from '@/components/tooliyapa/MergePdfTool'
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

const description = 'Combine two or more PDF files in your chosen file order and download one new PDF. Reorder files with drag and drop; processing runs in your browser.'

export const metadata = createPageMetadata({
  title: 'Merge PDF Files Online',
  description,
  pathname: '/merge-pdf',
})

const faqs = [
  { question: 'How many PDFs do I need to start a merge?', answer: 'Add at least two PDF files. The merge button remains unavailable until two files are in the list.' },
  { question: 'How is the final page order decided?', answer: 'The file list controls the order. Every page from the first file is appended in its existing order, followed by every page from the second file, and so on.' },
  { question: 'Can I rearrange individual pages while merging?', answer: 'No. This page reorders whole source files, not pages inside them. Use Organize PDF on a source document first if its internal page sequence needs to change.' },
  { question: 'Does merging overwrite my original PDFs?', answer: 'No. The browser creates a new PDF for download, while the selected source files remain unchanged.' },
  { question: 'Will the merged PDF be smaller?', answer: 'Not necessarily. Merging combines pages; it is not a compression operation. Use Compress PDF afterward if you want to try lossless structural optimization.' },
  { question: 'Does this tool make scanned pages searchable?', answer: 'No. Scanned images are carried into the new document, but the tool does not perform OCR or add searchable text.' },
  { question: 'Can I merge an encrypted, password-protected, or damaged PDF?', answer: 'Not reliably. A PDF that needs a password, uses unsupported encryption, is corrupt, or contains unusual features may fail to load or save correctly.' },
]

const relatedTools = [
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Reorder, rotate, or remove pages within one source PDF before combining files.' },
  { href: '/split-pdf', title: 'Split PDF', description: 'Extract only the pages you want to include in a combined document.' },
  { href: '/compress-pdf', title: 'Compress PDF', description: 'Try lossless structural optimization after creating the merged file.' },
  { href: '/page-numbers', title: 'Add Page Numbers', description: 'Number the completed document after its files and pages are in final order.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/merge-pdf" name="Merge PDF Files" description={description} faqs={faqs} />
      <MergePdfTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Add two or more PDFs by dropping them into the upload area or choosing them from your device.',
          'Drag the file rows into the order in which their pages should appear. Remove any file you do not need.',
          'Select Merge PDFs and follow the progress while the browser appends each document.',
          'Download the new merged PDF, open it, and confirm its page sequence and content.',
        ]} />

        <ToolInfoSection title="What this tool does">
          <p>Merge PDF creates one new document from multiple PDFs. It copies all pages from each selected file and appends them according to the visible file list: the complete first PDF, then the complete second PDF, followed by any remaining files.</p>
          <p>You can add more files, drag whole files into a different position, remove one file, or clear the list before merging. A progress indicator tracks processing, and the finished download receives a name beginning with <span className="font-medium">merged-</span>.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When to merge PDF files" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Assemble report sections, chapters, or project documents into one handoff.</li>
            <li>• Combine separately scanned forms or supporting attachments in a known order.</li>
            <li>• Group invoices, receipts, or statements into a single record.</li>
            <li>• Build one packet before adding page numbers to the complete sequence.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'Reordering applies to whole files. Pages inside each source PDF keep their existing order.',
          'Merging does not compress images or guarantee a smaller file, and it does not run OCR on scans.',
          'Password-protected, encrypted, corrupt, or unusually structured PDFs may fail to load, copy, or save.',
          'Some interactive forms, signatures, attachments, scripts, or other specialized PDF features may not survive rewriting exactly as they appeared.',
          'Available memory and processing time depend on your browser and device, so very large or numerous PDFs may be slow or fail.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Prepare files before merging">
          <p>Name or review each source file so you can recognize it in the list, then place the files in their intended reading order. If pages within a file are out of sequence, organize that PDF first; the merge screen only changes the order of whole documents.</p>
          <p>After downloading, inspect the boundaries between source files, page orientation, forms, links, and any other important content. Keep the originals until you have confirmed that the new combined copy meets your needs.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
