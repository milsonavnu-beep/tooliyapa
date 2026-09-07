import { InfoPage, InfoSection } from '@/components/tooliyapa/InfoPage'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({ title: 'Disclaimer', description: 'Important information about reviewing Tooliyapa PDF output, retaining backups, file compatibility, and third-party services.', pathname: '/disclaimer' })

export default function Page() {
  return (
    <InfoPage eyebrow="Important information" title="Disclaimer" intro="Tooliyapa provides convenient document utilities, but users should decide whether each result is appropriate for their needs." lastUpdated="September 7, 2026">
      <InfoSection title="Service and output"><p>Tooliyapa&apos;s utility tools are provided on an “as available” basis. PDF conversion, optimization, or manipulation may occasionally fail or produce unexpected results, particularly with unusual, damaged, encrypted, password-protected, or unsupported documents.</p><p>Review every generated document before relying on or sharing it. Retain original copies and separate backups of important files. Tooliyapa is not responsible for decisions made solely on the basis of tool output.</p></InfoSection>
      <InfoSection title="Third-party content and advertising"><p>Third-party links and services are governed by their own terms, policies, and technical practices. The presence of an advertisement does not mean Tooliyapa endorses every advertised product, service, or claim. Evaluate third-party offerings independently.</p></InfoSection>
      <InfoSection title="Questions"><p>For a question about this disclaimer, email <a className="font-medium text-red-700 underline underline-offset-4 dark:text-red-400" href="mailto:milsonavnu@gmail.com">milsonavnu@gmail.com</a>. For more detail about permitted use, see the Terms of Use; for data practices, see the Privacy Policy.</p></InfoSection>
    </InfoPage>
  )
}
