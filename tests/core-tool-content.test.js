import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PUBLIC_ROUTES } from '../lib/site.js'

const root = process.cwd()
const routes = ['/merge-pdf', '/split-pdf', '/rotate-pdf', '/organize-pdf']

function sourceFor(route) {
  return fs.readFileSync(path.join(root, `app${route}/page.js`), 'utf8')
}

describe('core PDF tool page content', () => {
  it('uses canonical metadata with unbranded, unique page titles', () => {
    const titles = routes.map((route) => {
      const source = sourceFor(route)
      expect(source).toContain('createPageMetadata')
      expect(source).toContain(`pathname: '${route}'`)
      expect(source).not.toMatch(/noindex|index:\s*false|follow:\s*false/i)
      const title = source.match(/title:\s*'([^']+)'/)?.[1]
      expect(title).toBeTruthy()
      expect(title).not.toMatch(/tooliyapa/i)
      return title
    })

    expect(new Set(titles).size).toBe(routes.length)
  })

  it('includes server-renderable how-to, FAQ, limitations, privacy, and final guidance', () => {
    for (const route of routes) {
      const source = sourceFor(route)
      expect(source).toContain('<HowToUse')
      expect(source).toContain('<ToolFAQ items={faqs}')
      expect(source).toContain('<ToolLimitations')
      expect(source).toContain('<PrivacyNote />')
      expect((source.match(/<ToolInfoSection/g) || []).length).toBeGreaterThanOrEqual(3)
      expect((source.match(/question:/g) || []).length).toBeGreaterThanOrEqual(5)
    }
  })

  it('uses the shared structured-data component with each canonical pathname', () => {
    for (const route of routes) {
      const source = sourceFor(route)
      expect(source).toContain(`<ToolStructuredData pathname="${route}"`)
      expect(source).not.toMatch(/aggregateRating|reviewCount|ratingValue|offers|price|downloadCount/)
    }
  })

  it('links only to valid existing relative routes', () => {
    for (const route of routes) {
      const source = sourceFor(route)
      const links = [...source.matchAll(/href:\s*'([^']+)'/g)].map((match) => match[1])
      expect(links).toHaveLength(4)
      for (const href of links) {
        expect(href).toMatch(/^\/[a-z0-9-]+$/)
        expect(PUBLIC_ROUTES).toContain(href)
      }
    }
  })

  it('contains no alternate, development, or staging hosts', () => {
    const source = routes.map(sourceFor).join('\n')
    expect(source).not.toMatch(/www\.tooliyapa\.com|http:\/\/tooliyapa\.com|localhost|emergent|staging/i)
  })
})
