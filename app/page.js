import HomePage from '@/components/tooliyapa/HomePage'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Free Online Tools — PDF, Calculators & Converters',
  description: 'Use free browser-based PDF tools, calculators, and converters for everyday document, math, finance, unit, encoding, and productivity tasks.',
  pathname: '/',
})

export default function Page() { return <HomePage /> }
