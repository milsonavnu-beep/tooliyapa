import { SITE_URL } from '@/lib/site'

export default function sitemap() {
  const routes = [
    '',
    '/merge-pdf',
    '/split-pdf',
    '/compress-pdf',
    '/rotate-pdf',
    '/organize-pdf',
    '/jpg-to-pdf',
    '/pdf-to-jpg',
    '/page-numbers',
    '/watermark',
    '/unlock-pdf',
  ]
  return routes.map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: r === '' ? 1.0 : 0.8,
  }))
}
