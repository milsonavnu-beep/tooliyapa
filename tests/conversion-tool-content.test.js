import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PUBLIC_ROUTES } from '../lib/site.js'

const root = process.cwd()
const routes = ['/jpg-to-pdf', '/pdf-to-jpg', '/watermark', '/unlock-pdf']

function sourceFor(route) {
  return fs.readFileSync(path.join(root, `app${route}/page.js`), 'utf8')
}

describe('conversion, watermark, and restriction tool content', () => {
  it('uses canonical metadata with clean, unbranded page titles', () => {
    const titles = routes.map((route) => {
      const source = sourceFor(route)
      expect(source).toContain('createPageMetadata')
      expect(source).toContain(`pathname: '${route}'`)
      expect(source).not.toMatch(/noindex|index:\s*false|follow:\s*false/i)
      expect(source).not.toContain('Tooliyapa | Tooliyapa')
      const title = source.match(/title:\s*'([^']+)'/)?.[1]
      expect(title).toBeTruthy()
      expect(title).not.toMatch(/tooliyapa/i)
      return title
    })

    expect(new Set(titles).size).toBe(routes.length)
  })

  it('provides server-rendered guidance through every shared content section', () => {
    for (const route of routes) {
      const source = sourceFor(route)
      expect(source).toContain('<HowToUse')
      expect(source).toContain('<ToolFAQ items={faqs}')
      expect(source).toContain('<ToolLimitations')
      expect(source).toContain('<PrivacyNote')
      expect(source).toContain('<RelatedTools tools={relatedTools}')
      expect((source.match(/<ToolInfoSection/g) || []).length).toBeGreaterThanOrEqual(3)
      expect((source.match(/question:/g) || []).length).toBeGreaterThanOrEqual(5)
    }
  })

  it('passes the same visible FAQ data to schema on the correct pathname', () => {
    for (const route of routes) {
      const source = sourceFor(route)
      expect(source).toContain(`<ToolStructuredData pathname="${route}"`)
      expect(source).toContain('faqs={faqs}')
      expect(source).toContain('<ToolFAQ items={faqs}')
      expect(source).not.toMatch(/aggregateRating|reviewCount|ratingValue|offers|price|pricing|downloadCount/)
    }
  })

  it('uses four valid, existing, relative related-tool routes per page', () => {
    for (const route of routes) {
      const links = [...sourceFor(route).matchAll(/href:\s*'([^']+)'/g)].map((match) => match[1])
      expect(links).toHaveLength(4)
      for (const href of links) {
        expect(href).toMatch(/^\/[a-z0-9-]+$/)
        expect(PUBLIC_ROUTES).toContain(href)
      }
    }
  })

  it('contains no forbidden or alternate hosts', () => {
    const source = routes.map(sourceFor).join('\n')
    expect(source).not.toMatch(/www\.tooliyapa\.com|http:\/\/tooliyapa\.com|localhost|emergent|staging/i)
  })

  it('describes watermarking as text-only rather than image or logo support', () => {
    const source = sourceFor('/watermark')
    expect(source).toMatch(/text-only/i)
    expect(source).toMatch(/does not (?:upload or place|add) image and logo watermarks/i)
    expect(source).not.toMatch(/add text or image watermark|upload (?:an? )?logo watermark/i)
  })

  it('clearly separates owner restrictions from unsupported open-password encryption', () => {
    const source = sourceFor('/unlock-pdf')
    expect(source).toMatch(/owner or permission settings[^]*open password is different/i)
    expect(source).toMatch(/does not guess passwords, brute-force them, crack encryption, or decrypt/i)
    expect(source).toMatch(/PDF must already be readable or openable/i)
    expect(source).not.toMatch(/unlock any PDF|remove any PDF password|decrypt all PDFs|bypass any security|guaranteed unlock/i)
  })
})
