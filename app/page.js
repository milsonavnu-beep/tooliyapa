import HomePage from '@/components/tooliyapa/HomePage'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Free Online Tools — PDF, Documents, Text, Calculators & Converters',
  description: 'Use free browser-based PDF tools, document converters and inspectors, text utilities, calculators, and converters for everyday productivity tasks.',
  pathname: '/',
})

export default function Page() { return <HomePage /> }
