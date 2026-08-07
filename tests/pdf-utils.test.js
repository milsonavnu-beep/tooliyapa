import { describe, it, expect } from 'vitest'
import { parsePageRanges, formatBytes } from '../lib/pdf-utils.js'
import { detectImageKind, guessImageKindFromFile } from '../lib/image-embed.js'
import { PDFJS_WORKER_SRC } from '../lib/pdfjs-worker.js'
import { SITE_URL } from '../lib/site.js'
import fs from 'fs'
import path from 'path'

describe('pdf-utils', () => {
  it('parses page ranges', () => {
    expect(parsePageRanges('1-3,5', 10)).toEqual([0, 1, 2, 4])
    expect(parsePageRanges('', 5)).toEqual([])
    expect(parsePageRanges('99', 5)).toEqual([])
    expect(parsePageRanges('3-1', 5)).toEqual([0, 1, 2])
  })

  it('formats bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1024)).toMatch(/KB/)
  })
})

describe('site config', () => {
  it('uses apex tooliyapa.com', () => {
    expect(SITE_URL).toBe('https://tooliyapa.com')
    expect(SITE_URL).not.toContain('emergentagent')
    expect(SITE_URL).not.toContain('www.')
  })
})

describe('pdfjs worker', () => {
  it('points at self-hosted worker', () => {
    expect(PDFJS_WORKER_SRC).toBe('/pdfjs/pdf.worker.min.mjs')
    expect(PDFJS_WORKER_SRC).not.toContain('cdnjs')
    const workerPath = path.join(process.cwd(), 'public/pdfjs/pdf.worker.min.mjs')
    expect(fs.existsSync(workerPath)).toBe(true)
  })
})

describe('image detection', () => {
  it('detects jpeg and png magic bytes', () => {
    const jpg = fs.readFileSync(path.join(process.cwd(), 'tests/fixtures/portrait.jpg'))
    const png = fs.readFileSync(path.join(process.cwd(), 'tests/fixtures/small.png'))
    expect(detectImageKind(jpg)).toBe('jpeg')
    expect(detectImageKind(png)).toBe('png')
    expect(detectImageKind(new Uint8Array([1, 2, 3]))).toBe('unknown')
  })

  it('guesses from filename/mime', () => {
    expect(guessImageKindFromFile({ type: 'image/jpeg', name: 'a.bin' })).toBe('jpeg')
    expect(guessImageKindFromFile({ type: '', name: 'x.PNG' })).toBe('png')
  })
})
