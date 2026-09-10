import { TextToolPage } from '@/components/tooliyapa/TextUI'
import { textMetadata } from '@/lib/text-tools'
export const metadata = textMetadata('word-counter')
export default function Page(){ return <TextToolPage toolId="word-counter"/> }
