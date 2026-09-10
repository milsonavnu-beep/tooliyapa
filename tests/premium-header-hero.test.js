import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PUBLIC_ROUTES } from '../lib/site.js'
import { PDF_TOOLS } from '../lib/tools.js'
const root=process.cwd();const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');const header=read('components/tooliyapa/Header.js');const home=read('components/tooliyapa/HomePage.js');const search=read('components/tooliyapa/ToolSearch.js')

describe('premium header and homepage hero',()=>{
  it('uses approved logo and hero assets without DiceLogo',()=>{expect(fs.existsSync(path.join(root,'public/branding/tooliyapa_logo_primary.png'))).toBe(true);expect(fs.existsSync(path.join(root,'public/branding/tooliyapa_hero_tools.png'))).toBe(true);expect(header).toContain('src="/branding/tooliyapa_logo_primary.png"');expect(home).toContain('src="/branding/tooliyapa_hero_tools.png"');expect(header).not.toMatch(/import DiceLogo|<DiceLogo/);expect(home).not.toMatch(/import DiceLogo|<DiceLogo/)})
  it('renders one broad homepage heading and keeps substantive content',()=>{expect(home.match(/<h1(?:\s|>)/g)).toHaveLength(1);expect(home).toContain('Everyday tools for');for(const heading of ['What you can do with Tooliyapa','How browser-based processing works','Choose the right PDF tool','Practical tools, clear expectations'])expect(home).toContain(heading)})
  it('keeps PDF routes and expands search to all active categories',()=>{expect(PDF_TOOLS).toHaveLength(10);for(const tool of PDF_TOOLS)expect(PUBLIC_ROUTES).toContain(tool.href);for(const token of ['AVAILABLE_CONVERTERS','AVAILABLE_DOCUMENT_TOOLS','AVAILABLE_TEXT_TOOLS'])expect(search).toContain(token)})
  it('activates calculators, converters, documents, and text',()=>{for(const route of ['/calculators','/converters','/documents','/text']){expect(header).toContain(`href=\"${route}\"`);expect(PUBLIC_ROUTES).toContain(route)}expect(header).not.toMatch(/FUTURE_CATEGORIES|coming soon/i)})
  it('keeps search accessible and keyboard operable',()=>{expect(search).toContain('Search current tools');expect(search).toContain("event.key==='Escape'");expect(search).toContain("event.key==='Enter'");expect(search).toContain('role="listbox"');expect(search).toContain('role="option"')})
  it('clips only decorative hero background so search results can escape',()=>{expect(home).not.toContain('relative isolate overflow-hidden border-b');expect(home).toContain('pointer-events-none absolute inset-0 -z-10 overflow-hidden')})
  it('closes desktop PDF menu after selection and pathname changes',()=>{expect(header).toContain('useRef');expect(header).toContain('ref={pdfMenuRef}');expect(header).toContain('onClick={closePdfMenu}');expect(header).toContain('pdfMenuRef.current.open=false');expect(header).toContain('[pathname]')})
})
