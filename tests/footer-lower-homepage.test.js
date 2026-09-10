import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PDF_TOOLS } from '../lib/tools.js'

const root = process.cwd()
const footer = fs.readFileSync(path.join(root, 'components/tooliyapa/Footer.js'), 'utf8')
const home = fs.readFileSync(path.join(root, 'components/tooliyapa/HomePage.js'), 'utf8')
const header = fs.readFileSync(path.join(root, 'components/tooliyapa/Header.js'), 'utf8')
const toolRoutes = new Set(PDF_TOOLS.map(({ href }) => href))

describe('footer and lower homepage', () => {
  it('uses the approved image logo and removes the legacy footer brand treatment', () => {
    expect(footer).toContain("import Image from 'next/image'")
    expect(footer).toContain('src="/branding/tooliyapa_logo_primary.png"')
    expect(footer).not.toMatch(/DiceLogo|Popular PDF tools/)
  })

  it('keeps the PDF footer links real while allowing active calculator and converter categories', () => {
    for (const route of ['/merge-pdf','/compress-pdf','/organize-pdf','/jpg-to-pdf','/pdf-to-jpg','/split-pdf']) {
      expect(footer).toContain(`'${route}'`)
      expect(toolRoutes.has(route)).toBe(true)
    }
    expect(footer).toContain("['Calculators','/calculators']")
    expect(footer).toContain("['Converters','/converters']")
    expect(footer).not.toMatch(/href=["']\/(?:documents?|text)/i)
  })

  it('retains navigation, informational, legal, and attribution destinations', () => {
    for (const route of ['/', '/#tools', '/#pdf-tools', '/about', '/contact', '/privacy', '/terms', '/disclaimer', '/third-party-notices']) expect(footer).toContain(`'${route}'`)
  })

  it('keeps all lower-page headings and substantive workflow comparisons visible', () => {
    for (const heading of ['What you can do with Tooliyapa', 'How browser-based processing works', 'Choose the right PDF tool', 'Practical tools, clear expectations']) expect(home).toContain(heading)
    for (const workflow of ['Combine and organize', 'Convert documents and images', 'Prepare a finished PDF', 'Work with owner permissions']) expect(home).toContain(workflow)
    for (const comparison of ['Merge or organize?', 'Split or organize?', 'Rotate or organize?', 'What does compression change?', 'What does a watermark do?', 'Which restrictions are supported?']) expect(home).toContain(comparison)
  })

  it('scopes privacy language to implemented workflows and retains qualifications', () => {
    expect(home).toMatch(/Selected PDF files[\s\S]*not uploaded to Tooliyapa servers[\s\S]*PDF-processing workflow/)
    expect(home).toMatch(/Calculator and converter inputs are processed in the browser/)
    expect(home).toMatch(/Speed and capacity still depend on your device and browser/)
    expect(home).toMatch(/third-party scripts are separate from tool calculations/i)
    expect(home).toContain('href="/privacy"')
    expect(footer).toMatch(/Selected PDF files[\s\S]*PDF-processing workflow/)
  })

  it('keeps approved upper-page assets and avoids fabricated social proof', () => {
    expect(header).toContain('/branding/tooliyapa_logo_primary.png')
    expect(home).toContain('/branding/tooliyapa_hero_tools.png')
    expect(`${footer}\n${home}`).not.toMatch(/thousands of users|trusted by|#1|most popular|millions of files|ratings|reviews|usage count|download count/i)
  })
})
