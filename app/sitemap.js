import { listSitemapPaths } from '@/lib/tools/metadata'
import { SITE_URL } from '@/lib/site'

export default function sitemap() {
  return listSitemapPaths().map((path) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1.0 : path === '/pdf' ? 0.9 : 0.8,
  }))
}
