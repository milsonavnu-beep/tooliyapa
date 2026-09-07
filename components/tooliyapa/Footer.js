import Link from 'next/link'
import DiceLogo from '@/components/tooliyapa/DiceLogo'

export default function Footer() {
  const linkGroups = [
    { title: 'Useful links', links: [['Home', '/'], ['About', '/about'], ['Contact', '/contact']] },
    { title: 'Legal', links: [['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Disclaimer', '/disclaimer']] },
    { title: 'Popular PDF tools', links: [['Merge PDF', '/merge-pdf'], ['Split PDF', '/split-pdf'], ['Compress PDF', '/compress-pdf'], ['Page Numbers', '/page-numbers']] },
  ]

  return (
    <footer className="mt-12 border-t border-gray-200/70 bg-white/70 dark:border-gray-800 dark:bg-gray-950/70">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2 group" aria-label="Tooliyapa Home">
              <DiceLogo size={32} />
              <span className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">Tooliya<span className="text-red-600">pa</span></span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">Practical browser-based tools for merging, splitting, organizing, converting, and editing PDF documents.</p>
          </div>
          {linkGroups.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                {links.map(([label, href]) => <li key={href}><Link className="transition hover:text-teal-700 dark:hover:text-teal-400" href={href}>{label}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 text-sm leading-6 text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:flex sm:items-start sm:justify-between sm:gap-8">
          <p>&copy; {new Date().getFullYear()} Tooliyapa</p>
          <p className="mt-2 max-w-2xl sm:mt-0 sm:text-right">PDF files are processed in your browser and are not uploaded to Tooliyapa servers as part of the PDF-processing workflow.</p>
        </div>
      </div>
    </footer>
  )
}
