import HomePage from '@/components/tooliyapa/HomePage'
import { buildHomeMetadata } from '@/lib/tools/metadata'

export const metadata = buildHomeMetadata()

export default function Page() {
  return <HomePage />
}
