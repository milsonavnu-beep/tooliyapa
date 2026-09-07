import WatermarkTool from '@/components/tooliyapa/WatermarkTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'Watermark PDF — Add Text Watermark', description: 'Add a custom text watermark to every page of your PDF. Adjust opacity, size and rotation.', pathname: '/watermark' })
export default function Page() { return <WatermarkTool /> }
