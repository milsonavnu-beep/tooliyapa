import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PDF_TOOLS } from '../lib/tools.js'
import { AVAILABLE_CALCULATORS } from '../lib/calculators.js'

const root = process.cwd()
const home = fs.readFileSync(path.join(root, 'components/tooliyapa/HomePage.js'), 'utf8')

describe('homepage category and tool discovery', () => {
  it('keeps every real PDF tool registry-backed and reachable', () => {
    expect(PDF_TOOLS).toHaveLength(10)
    expect(home).toContain("import { PDF_TOOLS } from '@/lib/tools'")
    expect(home).toContain('const TOOLS = PDF_TOOLS.map')
    expect(home).toContain('href={tool.href}')

    for (const { href } of PDF_TOOLS) {
      expect(home).toContain(`'${href}': {`)
    }
  })

  it('makes PDF Tools and Calculators active while deriving their counts from registries', () => {
    expect(home).toContain('Browse by category')
    expect(home).toContain('href="#pdf-tools"')
    expect(home).toContain('{PDF_TOOLS.length} tools available')
    expect(home).toContain('Available now')

    expect(home).toContain('href="/calculators"')
    expect(home).toContain('{AVAILABLE_CALCULATORS.length} tool available')
    for (const label of ['Documents', 'Text', 'Converters']) {
      expect(home).toContain(`title: '${label}'`)
    }
    expect(home).toContain('aria-disabled="true"')
    expect(home).toContain('Coming soon')
    expect(home).not.toMatch(/href=["'{`]\/(documents?|text|converters?)/i)
  })

  it('preserves the hero destination and approved branding assets', () => {
    expect(home).toContain('id="tools"')
    expect(home).toContain('href="#tools"')
    expect(home).toContain('src="/branding/tooliyapa_hero_tools.png"')
    expect(home).not.toMatch(/import DiceLogo|<DiceLogo/)
  })

  it('keeps the substantive lower homepage content intact', () => {
    for (const heading of [
      'What you can do with Tooliyapa',
      'How browser-based processing works',
      'Choose the right PDF tool',
      'Practical tools, clear expectations',
    ]) {
      expect(home).toContain(heading)
    }
  })

  it('uses editorial featuring without fake popularity or analytics claims', () => {
    expect(home).toContain('Featured PDF tools')
    expect(home).toContain('More PDF tools')
    expect(home).not.toMatch(/popular tools|most popular|users|downloads today|(?:customer|user) reviews?|\d[\d,]*\+? (?:ratings?|reviews?)|25\+|1000\+/i)
    expect(home).toContain('review the <Link className={linkClass} href="/privacy">Privacy Policy</Link>')
  })
})
