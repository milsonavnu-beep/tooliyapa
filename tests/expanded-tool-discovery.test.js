import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { AVAILABLE_CALCULATORS } from '../lib/calculators.js'
import { AVAILABLE_CONVERTERS, CONVERTER_PAGES } from '../lib/converters.js'
import { AVAILABLE_DOCUMENT_TOOLS, DOCUMENT_PAGES } from '../lib/document-tools.js'
import { MORE_CALCULATOR_PAGES } from '../lib/more-calculator-pages.js'
import { PUBLIC_ROUTES } from '../lib/site.js'

describe('expanded Tooliyapa catalog',()=>{
  it('publishes all calculator, converter, and document registry routes as actual pages',()=>{expect(AVAILABLE_CALCULATORS).toHaveLength(26);expect(AVAILABLE_CONVERTERS).toHaveLength(18);expect(AVAILABLE_DOCUMENT_TOOLS).toHaveLength(14);for(const tool of [...AVAILABLE_CALCULATORS,...AVAILABLE_CONVERTERS,...AVAILABLE_DOCUMENT_TOOLS]){expect(PUBLIC_ROUTES).toContain(tool.href);expect(fs.existsSync(`app${tool.href}/page.js`)).toBe(true)}})
  it('keeps every shared page backed by substantive content',()=>{expect(Object.keys(MORE_CALCULATOR_PAGES)).toHaveLength(15);expect(Object.keys(CONVERTER_PAGES)).toHaveLength(18);expect(Object.keys(DOCUMENT_PAGES)).toHaveLength(14);for(const page of Object.values(MORE_CALCULATOR_PAGES))expect(page.sections.length).toBeGreaterThanOrEqual(3);for(const page of Object.values(CONVERTER_PAGES))expect(page.sections.length).toBeGreaterThanOrEqual(3);for(const page of Object.values(DOCUMENT_PAGES)){expect(page.about.length).toBeGreaterThan(80);expect(page.limitations.length).toBeGreaterThan(60)}})
  it('does not publish rejected or redundant routes',()=>{expect(PUBLIC_ROUTES.join('\n')).not.toMatch(/currency|age-in-(days|weeks|hours)|fraction-decimal|onlyoffice|pptx/i);expect(AVAILABLE_CONVERTERS.map(({id})=>id)).not.toContain('currency')})
  it('preserves attribution for all reference repositories used by the current catalog',()=>{expect(fs.existsSync('THIRD_PARTY_NOTICES.md')).toBe(true);const notice=fs.readFileSync('THIRD_PARTY_NOTICES.md','utf8');for(const text of ['Copyright (c) 2026 Kazi Tajkir Hossen','Copyright (c) 2026 Erik Vullings','Copyright (c) 2025 KYOTU Technology','Copyright (c) 2026 Jisung Chae','MIT License'])expect(notice).toContain(text);expect(PUBLIC_ROUTES).toContain('/third-party-notices')})
})
