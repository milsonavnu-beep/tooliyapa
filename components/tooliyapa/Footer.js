export default function Footer() {
  return (
    <footer className="border-t border-gray-200/70 dark:border-gray-800 bg-white/60 dark:bg-gray-950/60 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-700 dark:text-gray-200">Tooliyapa</span>. All PDF processing happens in your browser — your files never leave your device.
        </p>
      </div>
    </footer>
  )
}
