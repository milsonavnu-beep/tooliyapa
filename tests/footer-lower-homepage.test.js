import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PDF_TOOLS } from '../lib/tools.js'

const root = process.cwd()
const footer = fs.readFileSync(path.join(root, 'components/tooliyapa/Footer.js'), 'utf8')
const home = fs.readFileSync(path.join(root, 'components/tooliyapa/HomePage.js'), 'utf8')
const header = fs.readFileSync(path.join(root, 'components/tooliyapa/Header.js'), 'utf8')
const toolRoutes = new Set(PDF_TOOLS.map(({ href }) => href))

describe('Task 8C footer and lower homepage', () => {
  it('uses the approved image logo and removes the legacy footer brand treatment', () => {
    expect(footer).toContain("import Image from 'next/image'")
    expect(footer).toContain('src="/branding/tooliyapa_logo_primary.png"')
    expect(footer).not.toMatch(/DiceLogo|Popular PDF tools/)
  })

  it('links only to real PDF tools and does not add future-category routes', () => {
    const pdfGroup = footer.match(/title: 'PDF tools',[\s\S]*?\n  },/)?.[0] ?? ''
    const routes = [...pdfGroup.matchAll(/\['[^']+', '([^']+)'\]/g)].map((match) => match[1])

    expect(routes).toHaveLength(6)
    for (const route of routes) expect(toolRoutes.has(route)).toBe(true)
    expect(footer).not.toMatch(/href=["']\/(?:calculators?|documents?|text|converters?)/i)
  })

  it('retains navigation, informational, and legal destinations', () => {
    for (const route of ['/', '/#tools', '/#pdf-tools', '/about', '/contact', '/privacy', '/terms', '/disclaimer']) {
      expect(footer).toContain(`'${route}'`)
    }
  })

  it('keeps all lower-page headings and substantive workflow comparisons visible', () => {
    for (const heading of ['What you can do with Tooliyapa', 'How browser-based processing works', 'Choose the right PDF tool', 'Practical tools, clear expectations']) {
      expect(home).toContain(heading)
    }
    for (const workflow of ['Combine and organize', 'Convert documents and images', 'Prepare a finished PDF', 'Work with owner permissions']) {
      expect(home).toContain(workflow)
    }
    for (const comparison of ['Merge or organize?', 'Split or organize?', 'Rotate or organize?', 'What does compression change?', 'What does a watermark do?', 'Which restrictions are supported?']) {
      expect(home).toContain(comparison)
    }
  })

  it('scopes privacy language to implemented PDF workflows and retains qualifications', () => {
    expect(home).toMatch(/Selected PDF files[\s\S]*not uploaded to Tooliyapa servers[\s\S]*PDF-processing workflow/)
    expect(home).toMatch(/device, available memory, and browser/)
    expect(home).toMatch(/large scan or a PDF with complex pages[\s\S]*fail/)
    expect(home).toMatch(/third-party scripts are separate from PDF-file processing/)
    expect(home).toContain('href="/privacy"')
    expect(footer).toMatch(/Selected PDF files[\s\S]*PDF-processing workflow/)
  })

  it('keeps approved upper-page assets and avoids fabricated social proof', () => {
    expect(header).toContain('/branding/tooliyapa_logo_primary.png')
    expect(home).toContain('/branding/tooliyapa_hero_tools.png')
    expect(`${footer}\n${home}`).not.toMatch(/thousands of users|trusted by|#1|most popular|millions of files|ratings|reviews|usage count|download count/i)
  })
})
