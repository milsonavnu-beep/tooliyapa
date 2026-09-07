import { InfoList, InfoPage, InfoSection, TextLink } from '@/components/tooliyapa/InfoPage'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'About Tooliyapa — Browser-Based PDF Tools',
  description: 'Learn what Tooliyapa offers, how its browser-based PDF processing works, and how advertising may support its free utility tools.',
  pathname: '/about',
})

export default function Page() {
  return (
    <InfoPage eyebrow="About" title="About Tooliyapa" intro="Tooliyapa is a collection of practical PDF utilities designed to make common document tasks straightforward in a modern web browser.">
      <InfoSection title="Practical tools for everyday PDF tasks">
        <p>Tooliyapa currently lets you merge and split PDFs, rotate or organize pages, add page numbers or text watermarks, optimize PDF structure, convert images to PDF, export PDF pages as JPG files, and remove certain owner restrictions. Each tool has a focused workflow rather than requiring a large desktop application.</p>
        <p>The site prioritizes clear controls, accessible pages, and useful explanations of what each tool can and cannot do. Tooliyapa is still evolving, so its tools, documentation, and interface may improve over time.</p>
      </InfoSection>
      <InfoSection title="How file processing works">
        <p>PDF files selected for Tooliyapa&apos;s tools are read and processed in your browser. They are not uploaded to Tooliyapa servers as part of the normal PDF-processing workflow, and the resulting file is generated for you to download from the browser.</p>
        <p>No user account is currently required. Ordinary website requests and third-party services are separate from PDF file processing; details are available in the <TextLink href="/privacy">Privacy Policy</TextLink>.</p>
      </InfoSection>
      <InfoSection title="Keeping the service available">
        <p>Tooliyapa aims to keep its utility tools free to use. Advertising, including advertising supplied by third-party services, may help support the cost of operating and improving the website. An advertisement is not a Tooliyapa endorsement of every product or service shown.</p>
        <InfoList>
          <li>Read the rules for using the site in the <TextLink href="/terms">Terms of Use</TextLink>.</li>
          <li>Questions, corrections, and feedback are welcome through the <TextLink href="/contact">Contact page</TextLink>.</li>
        </InfoList>
      </InfoSection>
    </InfoPage>
  )
}
