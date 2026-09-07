import { InfoList, InfoPage, InfoSection } from '@/components/tooliyapa/InfoPage'
import { createPageMetadata } from '@/lib/site'

const email = 'milsonavnu@gmail.com'

export const metadata = createPageMetadata({
  title: 'Contact Tooliyapa — Feedback and Support',
  description: 'Contact Tooliyapa by email about website feedback, technical problems, privacy, copyright concerns, corrections, or general questions.',
  pathname: '/contact',
})

export default function Page() {
  return (
    <InfoPage eyebrow="Get in touch" title="Contact Tooliyapa" intro="Send an email when you have a question about Tooliyapa or want to report something that could make the website more useful or accurate.">
      <InfoSection title="What you can contact us about">
        <InfoList>
          <li>Website feedback and feature suggestions</li>
          <li>Technical problems with a page or PDF tool</li>
          <li>Incorrect or unclear website content</li>
          <li>Privacy questions</li>
          <li>Copyright concerns</li>
          <li>General inquiries</li>
        </InfoList>
      </InfoSection>
      <section aria-labelledby="email-tooliyapa" className="rounded-2xl border border-red-200 bg-red-50/70 p-6 dark:border-red-900 dark:bg-red-950/20 sm:p-8">
        <h2 id="email-tooliyapa" className="text-2xl font-bold text-gray-900 dark:text-gray-50">Email Tooliyapa</h2>
        <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">The public contact address is:</p>
        <a className="mt-3 inline-flex break-all rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950" href={`mailto:${email}`}>{email}</a>
        <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">Please include the relevant page, browser, and a brief description when reporting a technical issue. Avoid emailing confidential PDF files. We aim to review messages as soon as practical.</p>
      </section>
    </InfoPage>
  )
}
