import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

describe('teal interface color system', () => {
  it('uses the approved teal for browser chrome and the global focus indicator', () => {
    expect(read('app/layout.js')).toContain("themeColor: '#0F766E'")
    expect(JSON.parse(read('public/manifest.json')).theme_color).toBe('#0F766E')
    expect(read('app/globals.css')).toContain('outline: 2px solid #0F766E')
    expect(read('app/globals.css')).not.toContain('#dc2626')
  })

  it('uses teal for shared brand UI while retaining semantic reds', () => {
    const header = read('components/tooliyapa/Header.js')
    const home = read('components/tooliyapa/HomePage.js')
    const info = read('components/tooliyapa/InfoPage.jsx')

    expect(header).toContain('focus-visible:ring-teal-600')
    expect(home).toMatch(/bg-teal-50[^]*?Simple tools\. Real productivity\./)
    expect(home).toContain('text-teal-700 underline decoration-teal-200')
    expect(info).toContain('text-teal-700 underline decoration-teal-300')

    expect(header).not.toContain('text-red-600')
    expect(read('components/tooliyapa/OrganizePdfTool.js')).toMatch(/bg-red-500\/90[^\n]+title="Delete page"/)
    expect(read('components/ui/toast.jsx')).toContain('group-[.destructive]:text-red-300')
  })
})
