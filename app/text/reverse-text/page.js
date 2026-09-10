import { TextToolPage } from '@/components/tooliyapa/TextUI'
import { textMetadata } from '@/lib/text-tools'
export const metadata = textMetadata('reverse-text')
export default function Page(){ return <TextToolPage toolId="reverse-text"/> }
