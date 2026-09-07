import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const component = fs.readFileSync(path.join(root, 'components/tooliyapa/AdSenseScript.js'), 'utf8')
const layout = fs.readFileSync(path.join(root, 'app/layout.js'), 'utf8')

describe('AdSense route loading', () => {
  it('omits AdSense only from the privacy route', () => {
    expect(component).toContain("usePathname()")
    expect(component).toMatch(/pathname === ['"]\/privacy['"]/)
    expect(component).toMatch(/if \(pathname === ['"]\/privacy['"]\) return null/)
    expect(component).not.toMatch(/pathname === ['"]\/(?:merge-pdf)?['"]/)
  })

  it('keeps the shared loader mounted for normal routes', () => {
    expect(layout).toContain("import AdSenseScript from '@/components/tooliyapa/AdSenseScript'")
    expect(layout.match(/<AdSenseScript\s*\/>/g)).toHaveLength(1)
  })

  it('preserves the existing AdSense settings', () => {
    expect(component).toContain('async')
    expect(component).toContain('strategy="afterInteractive"')
    expect(component).toContain('crossOrigin="anonymous"')
    expect(component).toContain('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5475600467474553')
  })
})
