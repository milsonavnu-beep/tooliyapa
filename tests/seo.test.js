import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import sitemap from '../app/sitemap.js'
import { PUBLIC_ROUTES, SITE_URL, canonicalUrl, createPageMetadata } from '../lib/site.js'
import { MORE_CALCULATOR_PAGES } from '../lib/more-calculator-pages.js'
import { CONVERTER_PAGES } from '../lib/converters.js'
import { DOCUMENT_PAGES } from '../lib/document-tools.js'

const root = process.cwd()

function sharedMetadataPathname(source) {
  const calculatorId = source.match(/calculatorMetadata\('([^']+)'\)/)?.[1]
  if (calculatorId) return MORE_CALCULATOR_PAGES[calculatorId]?.pathname
  const converterId = source.match(/converterMetadata\('([^']+)'\)/)?.[1]
  if (converterId) return CONVERTER_PAGES[converterId]?.pathname
  const documentId = source.match(/documentMetadata\('([^']+)'\)/)?.[1]
  if (documentId) return DOCUMENT_PAGES[documentId]?.href
  return null
}

describe('production SEO configuration', () => {
  it('uses only the canonical HTTPS apex origin', () => {
    expect(SITE_URL).toBe('https://tooliyapa.com')
    expect(canonicalUrl('/')).toBe('https://tooliyapa.com/')
    expect(canonicalUrl('/compress-pdf')).toBe('https://tooliyapa.com/compress-pdf')
  })

  it('publishes every public route once in the sitemap without fabricated dates', () => {
    const entries = sitemap()
    const urls = entries.map(({ url }) => url)
    expect(urls).toEqual(PUBLIC_ROUTES.map(canonicalUrl))
    expect(new Set(urls).size).toBe(PUBLIC_ROUTES.length)
    expect(entries.every((entry) => !('lastModified' in entry))).toBe(true)
    expect(urls.every((url) => url.startsWith(`${SITE_URL}/`))).toBe(true)
    expect(urls.join('\n')).not.toMatch(/www\.|http:\/\/|localhost|emergent/i)
    for (const route of ['/documents', '/about', '/contact', '/privacy', '/terms', '/disclaimer', '/third-party-notices']) expect(urls).toContain(canonicalUrl(route))
  })

  it('declares the canonical sitemap and does not block public crawling', () => {
    const robots = fs.readFileSync(path.join(root, 'public/robots.txt'), 'utf8')
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Allow: /')
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
    expect(robots).not.toMatch(/Disallow:\s*\//)
  })

  it('gives generated page metadata matching canonical and Open Graph URLs', () => {
    for (const pathname of PUBLIC_ROUTES) {
      const metadata = createPageMetadata({ title: `Unique title ${pathname}`, description: `Unique description ${pathname}`, pathname })
      expect(metadata.alternates.canonical).toBe(canonicalUrl(pathname))
      expect(metadata.openGraph.url).toBe(canonicalUrl(pathname))
      expect(metadata.title).toBeTruthy()
      expect(metadata.description).toBeTruthy()
    }
  })

  it('configures every page with a matching direct or shared metadata pathname and no noindex', () => {
    for (const pathname of PUBLIC_ROUTES) {
      const pagePath = pathname === '/' ? 'app/page.js' : `app${pathname}/page.js`
      const source = fs.readFileSync(path.join(root, pagePath), 'utf8')
      const hasDirectMetadata = source.includes('createPageMetadata') && source.includes(`pathname: '${pathname}'`)
      const sharedPathname = sharedMetadataPathname(source)
      expect(hasDirectMetadata || sharedPathname === pathname).toBe(true)
      expect(source).not.toMatch(/noindex|index:\s*false|follow:\s*false/i)
    }
    const layout = fs.readFileSync(path.join(root, 'app/layout.js'), 'utf8')
    expect(layout).toMatch(/robots:\s*\{\s*index:\s*true,\s*follow:\s*true\s*\}/)
    expect(layout).not.toMatch(/alternates:\s*\{\s*canonical/)
  })

  it('contains no production SEO references to alternate or development hosts', () => {
    const seoFiles = ['app/layout.js','app/sitemap.js','lib/site.js','public/robots.txt','public/manifest.json','next.config.js','vercel.json']
    const productionConfig = seoFiles.map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n')
    expect(productionConfig).not.toMatch(/https?:\/\/www\.tooliyapa\.com|http:\/\/tooliyapa\.com/i)
    expect(productionConfig).not.toMatch(/localhost|emergentagent/i)
  })
})
