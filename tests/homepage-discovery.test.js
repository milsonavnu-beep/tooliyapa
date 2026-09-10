import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PDF_TOOLS } from '../lib/tools.js'
import { AVAILABLE_CALCULATORS } from '../lib/calculators.js'
import { AVAILABLE_CONVERTERS } from '../lib/converters.js'
import { AVAILABLE_DOCUMENT_TOOLS } from '../lib/document-tools.js'
import { AVAILABLE_TEXT_TOOLS } from '../lib/text-tools.js'
const root=process.cwd();const home=fs.readFileSync(path.join(root,'components/tooliyapa/HomePage.js'),'utf8')

describe('homepage category and tool discovery',()=>{
  it('keeps every real PDF tool registry-backed and reachable',()=>{expect(PDF_TOOLS).toHaveLength(10);expect(home).toContain("import { PDF_TOOLS } from '@/lib/tools'");expect(home).toContain('const TOOLS=PDF_TOOLS.map');expect(home).toContain('href={tool.href}');for(const{href}of PDF_TOOLS)expect(home).toContain(`'${href}': {`)})
  it('makes every live category active with registry-derived counts',()=>{for(const route of ['/calculators','/converters','/documents','/text'])expect(home).toContain(`href=\"${route}\"`);expect(home).toContain('{AVAILABLE_CALCULATORS.length} tools available');expect(home).toContain('{AVAILABLE_CONVERTERS.length} tools available');expect(home).toContain('{AVAILABLE_DOCUMENT_TOOLS.length} tools available');expect(home).toContain('{AVAILABLE_TEXT_TOOLS.length} tools available');expect(AVAILABLE_CALCULATORS).toHaveLength(26);expect(AVAILABLE_CONVERTERS).toHaveLength(18);expect(AVAILABLE_DOCUMENT_TOOLS).toHaveLength(14);expect(AVAILABLE_TEXT_TOOLS).toHaveLength(15)})
  it('does not leave Text marked coming soon',()=>{expect(home).toContain('Browse text tools');expect(home).not.toMatch(/FUTURE_CATEGORIES|Text category will follow/)})
  it('preserves the hero destination and approved branding assets',()=>{expect(home).toContain('id="tools"');expect(home).toContain('href="#tools"');expect(home).toContain('src="/branding/tooliyapa_hero_tools.png"');expect(home).not.toMatch(/import DiceLogo|<DiceLogo/)})
  it('keeps substantive lower homepage content intact',()=>{for(const heading of ['What you can do with Tooliyapa','How browser-based processing works','Choose the right PDF tool','Practical tools, clear expectations'])expect(home).toContain(heading)})
  it('uses editorial featuring without fake popularity or analytics claims',()=>{expect(home).toContain('Featured PDF tools');expect(home).toContain('More PDF tools');expect(home).not.toMatch(/popular tools|most popular|downloads today|(?:customer|user) reviews?|\d[\d,]*\+? (?:ratings?|reviews?)/i);expect(home).toContain('href="/privacy"')})
})
