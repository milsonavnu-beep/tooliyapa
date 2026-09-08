import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { AVAILABLE_CALCULATORS, CALCULATOR_TOOLS } from '../lib/calculators.js'
import { PUBLIC_ROUTES } from '../lib/site.js'
const read = (path) => fs.readFileSync(path, 'utf8')

describe('calculator discovery and content', () => {
  it('publishes only the percentage calculator', () => {
    expect(PUBLIC_ROUTES).toEqual(expect.arrayContaining(['/calculators', '/calculators/percentage']))
    expect(CALCULATOR_TOOLS).toHaveLength(1)
    expect(AVAILABLE_CALCULATORS[0]).toMatchObject({ id: 'percentage', title: 'Percentage Calculator', href: '/calculators/percentage', available: true })
  })
  it('integrates calculator discovery without removing PDF search', () => {
    const search = read('components/tooliyapa/ToolSearch.js'); const home = read('components/tooliyapa/HomePage.js'); const header = read('components/tooliyapa/Header.js'); const footer = read('components/tooliyapa/Footer.js')
    expect(search).toContain('...PDF_TOOLS, ...AVAILABLE_CALCULATORS')
    expect(home).toContain('href="/calculators"'); expect(home).toContain('{AVAILABLE_CALCULATORS.length} tool available')
    expect(header).toContain('href="/calculators"'); expect(footer).toContain("['Calculators', '/calculators']")
    for (const label of ['Documents', 'Text', 'Converters']) expect(header).toContain(`'${label}'`)
  })
  it('provides substantive, original percentage guidance without social proof', () => {
    const page = read('app/calculators/percentage/page.js')
    for (const heading of ['What is a percentage?', 'Percentage formulas', 'How percentage change works', 'Practical examples', 'Common mistakes', 'Frequently asked questions']) expect(page).toContain(heading)
    expect(page).not.toMatch(/most popular|used by thousands|best calculator|CalcSuite/i)
  })
})
