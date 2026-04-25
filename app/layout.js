import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/tooliyapa/Header'
import Footer from '@/components/tooliyapa/Footer'

export const metadata = {
  metadataBase: new URL('https://swift-pdf-tools.preview.emergentagent.com'),
  title: { default: 'Tooliyapa - Free Online PDF Tools', template: '%s | Tooliyapa' },
  description: 'Free, fast and private online PDF tools. Merge, split, compress, rotate, organize, watermark and convert PDFs entirely in your browser.',
  keywords: 'PDF tools, merge PDF, split PDF, compress PDF, rotate PDF, JPG to PDF, PDF to JPG, watermark PDF, page numbers, unlock PDF, free PDF online',
  authors: [{ name: 'Tooliyapa' }],
  openGraph: { title: 'Tooliyapa - Free Online PDF Tools', description: 'Merge, split, compress and convert PDFs in your browser. Free and private.', type: 'website' },
  icons: { icon: '/favicon.svg' },
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#dc2626' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></head>
      <body className="min-h-screen font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50/40 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
