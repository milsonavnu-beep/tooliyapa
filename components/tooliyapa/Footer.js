import Link from 'next/link'
import DiceLogo from '@/components/tooliyapa/DiceLogo'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 mt-12">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-3 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Tooliyapa Home">
          <DiceLogo size={28} />
          <span className="text-base font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Tooliya<span className="text-red-600">pa</span>
          </span>
        </Link>
        <p>
          &copy; {new Date().getFullYear()} Tooliyapa. All PDF processing happens in your browser — your files never leave your device.
        </p>
      </div>
    </footer>
  )
}
