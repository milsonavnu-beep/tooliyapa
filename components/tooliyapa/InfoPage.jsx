import Link from 'next/link'

export function InfoPage({ eyebrow, title, intro, lastUpdated, children }) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <header className="border-b border-gray-200 pb-8 dark:border-gray-800">
        <p className="text-sm font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">{intro}</p>
        {lastUpdated && <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">Last updated: {lastUpdated}</p>}
      </header>
      <div className="mt-10 space-y-8">{children}</div>
    </div>
  )
}

export function InfoSection({ title, children }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
      <h2 id={id} className="text-2xl font-bold text-gray-900 dark:text-gray-50">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  )
}

export function InfoList({ children }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-red-600 dark:marker:text-red-400">{children}</ul>
}

export function TextLink({ href, children, external = false }) {
  const classes = 'font-medium text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
  return external
    ? <a className={classes} href={href} target="_blank" rel="noreferrer">{children}</a>
    : <Link className={classes} href={href}>{children}</Link>
}
