import { TextToolPage } from '@/components/tooliyapa/TextUI'
import { textMetadata } from '@/lib/text-tools'
export const metadata = textMetadata('find-replace')
export default function Page(){ return <TextToolPage toolId="find-replace"/> }
