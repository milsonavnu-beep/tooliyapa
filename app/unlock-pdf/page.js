import UnlockPdfTool from '@/components/tooliyapa/UnlockPdfTool'
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

const description = 'Attempt to remove common owner-permission restrictions by rewriting a PDF you can already open. Open-password decryption is not supported.'

export const metadata = createPageMetadata({ title: 'Remove PDF Restrictions Online', description, pathname: '/unlock-pdf' })

const faqs = [
  { question: 'What PDF restrictions can this tool attempt to remove?', answer: 'It is intended for common owner or permission restrictions, such as print or copy limits, on PDFs that are already readable. Support depends on the file’s structure and encryption.' },
  { question: 'What is the difference between owner restrictions and an open password?', answer: 'Owner permissions can limit actions after a PDF is open. An open or user password encrypts access to the document itself. This tool addresses the first case where supported; it does not decrypt the second.' },
  { question: 'Why is there no password field?', answer: 'There is no password field because the tool does not guess, brute-force, crack, or use an open password to decrypt a password-required PDF.' },
  { question: 'How does the tool create the unrestricted copy?', answer: 'It loads the readable PDF with pdf-lib where possible, creates a new PDF, copies the source pages into it, and re-saves the result without supported owner-permission restrictions.' },
  { question: 'Is removal guaranteed for every readable PDF?', answer: 'No. Results depend on the PDF structure, encryption, and features. Unsupported security, damaged files, and unusual documents may fail or remain restricted.' },
  { question: 'Will every specialized PDF feature be preserved?', answer: 'Not necessarily. Rewriting and copying pages may not preserve forms, signatures, attachments, scripts, layers, or other specialized features exactly. Check the result carefully.' },
  { question: 'When may I use this tool?', answer: 'Use it only for documents you own or have permission to modify. It is intended to make an authorized, already readable document easier to print, copy, or process where supported.' },
]

const relatedTools = [
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Reorder, rotate, or remove pages after confirming the rewritten copy.' },
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Combine readable PDF documents into one file.' },
  { href: '/split-pdf', title: 'Split PDF', description: 'Extract selected pages or make a separate PDF for every page.' },
  { href: '/compress-pdf', title: 'Compress PDF', description: 'Try lossless structural optimization on a readable document.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/unlock-pdf" name="Remove PDF Restrictions" description={description} faqs={faqs} />
      <UnlockPdfTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Confirm that the PDF already opens and that you own it or have permission to modify it.',
          'Add the single PDF. No password field appears because this tool does not decrypt open-password files.',
          'Select Remove restrictions to attempt to copy the readable pages into a newly saved PDF.',
          'Download the file ending in “-unrestricted.pdf” and verify its pages, permissions, and important features.',
        ]} />

        <ToolInfoSection title="What removing owner restrictions means">
          <p>A PDF can have owner or permission settings that limit actions such as printing or copying after the document is already open. This tool uses pdf-lib where possible to load that readable PDF, create a new PDF, copy its pages, and re-save them. Common permission restrictions may be absent from the rewritten copy when the source structure is supported.</p>
          <p>An open password is different: it encrypts access and must be supplied before the document can be read. This tool has no password field and does not guess passwords, brute-force them, crack encryption, or decrypt a PDF that requires an open or user password.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When this restriction-removal tool may help" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Re-save an authorized, readable PDF whose owner permissions limit printing.</li>
            <li>• Create a workable copy when copy restrictions interfere with an approved workflow.</li>
            <li>• Prepare readable page content for organizing, splitting, or merging where supported.</li>
            <li>• Replace a permission-limited copy when you control or are authorized to modify the document.</li>
          </ul>
          <p>Only remove restrictions from documents you own or have permission to modify.</p>
        </ToolInfoSection>

        <ToolLimitations items={[
          'The PDF must already be readable or openable. Open/user-password encryption is not supported, and the tool does not crack, guess, brute-force, or decrypt passwords.',
          'Removal is not guaranteed. Success depends on the PDF structure, encryption method, permission settings, and pdf-lib support.',
          'The tool targets common owner or permission restrictions; it does not bypass every PDF security mechanism.',
          'Copying pages into a new document may not preserve interactive forms, signatures, attachments, scripts, layers, annotations, or other specialized features exactly.',
          'Always inspect the rewritten file for page appearance, content, functionality, and intended permissions before relying on it.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Know the difference between permissions and passwords">
          <p>If a PDF viewer asks for a password before showing any page, that is open/user-password encryption and this tool cannot process it. If the PDF opens normally but the viewer reports that printing or copying is not permitted, it may use owner permissions that this rewrite can attempt to remove.</p>
          <p>Even when the pages are readable, rewriting is not a guarantee. Compare the downloaded copy with the source, test the action you need, and examine forms, links, signatures, annotations, attachments, layers, and other important features. Keep the source document until the new copy has been checked.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
