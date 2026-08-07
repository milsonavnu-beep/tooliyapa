import Link from 'next/link'
import DiceLogo from '@/components/tooliyapa/DiceLogo'
import { getActiveCategories } from '@/lib/tools/categories'

export default function Footer() {
  const categories = getActiveCategories()

  return (
    <footer className="border-t border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 mt-12">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-3 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Tooliyapa Home">
          <DiceLogo size={28} />
          <span className="text-base font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Tooliya<span className="text-red-600">pa</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="Footer">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={cat.href} className="hover:text-red-600 transition-colors">
              {cat.name}
            </Link>
          ))}
        </nav>
        <p>
          &copy; {new Date().getFullYear()} Tooliyapa. PDF tools run in your browser — files are not uploaded
          to Tooliyapa servers.
        </p>
      </div>
    </footer>
  )
}
