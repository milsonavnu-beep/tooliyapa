import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { AVAILABLE_CALCULATORS } from '../lib/calculators.js'
import { AVAILABLE_CONVERTERS, CONVERTER_PAGES } from '../lib/converters.js'
import { MORE_CALCULATOR_PAGES } from '../lib/more-calculator-pages.js'
import { PUBLIC_ROUTES } from '../lib/site.js'

describe('expanded Tooliyapa catalog',()=>{
  it('publishes all calculator and converter registry routes as actual pages',()=>{expect(AVAILABLE_CALCULATORS).toHaveLength(26);expect(AVAILABLE_CONVERTERS).toHaveLength(18);for(const tool of [...AVAILABLE_CALCULATORS,...AVAILABLE_CONVERTERS]){expect(PUBLIC_ROUTES).toContain(tool.href);expect(fs.existsSync(`app${tool.href}/page.js`)).toBe(true)}})
  it('keeps every new page backed by substantive shared page content',()=>{expect(Object.keys(MORE_CALCULATOR_PAGES)).toHaveLength(15);expect(Object.keys(CONVERTER_PAGES)).toHaveLength(18);for(const page of Object.values(MORE_CALCULATOR_PAGES))expect(page.sections.length).toBeGreaterThanOrEqual(3);for(const page of Object.values(CONVERTER_PAGES))expect(page.sections.length).toBeGreaterThanOrEqual(3)})
  it('does not publish the rejected live currency converter or redundant thin routes',()=>{expect(PUBLIC_ROUTES.join('\n')).not.toMatch(/currency|age-in-(days|weeks|hours)|fraction-decimal/i);expect(AVAILABLE_CONVERTERS.map(({id})=>id)).not.toContain('currency')})
  it('preserves CalcSuite MIT attribution for reference-derived work',()=>{expect(fs.existsSync('THIRD_PARTY_NOTICES.md')).toBe(true);const notice=fs.readFileSync('THIRD_PARTY_NOTICES.md','utf8');expect(notice).toContain('Copyright (c) 2026 Kazi Tajkir Hossen');expect(notice).toContain('MIT License');expect(PUBLIC_ROUTES).toContain('/third-party-notices')})
})
