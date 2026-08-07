import { describe, it, expect } from 'vitest'
import {
  TOOLS,
  getActiveTools,
  getToolById,
  getRelatedTools,
  getActiveToolCount,
  absoluteUrl,
} from '../lib/tools/registry.js'
import {
  CATEGORIES,
  getActiveCategories,
  getCategoryById,
} from '../lib/tools/categories.js'
import { searchTools } from '../lib/tools/search.js'
import { buildToolMetadata, buildCategoryMetadata, listSitemapPaths } from '../lib/tools/metadata.js'
import { toolPageJsonLd } from '../lib/tools/jsonld.js'
import { SITE_URL } from '../lib/site.js'

const EXPECTED_HREFS = [
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

describe('tool registry integrity', () => {
  it('has exactly 10 active tools', () => {
    expect(getActiveToolCount()).toBe(10)
    expect(getActiveTools()).toHaveLength(10)
  })

  it('has unique ids, slugs, and hrefs', () => {
    const ids = TOOLS.map((t) => t.id)
    const slugs = TOOLS.map((t) => t.slug)
    const hrefs = TOOLS.map((t) => t.href)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('includes all current production tool routes', () => {
    const hrefs = new Set(getActiveTools().map((t) => t.href))
    for (const href of EXPECTED_HREFS) {
      expect(hrefs.has(href)).toBe(true)
    }
  })

  it('references valid categories and SEO fields', () => {
    for (const tool of getActiveTools()) {
      expect(getCategoryById(tool.category)).toBeTruthy()
      expect(tool.href).toMatch(/^\//)
      expect(tool.seo?.title).toBeTruthy()
      expect(tool.seo?.description).toBeTruthy()
      expect(tool.processing).toBe('browser-local')
      expect(tool.status).toBe('active')
    }
  })

  it('validates relatedToolIds', () => {
    for (const tool of TOOLS) {
      const seen = new Set()
      for (const id of tool.relatedToolIds || []) {
        expect(id).not.toBe(tool.id)
        expect(seen.has(id)).toBe(false)
        seen.add(id)
        expect(getToolById(id)).toBeTruthy()
      }
      const related = getRelatedTools(tool.id)
      expect(related.every((t) => t.id !== tool.id)).toBe(true)
    }
  })
})

describe('categories', () => {
  it('exposes only PDF Tools as an active public category', () => {
    const active = getActiveCategories()
    expect(active).toHaveLength(1)
    expect(active[0].id).toBe('pdf')
    expect(active[0].href).toBe('/pdf')
  })

  it('keeps planned categories non-public', () => {
    const planned = CATEGORIES.filter((c) => c.status === 'planned')
    expect(planned.length).toBeGreaterThan(0)
    expect(planned.every((c) => c.status !== 'active')).toBe(true)
  })
})

describe('tool search', () => {
  const cases = [
    ['merge', 'merge-pdf'],
    ['combine pdf', 'merge-pdf'],
    ['split', 'split-pdf'],
    ['rotate', 'rotate-pdf'],
    ['jpg', 'jpg-to-pdf'],
    ['image to pdf', 'jpg-to-pdf'],
    ['watermark', 'watermark'],
    ['page numbers', 'page-numbers'],
    ['restrictions', 'unlock-pdf'],
    ['compress', 'compress-pdf'],
    ['remove pdf pages', 'organize-pdf'],
  ]

  for (const [query, expectedId] of cases) {
    it(`finds ${expectedId} for "${query}"`, () => {
      const results = searchTools(query)
      expect(results.map((t) => t.id)).toContain(expectedId)
      expect(results[0].id).toBe(expectedId)
    })
  }
})

describe('metadata helpers', () => {
  it('builds correct Merge PDF canonical and og:url', () => {
    const meta = buildToolMetadata('merge-pdf')
    expect(meta.alternates.canonical).toBe('/merge-pdf')
    expect(meta.openGraph.url).toBe('https://tooliyapa.com/merge-pdf')
    expect(JSON.stringify(meta)).not.toMatch(/emergentagent/i)
  })

  it('builds Compress and JPG metadata URLs', () => {
    expect(buildToolMetadata('compress-pdf').alternates.canonical).toBe('/compress-pdf')
    expect(buildToolMetadata('jpg-to-pdf').openGraph.url).toBe('https://tooliyapa.com/jpg-to-pdf')
  })

  it('builds PDF category metadata', () => {
    const meta = buildCategoryMetadata('pdf')
    expect(meta.alternates.canonical).toBe('/pdf')
    expect(meta.openGraph.url).toBe('https://tooliyapa.com/pdf')
  })

  it('absoluteUrl uses apex host', () => {
    expect(absoluteUrl('/merge-pdf')).toBe(`${SITE_URL}/merge-pdf`)
    expect(absoluteUrl('/merge-pdf')).not.toContain('www.')
  })
})

describe('sitemap consistency', () => {
  it('includes home, /pdf, and all 10 tools exactly once', () => {
    const paths = listSitemapPaths()
    expect(paths).toContain('/')
    expect(paths).toContain('/pdf')
    for (const href of EXPECTED_HREFS) {
      expect(paths).toContain(href)
    }
    expect(paths.filter((p) => EXPECTED_HREFS.includes(p))).toHaveLength(10)
    expect(new Set(paths).size).toBe(paths.length)
    expect(paths).not.toContain('/image')
    expect(paths).not.toContain('/text')
  })
})

describe('structured data', () => {
  it('emits valid JSON-serializable tool schemas without fake ratings', () => {
    const schemas = toolPageJsonLd('merge-pdf')
    expect(schemas.length).toBeGreaterThanOrEqual(2)
    const json = JSON.stringify(schemas)
    expect(() => JSON.parse(json)).not.toThrow()
    expect(json).not.toMatch(/aggregateRating|reviewCount|ratingValue/i)
    expect(json).toContain('BreadcrumbList')
    expect(json).toContain('FAQPage')
    expect(json).toContain('WebApplication')
  })
})
