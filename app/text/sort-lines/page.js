import { TextToolPage } from '@/components/tooliyapa/TextUI'
import { textMetadata } from '@/lib/text-tools'
export const metadata = textMetadata('sort-lines')
export default function Page(){ return <TextToolPage toolId="sort-lines"/> }
