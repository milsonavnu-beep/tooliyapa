import JpgToPdfTool from '@/components/tooliyapa/JpgToPdfTool'
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

const description = 'Combine JPG, JPEG, and PNG images into one PDF with one image per page. Reorder images and choose A4, Letter, or image-sized pages in your browser.'

export const metadata = createPageMetadata({ title: 'JPG and PNG to PDF Online', description, pathname: '/jpg-to-pdf' })

const faqs = [
  { question: 'Which image formats can I add?', answer: 'The upload accepts JPG, JPEG, and PNG files. It does not advertise other image formats, and an unusual, corrupt, or unsupported image may fail to decode or embed.' },
  { question: 'How is the PDF page order decided?', answer: 'Each image becomes one PDF page, and the current image-list order becomes the page order. Use the move-up and move-down controls to change it before converting.' },
  { question: 'What is the difference between A4, Letter, and Fit image?', answer: 'A4 and Letter use standard page dimensions and scale the image proportionally to fit. Fit image uses the embedded image dimensions directly for that page rather than placing it on an A4 or Letter sheet.' },
  { question: 'How does Auto orientation work?', answer: 'For A4 or Letter, Auto uses landscape when an image is wider than it is tall and portrait otherwise. Portrait and Landscape force the selected orientation. Fit image follows the image dimensions directly.' },
  { question: 'Does the converter run OCR or make text searchable?', answer: 'No. It embeds each image on a PDF page and does not recognize text, add a searchable text layer, or enhance image resolution.' },
  { question: 'Does conversion change my original images?', answer: 'No. The selected image files remain unchanged. The browser creates one new PDF with a timestamped filename beginning with “images-”.' },
]

const relatedTools = [
  { href: '/pdf-to-jpg', title: 'PDF to JPG', description: 'Render every page of a PDF as a separate JPG image.' },
  { href: '/merge-pdf', title: 'Merge PDF', description: 'Append the image PDF to other PDF documents.' },
  { href: '/organize-pdf', title: 'Organize PDF', description: 'Reorder, rotate, or remove pages after creating the PDF.' },
  { href: '/compress-pdf', title: 'Compress PDF', description: 'Try lossless structural optimization on the finished document.' },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData pathname="/jpg-to-pdf" name="JPG and PNG to PDF" description={description} faqs={faqs} />
      <JpgToPdfTool />
      <ToolPageContent>
        <HowToUse steps={[
          'Add one or more JPG, JPEG, or PNG images and review their previews.',
          'Use the up and down controls to set page order; remove individual images or clear the list if needed.',
          'Choose A4, Letter, or Fit image, then choose Auto, Portrait, or Landscape orientation.',
          'Convert the images, download the new PDF, and check every page before sharing it.',
        ]} />

        <ToolInfoSection title="What this image-to-PDF tool does">
          <p>The tool creates one PDF from the current image list, with one JPG, JPEG, or PNG image on each page. The visible list controls PDF page order. Explicit move-up and move-down buttons change that sequence; individual removal and a Clear action let you revise the list.</p>
          <p>Standard images are embedded with pdf-lib. On each page, the image is scaled proportionally to fit and centered, so its aspect ratio is retained. The result is one downloadable PDF named with an <span className="font-medium">images-</span> timestamp; the original image files are not overwritten.</p>
        </ToolInfoSection>

        <ToolInfoSection title="When converting images to PDF is useful" icon={CheckCircle2}>
          <ul className="space-y-2">
            <li>• Combine photographed document pages into one ordered file.</li>
            <li>• Assemble scans or receipt images into a single record.</li>
            <li>• Create a simple portfolio or contact packet from image files.</li>
            <li>• Put related screenshots into a PDF that is easier to distribute.</li>
          </ul>
        </ToolInfoSection>

        <ToolLimitations items={[
          'Only JPG/JPEG and PNG are accepted; unusual, corrupt, mislabeled, or unsupported images may fail to decode or embed.',
          'The tool does not perform OCR, create searchable text, or enhance the source image resolution.',
          'A4 and Letter fit and center each image within a standard page. Fit image instead uses the image dimensions directly and does not add A4 or Letter margins.',
          'Conversion does not guarantee a smaller file. Output size depends on the images and PDF structure.',
          'Many high-resolution images can require substantial browser and device memory and may process slowly or fail.',
        ]} />

        <PrivacyNote fileDescription="selected image files" />
        <ToolFAQ items={faqs} />
        <RelatedTools tools={relatedTools} />

        <ToolInfoSection title="Prepare images for a clean PDF">
          <p>Crop, rotate, and check each source image before uploading because this tool does not edit image content. Arrange the previews in reading order and choose A4 or Letter when consistent standard sheets matter. Use Fit image when each PDF page should follow its image dimensions.</p>
          <p>Auto orientation can keep wide images on landscape A4 or Letter pages and tall images on portrait pages. After download, inspect page order, orientation, legibility, and any blank space before distributing the PDF.</p>
        </ToolInfoSection>
      </ToolPageContent>
    </>
  )
}
