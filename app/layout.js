import './globals.css'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'
import Header from '@/components/tooliyapa/Header'
import Footer from '@/components/tooliyapa/Footer'
import { SITE_URL } from '@/lib/site'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Tooliyapa - Free Online PDF Tools', template: '%s | Tooliyapa' },
  description: 'Free, fast online PDF tools. Merge, split, compress, rotate, organize, watermark and convert PDFs in your browser — files are not uploaded to Tooliyapa servers.',
  keywords: 'PDF tools, merge PDF, split PDF, compress PDF, rotate PDF, JPG to PDF, PDF to JPG, watermark PDF, page numbers, unlock PDF, free PDF online',
  authors: [{ name: 'Tooliyapa' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Tooliyapa - Free Online PDF Tools',
    description: 'Merge, split, compress and convert PDFs in your browser. Files are not uploaded to Tooliyapa servers.',
    type: 'website',
    siteName: 'Tooliyapa',
    // Per-page metadata (homepage, /pdf, tools) sets openGraph.url explicitly.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tooliyapa - Free Online PDF Tools',
    description: 'Merge, split, compress and convert PDFs in your browser. Files are not uploaded to Tooliyapa servers.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: '/favicon.svg',
  },
  alternates: { canonical: '/' },
}

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#dc2626' }

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Google AdSense — advertising network (separate from file processing) */}
      <Script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5475600467474553"
        crossOrigin="anonymous"
      />

      <body className="min-h-screen font-sans antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-rose-50/40 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
