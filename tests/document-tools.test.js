import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { AVAILABLE_DOCUMENT_TOOLS, DOCUMENT_PAGES } from '../lib/document-tools.js'
import { PUBLIC_ROUTES } from '../lib/site.js'
import { createZip, markdownToHtml, normalizeArchivePath, openZip } from '../lib/document-engine.js'

describe('document tools', () => {
  it('publishes the complete approved document catalog as real routes', () => {
    expect(AVAILABLE_DOCUMENT_TOOLS).toHaveLength(14)
    expect(Object.keys(DOCUMENT_PAGES)).toHaveLength(14)
    for (const tool of AVAILABLE_DOCUMENT_TOOLS) {
      expect(PUBLIC_ROUTES).toContain(tool.href)
      expect(fs.existsSync(`app${tool.href}/page.js`)).toBe(true)
      expect(tool.description.length).toBeGreaterThan(60)
      expect(tool.about.length).toBeGreaterThan(80)
      expect(tool.limitations.length).toBeGreaterThan(60)
    }
  })

  it('keeps the approved scope focused and does not add rejected AGPL or unsupported office-editor routes', () => {
    const routes = AVAILABLE_DOCUMENT_TOOLS.map(({ href }) => href).join('\n')
    expect(routes).not.toMatch(/onlyoffice|pptx|powerpoint|hwp|hwpx/i)
    expect(routes).not.toMatch(/remote|cloud|server-convert/i)
  })

  it('blocks unsafe archive paths', () => {
    expect(normalizeArchivePath('word/document.xml')).toBe('word/document.xml')
    for (const path of ['../secret.txt', '/absolute.txt', 'C:/unsafe.txt', 'word/../secret.xml']) expect(() => normalizeArchivePath(path)).toThrow(/unsafe path/i)
  })

  it('creates and reads a bounded ZIP package without a server dependency', async () => {
    const zip = await createZip([{ name: 'word/document.xml', data: '<document>Hello</document>' }, { name: 'docProps/core.xml', data: '<title>Sample</title>' }])
    const archive = await openZip(zip)
    expect(archive.names).toContain('word/document.xml')
    expect(await archive.readText('word/document.xml')).toBe('<document>Hello</document>')
    expect(await archive.readText('docProps/core.xml')).toBe('<title>Sample</title>')
  })

  it('escapes raw HTML in Markdown output instead of executing it', () => {
    const html = markdownToHtml('# Hello\n\n<script>alert(1)</script>', { standalone: true, title: 'Safe' })
    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>alert(1)</script>')
  })
})
