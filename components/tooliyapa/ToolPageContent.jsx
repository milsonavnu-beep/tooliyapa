import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Info, LockKeyhole, TriangleAlert } from 'lucide-react'
import { canonicalUrl, SITE_NAME } from '@/lib/site'

const panelStyles = 'rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-900'

export function HowToUse({ steps }) {
  return (
    <section aria-labelledby="how-to-use">
      <h2 id="how-to-use" className="text-2xl font-bold text-gray-900 dark:text-gray-50">How to use this tool</h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step} className={`${panelStyles} flex gap-4`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white dark:bg-gray-100 dark:text-gray-900">{index + 1}</span>
            <p className="pt-1 text-sm leading-6 text-gray-700 dark:text-gray-300">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function ToolInfoSection({ title, children, icon: Icon = Info }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return (
    <section className={panelStyles} aria-labelledby={id}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
        <div>
          <h2 id={id} className="text-xl font-bold text-gray-900 dark:text-gray-50">{title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{children}</div>
        </div>
      </div>
    </section>
  )
}

export function ToolLimitations({ items }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 dark:border-amber-900 dark:bg-amber-950/20" aria-labelledby="important-limitations">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
        <div>
          <h2 id="important-limitations" className="text-xl font-bold text-gray-900 dark:text-gray-50">Important limitations</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
            {items.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true">•</span><span>{item}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function PrivacyNote({ fileDescription = 'PDF' }) {
  return (
    <ToolInfoSection title="File privacy" icon={LockKeyhole}>
      <p>Your {fileDescription} {fileDescription === 'PDF' ? 'is' : 'are'} read and processed in your browser. The selected {fileDescription} {fileDescription === 'PDF' ? 'is' : 'are'} not uploaded to Tooliyapa servers as part of that workflow. When processing finishes, you download the new file directly from the browser.</p>
      <p>This statement applies to the PDF-processing workflow; the site may still load ordinary site services or third-party scripts as described by the site&apos;s configuration.</p>
    </ToolInfoSection>
  )
}

export function ToolFAQ({ items }) {
  return (
    <section aria-labelledby="frequently-asked-questions">
      <h2 id="frequently-asked-questions" className="text-2xl font-bold text-gray-900 dark:text-gray-50">Frequently asked questions</h2>
      <div className="mt-4 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-5 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {items.map(({ question, answer }) => (
          <article key={question} className="py-5">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">{question}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function RelatedTools({ tools }) {
  return (
    <section aria-labelledby="related-pdf-tools">
      <h2 id="related-pdf-tools" className="text-2xl font-bold text-gray-900 dark:text-gray-50">Related PDF tools</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {tools.map(({ href, title, description }) => (
          <Link key={href} href={href} className={`${panelStyles} group transition hover:border-red-300 hover:shadow-sm dark:hover:border-red-900`}>
            <h3 className="font-semibold text-gray-900 group-hover:text-red-600 dark:text-gray-50 dark:group-hover:text-red-400">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function ToolPageContent({ children }) {
  return <div className="container mx-auto max-w-4xl space-y-10 px-4 pb-16 sm:pb-20">{children}</div>
}

export function ToolStructuredData({ pathname, name, description, faqs }) {
  const url = canonicalUrl(pathname)
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${url}#application`,
        name,
        description,
        url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any operating system with a modern web browser',
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: canonicalUrl('/') },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

export { CheckCircle2 }
