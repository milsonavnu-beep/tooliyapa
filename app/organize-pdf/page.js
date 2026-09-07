import OrganizePdfTool from '@/components/tooliyapa/OrganizePdfTool'
import { createPageMetadata } from '@/lib/site'
export const metadata = createPageMetadata({ title: 'Organize PDF — Reorder & Delete Pages', description: 'Drag-and-drop to reorder PDF pages or remove unwanted pages. Free in-browser PDF editor.', pathname: '/organize-pdf' })
export default function Page() { return <OrganizePdfTool /> }
