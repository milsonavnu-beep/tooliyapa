import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PUBLIC_ROUTES, canonicalUrl, createPageMetadata } from '../lib/site.js'
import { PDF_TOOLS } from '../lib/tools.js'

const root = process.cwd()
const pageSource = fs.readFileSync(path.join(root, 'app/page.js'), 'utf8')
const homeSource = fs.readFileSync(path.join(root, 'components/tooliyapa/HomePage.js'), 'utf8')
const layoutSource = fs.readFileSync(path.join(root, 'app/layout.js'), 'utf8')
const toolRoutes = PDF_TOOLS.map(({ href }) => href)

describe('homepage content and metadata', () => {
  it('uses canonical page metadata with one brand mention in the composed title', () => {
    expect(pageSource).toContain('createPageMetadata')
    expect(pageSource).toContain("pathname: '/'")
    expect(pageSource).not.toMatch(/noindex|index:\s*false|follow:\s*false/i)

    const title = pageSource.match(/title:\s*'([^']+)'/)?.[1]
    const template = layoutSource.match(/template:\s*'([^']+)'/)?.[1]
    expect(title).toBe('Free Online PDF Tools')
    expect(title).not.toMatch(/tooliyapa/i)
    expect(template).toBe('%s | Tooliyapa')

    const renderedTitle = template.replace('%s', title)
    expect(renderedTitle).toBe('Free Online PDF Tools | Tooliyapa')
    expect(renderedTitle.match(/Tooliyapa/gi)).toHaveLength(1)

    const metadata = createPageMetadata({ title, description: 'Homepage', pathname: '/' })
    expect(metadata.title.absolute).toBe(renderedTitle)
    expect(metadata.alternates.canonical).toBe(canonicalUrl('/'))
    expect(metadata.openGraph.url).toBe(metadata.alternates.canonical)
  })

  it('defines one H1 and server-renderable informational sections', () => {
    expect(homeSource.match(/<h1(?:\s|>)/g)).toHaveLength(1)
    expect(homeSource).toContain('What you can do with Tooliyapa')
    expect(homeSource).toContain('How browser-based processing works')
    expect(homeSource).toContain('Choose the right PDF tool')
    expect(homeSource).toContain('Practical tools, clear expectations')
  })

  it('keeps all ten public PDF tools in the registry-backed presentation', () => {
    expect(PDF_TOOLS).toHaveLength(10)
    expect(homeSource).toContain('const TOOLS = PDF_TOOLS.map')
    expect(toolRoutes).toHaveLength(10)

    for (const route of toolRoutes) {
      expect(PUBLIC_ROUTES).toContain(route)
      expect(homeSource).toContain(`'${route}': {`)
    }
    expect(homeSource).toContain('href={tool.href}')
  })

  it('describes limited tool behavior accurately', () => {
    const presentationBlock = homeSource.match(/const TOOL_PRESENTATION = \{([^]*?)\n\}/)?.[1] ?? ''
    const splitCard = presentationBlock.match(/'\/split-pdf':[^\n]+/)?.[0] ?? ''
    const watermarkCard = presentationBlock.match(/'\/watermark':[^\n]+/)?.[0] ?? ''
    const restrictionsCard = presentationBlock.match(/'\/unlock-pdf':[^\n]+/)?.[0] ?? ''

    expect(splitCard).toMatch(/thumbnail-selected pages|one PDF per page/i)
    expect(splitCard).not.toMatch(/typed|range/i)
    expect(watermarkCard).toMatch(/text watermark/i)
    expect(homeSource).toMatch(/Text Watermark|visible text/i)
    expect(restrictionsCard).toMatch(/attempt|owner permissions|already readable/i)
    expect(homeSource).toMatch(/does not guess passwords, crack encryption, or decrypt/i)
  })

  it('links to trust pages and avoids unsupported claims and forbidden hosts', () => {
    for (const route of ['/about', '/privacy', '/contact', '/terms', '/disclaimer']) {
      expect(PUBLIC_ROUTES).toContain(route)
      expect(homeSource).toContain(`href="${route}"`)
    }

    expect(homeSource).not.toMatch(/Every PDF tool you need|complete suite|no limits|100% private|unlock any PDF/i)
    expect(`${pageSource}\n${homeSource}`).not.toMatch(/www\.tooliyapa\.com|http:\/\/tooliyapa\.com|localhost|staging|Emergent/i)
  })
})
