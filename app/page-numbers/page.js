import PageNumbersTool from '@/components/tooliyapa/PageNumbersTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'Add Page Numbers to PDF', description: 'Insert page numbers into your PDF in any position with multiple format options.', pathname: '/page-numbers' })
export default function Page() { return <PageNumbersTool /> }
