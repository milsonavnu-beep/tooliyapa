export default function sitemap() {
  const base = 'https://swift-pdf-tools.preview.emergentagent.com'
  const routes = ['', '/merge-pdf', '/split-pdf', '/compress-pdf', '/rotate-pdf', '/organize-pdf', '/jpg-to-pdf', '/pdf-to-jpg', '/page-numbers', '/watermark', '/unlock-pdf']
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date(), changeFrequency: 'monthly', priority: r === '' ? 1.0 : 0.8 }))
}
