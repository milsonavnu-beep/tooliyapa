import { TextToolPage } from '@/components/tooliyapa/TextUI'
import { textMetadata } from '@/lib/text-tools'
export const metadata = textMetadata('extractive-summarizer')
export default function Page(){ return <TextToolPage toolId="extractive-summarizer"/> }
