import { TextToolPage } from '@/components/tooliyapa/TextUI'
import { textMetadata } from '@/lib/text-tools'
export const metadata = textMetadata('case-converter')
export default function Page(){ return <TextToolPage toolId="case-converter"/> }
