import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { AVAILABLE_CALCULATORS, CALCULATOR_TOOLS } from '../lib/calculators.js'
import { PUBLIC_ROUTES } from '../lib/site.js'
const read = (path) => fs.readFileSync(path, 'utf8')

describe('calculator discovery and content', () => {
  it('publishes every available calculator through a public route', () => {
    expect(CALCULATOR_TOOLS.length).toBeGreaterThanOrEqual(3)
    expect(AVAILABLE_CALCULATORS.length).toBe(CALCULATOR_TOOLS.filter(({ available }) => available).length)
    for (const calculator of AVAILABLE_CALCULATORS) {
      expect(calculator.href.startsWith('/calculators/')).toBe(true)
      expect(PUBLIC_ROUTES).toContain(calculator.href)
      expect(fs.existsSync(`app${calculator.href}/page.js`)).toBe(true)
    }
    expect(AVAILABLE_CALCULATORS.map(({ id }) => id)).toEqual(expect.arrayContaining(['percentage', 'loan', 'interest']))
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

  it('provides substantive loan guidance and clear assumptions', () => {
    const page = read('app/calculators/loan/page.js')
    for (const heading of ['How the loan payment is calculated', 'What EMI means', 'What extra monthly payments do', 'Important assumptions', 'Why lender figures may differ', 'Frequently asked questions', 'Use as an estimate']) expect(page).toContain(heading)
    expect(page).toContain('It is not financial advice')
    expect(page).not.toMatch(/most popular|used by thousands|best calculator|CalcSuite/i)
  })
})
