import { TextToolPage } from '@/components/tooliyapa/TextUI'
import { textMetadata } from '@/lib/text-tools'
export const metadata = textMetadata('text-diff')
export default function Page(){ return <TextToolPage toolId="text-diff"/> }
