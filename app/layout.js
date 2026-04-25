import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Tooliyapa - Free Online PDF Tools | Merge & Compress PDF',
  description: 'Tooliyapa offers free, fast, and secure online PDF tools. Merge multiple PDFs or compress PDF size — all processed in your browser. No upload to server.',
  keywords: 'PDF merge, PDF compress, free PDF tools, online PDF, Tooliyapa, merge PDF online, compress PDF online',
  authors: [{ name: 'Tooliyapa' }],
  openGraph: {
    title: 'Tooliyapa - Free Online PDF Tools',
    description: 'Merge and compress PDFs in your browser. Fast, free, and private.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#dc2626',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
