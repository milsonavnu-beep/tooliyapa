import { TextCategoryPage } from '@/components/tooliyapa/TextUI'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Free Online Text Tools',
  description: 'Count, analyze, compare, transform, summarize, and clean up text with transparent browser-based tools.',
  pathname: '/text',
})

export default function Page(){ return <TextCategoryPage/> }
