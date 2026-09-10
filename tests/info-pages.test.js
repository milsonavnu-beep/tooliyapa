import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PUBLIC_ROUTES, canonicalUrl } from '../lib/site.js'

const root = process.cwd()
const infoRoutes = ['/about', '/contact', '/privacy', '/terms', '/disclaimer']
const renderedTitles = {
  '/about': 'About Our PDF Tools | Tooliyapa',
  '/contact': 'Contact and Support | Tooliyapa',
  '/privacy': 'Privacy Policy | Tooliyapa',
  '/terms': 'Terms of Use | Tooliyapa',
  '/disclaimer': 'Disclaimer | Tooliyapa',
}

function pageSource(route) { return fs.readFileSync(path.join(root, `app${route}/page.js`), 'utf8') }

describe('informational and trust pages', () => {
  it('publishes every informational route in the central route inventory', () => { for (const route of infoRoutes) { expect(PUBLIC_ROUTES).toContain(route); expect(canonicalUrl(route)).toBe(`https://tooliyapa.com${route}`) } })
  it('uses the shared metadata helper once per page with no noindex or forbidden host', () => { for (const route of infoRoutes) { const source = pageSource(route); expect(source.match(/createPageMetadata\s*\(/g)).toHaveLength(1); expect(source).toContain(`pathname: '${route}'`); expect(source).not.toMatch(/noindex|index:\s*false|follow:\s*false/i); expect(source).not.toMatch(/www\.tooliyapa|http:\/\/|localhost|emergent/i) } })
  it('composes clean titles with the global site-name suffix exactly once', () => { const layout = fs.readFileSync(path.join(root, 'app/layout.js'), 'utf8'); const template = layout.match(/template:\s*'([^']+)'/)?.[1]; expect(template).toBe('%s | Tooliyapa'); for (const route of infoRoutes) { const pageTitle = pageSource(route).match(/title:\s*'([^']+)'/)?.[1]; const renderedTitle = template.replace('%s', pageTitle); expect(renderedTitle).toBe(renderedTitles[route]); expect(renderedTitle.match(/Tooliyapa/g)).toHaveLength(1); expect(renderedTitle).not.toContain('Tooliyapa | Tooliyapa') } })
  it('links every required informational and legal destination from the footer', () => { const markup = fs.readFileSync(path.join(root, 'components/tooliyapa/Footer.js'), 'utf8'); for (const route of ['/', ...infoRoutes]) expect(markup).toContain(`'${route}'`); for (const label of ['Privacy Policy', 'Terms of Use', 'Disclaimer']) expect(markup).toContain(label) })
  it('uses only the approved public email and does not publish placeholder contact details', () => { const source = infoRoutes.map(pageSource).join('\n'); const emails = source.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g) || []; expect(new Set(emails)).toEqual(new Set(['milsonavnu@gmail.com'])); expect(pageSource('/contact')).toContain('mailto:${email}'); expect(source).not.toMatch(/support@tooliyapa\.com|123 Main|Example (Street|Road)|registered office|phone number/i) })
  it('keeps one shared server-rendered H1 and semantic H2 sections', () => { const layout = fs.readFileSync(path.join(root, 'components/tooliyapa/InfoPage.jsx'), 'utf8'); expect(layout.match(/<h1\b/g)).toHaveLength(1); expect(layout.match(/<h2\b/g)).toHaveLength(1); for (const route of infoRoutes) { expect(pageSource(route)).toContain('<InfoPage'); expect(pageSource(route)).toContain('<InfoSection') } })
  it('publishes a cautious, complete Google advertising and browser-processing disclosure', () => {
    const privacy = pageSource('/privacy')
    expect(privacy).toMatch(/Google as a third-party advertising vendor/i)
    expect(privacy).toMatch(/advertising cookies/i)
    expect(privacy).toMatch(/visits to Tooliyapa and\s*\/\s*or other websites/i)
    expect(privacy).toMatch(/manage or opt out of personalized Google advertising/i)
    expect(privacy).toContain('https://www.google.com/settings/ads')
    expect(privacy).toContain('https://policies.google.com/privacy')
    expect(privacy).toMatch(/Files selected[\s\S]*supported PDF and document tools[\s\S]*processed in your browser/i)
    expect(privacy).toMatch(/normal page requests, advertising, software resources, and other website services operate separately/i)
    expect(privacy).not.toMatch(/(?:guaranteed|guarantees) (?:GDPR|legal) compliance/i)
    expect(privacy).not.toMatch(/Tooliyapa (?:currently )?(?:displays|provides|uses) (?:a )?(?:Google-certified )?(?:CMP|consent banner)/i)
    expect(privacy).not.toMatch(/zero tracking|nothing leaves (?:your|the) browser/i)
    expect(privacy).not.toMatch(/(?:^|[.!?]\s*)(?:all ads|all advertising) (?:are|is) personalized/i)
  })
})
