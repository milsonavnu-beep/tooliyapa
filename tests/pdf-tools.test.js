import { describe, it, expect } from 'vitest'
import { PDFDocument, degrees } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { optimizePdfBytes, removePdfOwnerRestrictions } from '../lib/pdf-ops.js'
import { detectImageKind } from '../lib/image-embed.js'

const fixtures = path.join(process.cwd(), 'tests/fixtures')

async function makeMultiPagePdf(pages = 3) {
  const pdf = await PDFDocument.create()
  pdf.setTitle('Fixture Doc')
  pdf.setAuthor('Tooliyapa Tests')
  for (let i = 0; i < pages; i++) {
    const page = pdf.addPage([400, 600])
    page.drawText(`Page ${i + 1}`, { x: 40, y: 500, size: 18 })
  }
  return pdf.save()
}

describe('Merge PDF logic', () => {
  it('merges two PDFs and preserves page count', async () => {
    const a = await makeMultiPagePdf(2)
    const b = await makeMultiPagePdf(3)
    const out = await PDFDocument.create()
    for (const bytes of [a, b]) {
      const src = await PDFDocument.load(bytes)
      const copied = await out.copyPages(src, src.getPageIndices())
      copied.forEach((p) => out.addPage(p))
    }
    const merged = await out.save()
    const check = await PDFDocument.load(merged)
    expect(check.getPageCount()).toBe(5)
  })
})

describe('JPG/PNG to PDF', () => {
  it('embeds portrait and landscape JPEGs via Uint8Array', async () => {
    const pdf = await PDFDocument.create()
    for (const name of ['portrait.jpg', 'landscape.jpg']) {
      const raw = fs.readFileSync(path.join(fixtures, name))
      expect(detectImageKind(raw)).toBe('jpeg')
      const img = await pdf.embedJpg(new Uint8Array(raw))
      const page = pdf.addPage([img.width, img.height])
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
    }
    const bytes = await pdf.save()
    const check = await PDFDocument.load(bytes)
    expect(check.getPageCount()).toBe(2)
  })

  it('embeds PNG', async () => {
    const pdf = await PDFDocument.create()
    const raw = fs.readFileSync(path.join(fixtures, 'small.png'))
    const img = await pdf.embedPng(new Uint8Array(raw))
    const page = pdf.addPage([img.width, img.height])
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
    const bytes = await pdf.save()
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1)
  })
})

describe('Compress / optimize PDF', () => {
  it('returns a parseable PDF for standard and maximum levels', async () => {
    const original = await makeMultiPagePdf(4)
    for (const level of ['compatible', 'standard', 'maximum']) {
      const out = await optimizePdfBytes(original, level)
      const doc = await PDFDocument.load(out)
      expect(doc.getPageCount()).toBe(4)
    }
  })

  it('records size relationship (may not shrink)', async () => {
    const original = await makeMultiPagePdf(2)
    const optimized = await optimizePdfBytes(original, 'maximum')
    // Must remain valid; size change is not guaranteed
    expect(optimized.byteLength).toBeGreaterThan(100)
    expect((await PDFDocument.load(optimized)).getPageCount()).toBe(2)
    console.log('optimize sizes', { original: original.length, optimized: optimized.byteLength })
  })
})

describe('Remove PDF restrictions', () => {
  it('re-saves an openable PDF successfully', async () => {
    const original = await makeMultiPagePdf(2)
    const out = await removePdfOwnerRestrictions(original)
    const doc = await PDFDocument.load(out)
    expect(doc.getPageCount()).toBe(2)
  })
})

describe('Rotate PDF logic', () => {
  it('applies page rotation', async () => {
    const bytes = await makeMultiPagePdf(1)
    const pdf = await PDFDocument.load(bytes)
    const [page] = pdf.getPages()
    page.setRotation(degrees(90))
    const out = await pdf.save()
    const check = await PDFDocument.load(out)
    expect(check.getPages()[0].getRotation().angle).toBe(90)
  })
})
