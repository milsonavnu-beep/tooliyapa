import CompressPdfTool from '@/components/tooliyapa/CompressPdfTool'
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

const description = 'Optimize a PDF with lossless object-stream rewriting and optional metadata removal. Processing happens in your browser, without image recompression.'

export const metadata = createPageMetadata({
  title: 'Compress PDF — Lossless PDF Optimization',
  description,
  pathname: '/compress-pdf',
})

const faqs = [
  { question: 'Will this tool reduce image quality?', answer: 'No. It does not resize or re-encode embedded images. It rewrites the PDF structure losslessly, so images keep their existing data and quality.' },
  { question: 'Why is my optimized PDF the same size or larger?', answer: 'The file may already use efficient object streams, or most of its size may come from compressed images. Re-saving a well-optimized PDF can produce little change and can occasionally add a small amount of structural data.' },
  { question: 'What is the difference between Standard and Maximum?', answer: 'Both use object streams. Maximum also clears common document metadata fields such as title, author, subject, keywords, creator, and producer. It does not remove visible page content.' },
  { question: 'What does Legacy mode do?', answer: 'Legacy mode saves without object streams for broader compatibility with older PDF software. It is not intended to achieve the smallest file and may increase file size.' },
  { question: 'Can it compress scanned PDFs?', answer: 'It can process them, but scanned pages are usually stored as images. Because this tool does not recompress images, a scan may shrink very little or not at all.' },
  { question: 'Can it open password-protected or damaged PDFs?', answer: 'Not reliably. A file that requires a password to open, uses unsupported encryption, or is corrupt may fail. Remove the open password or repair the file before trying again.' },
]

const relatedTools = [
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Combine several PDFs into one document before optimizing it.' },
  { href: '/split-pdf', title: 'Split PDF', description: 'Extract selected pages when removing unneeded pages is the better way to reduce a document.' },
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Reorder or remove pages from a PDF.' },
  { href: '/pdf-to-jpg', title: 'PDF to JPG', description: 'Turn PDF pages into images when an image-based output is appropriate.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/compress-pdf" name="Compress PDF" description={description} faqs={faqs} />
      <CompressPdfTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Choose one PDF by clicking the upload area or dragging the file onto it.',
          'Select Legacy, Standard, or Maximum based on compatibility and metadata needs.',
          'Select Optimize PDF and wait while the browser rewrites the document.',
          'Compare the displayed sizes, then download the optimized copy or try another file.',
        ]} />

        <ToolInfoSection title="What this tool does">
          <p>This tool loads the document with pdf-lib and saves a new, losslessly rewritten PDF. Standard and Maximum enable PDF object streams, which can store eligible PDF objects more compactly. Maximum also clears common metadata fields. Legacy saves without object streams for older-reader compatibility.</p>
          <p>No embedded image is downscaled or re-encoded. Text and other page content are not intentionally altered, so this is structural optimization rather than the lossy image compression offered by some desktop tools.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When to use this tool" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Before sharing a text-heavy PDF that may contain inefficient internal structure.</li>
            <li>• After merging, splitting, or editing a PDF when you want a clean rewritten copy.</li>
            <li>• When you want to remove common descriptive metadata by choosing Maximum.</li>
            <li>• When preserving existing image quality matters more than achieving a dramatic reduction.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'Compression is lossless structural optimization; it does not reduce image resolution or JPEG quality.',
          'Image-heavy and scanned PDFs may see little or no reduction because their images are not recompressed.',
          'Already optimized files may remain the same size, and some files may become slightly larger after being rewritten.',
          'If a strict upload limit requires a much smaller scan, you may need an image-recompression workflow that trades visual quality for size.',
          'Maximum clears common metadata fields but is not a forensic metadata-removal or redaction tool.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Choose the right next step">
          <p>If the result is small enough, open the downloaded copy and check important pages before sharing it. If the PDF is still too large, remove unnecessary pages with Split PDF or Organize PDF. For image-heavy scans, this lossless tool may not be the right approach because meaningful reductions usually require image recompression.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
