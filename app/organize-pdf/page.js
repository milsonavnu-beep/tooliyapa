import OrganizePdfTool from '@/components/tooliyapa/OrganizePdfTool'
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

const description = 'Organize one PDF with page thumbnails: drag pages into a new order, remove pages, or rotate individual pages clockwise before downloading a new copy.'

export const metadata = createPageMetadata({ title: 'Organize PDF Pages Online', description, pathname: '/organize-pdf' })

const faqs = [
  { question: 'Can I reorder pages with drag and drop?', answer: 'Yes. Drag a page tile to another position. The downloaded PDF follows the final tile order shown in the organizer.' },
  { question: 'Can I remove pages from the PDF?', answer: 'Yes. Use a page tile’s delete control to remove it from the working list. At least one page must remain before the tool can save a result.' },
  { question: 'Can I rotate pages while organizing?', answer: 'Yes. Each click on a page tile’s rotate control adds a 90-degree clockwise turn. The thumbnail reflects that pending rotation.' },
  { question: 'Does the organizer show page previews?', answer: 'Yes. It renders a thumbnail for every page and labels it with that page’s original page number. Complex or numerous pages may take longer to render.' },
  { question: 'Can I undo one change or restore a deleted page?', answer: 'There is no per-action undo or restore control. Removing the selected file resets the whole workspace, after which you can upload the original PDF and start again.' },
  { question: 'How is Organize PDF different from Merge PDF or Split PDF?', answer: 'Organize edits the order, inclusion, and orientation of pages within one PDF. Merge appends whole PDF files, while Split extracts selected pages or creates one file per page.' },
  { question: 'What filename does the organizer create?', answer: 'The download keeps the source filename stem and adds “-organized.pdf”. Your original file is not overwritten.' },
]

const relatedTools = [
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Append several whole PDFs after organizing pages within each source file.' },
  { href: '/split-pdf', title: 'Split PDF', description: 'Extract a selected page set or create a separate PDF for every page.' },
  { href: '/rotate-pdf', title: 'Rotate PDF', description: 'Apply one angle to all pages or to a typed list of page numbers and ranges.' },
  { href: '/page-numbers', title: 'Add Page Numbers', description: 'Number every page after the document is in its final sequence.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/organize-pdf" name="Organize PDF Pages" description={description} faqs={faqs} />
      <OrganizePdfTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Upload one PDF and wait while a labeled thumbnail is rendered for each page.',
          'Drag page tiles into their intended order. Use a tile’s controls to rotate it clockwise or remove it.',
          'Review the complete thumbnail grid, then select Apply changes to build a new PDF.',
          'Download the file ending in “-organized.pdf” and inspect the finished page order and orientation.',
        ]} />

        <ToolInfoSection title="What you can organize">
          <p>This tool provides a thumbnail grid for one PDF. You can drag pages into a new sequence, remove pages from the working document, and rotate individual pages in 90-degree clockwise steps. Original page-number labels help identify where each tile came from even after it moves.</p>
          <p>When you apply changes, the browser copies the remaining source pages in the displayed order, applies each pending rotation, and creates one new PDF. The selected source file itself is not modified.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When to organize a PDF" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Correct pages captured in the wrong scan order.</li>
            <li>• Remove blank sheets, duplicates, or unwanted supporting pages.</li>
            <li>• Arrange forms, appendices, or report sections into a clearer sequence.</li>
            <li>• Set the final page order and orientation before numbering or merging documents.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'The organizer accepts one PDF at a time. It does not append multiple source files like Merge PDF.',
          'There is no individual undo, restore, or reset-order button. To discard changes, remove the file and upload the original again.',
          'Page removal does not create separate extracted files; Apply changes creates one PDF from all remaining tiles.',
          'The tool renders every thumbnail in the browser, so long or visually complex PDFs can take time and substantial device memory.',
          'Password-protected, encrypted, damaged, unusually structured, or very large PDFs may fail to load, render, copy, or save.',
        ]} />

        <PrivacyNote />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Put pages in their final order">
          <p>Read the thumbnail grid from left to right and top to bottom, checking the original page-number labels as you go. Confirm that no necessary page was removed and that rotated thumbnails are upright. If you make a mistake that is difficult to reverse manually, reload the source file and begin again.</p>
          <p>Organize before adding page numbers so numbering follows the final sequence. Use Merge PDF when you need to combine separate documents, Split PDF when you need separate outputs, and Rotate PDF when the same rotation should apply to all pages or a typed page selection.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
