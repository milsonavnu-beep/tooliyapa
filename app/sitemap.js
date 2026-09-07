import { PUBLIC_ROUTES, canonicalUrl } from '@/lib/site'

export default function sitemap() {
  return PUBLIC_ROUTES.map((route) => ({
    url: canonicalUrl(route),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1.0 : 0.8,
  }))
}
