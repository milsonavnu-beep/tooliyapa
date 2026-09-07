import HomePage from '@/components/tooliyapa/HomePage'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Free Online PDF Tools',
  description: 'Merge, split, organize, rotate, convert, number, watermark, and optimize PDFs with browser-based tools. Files are processed locally in your browser.',
  pathname: '/',
})

export default function Page() {
  return <HomePage />
}
