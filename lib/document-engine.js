const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder('utf-8')
const DOCX_MAX_INPUT = 50 * 1024 * 1024
const ARCHIVE_MAX_EXPANDED = 200 * 1024 * 1024
const ARCHIVE_MAX_ENTRIES = 1000
const ARCHIVE_MAX_RATIO = 100
const IMAGE_MAX_BYTES = 25 * 1024 * 1024

function asBytes(value) {
  if (value instanceof Uint8Array) return value
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (typeof value === 'string') return textEncoder.encode(value)
  throw new TypeError('Expected text, Uint8Array, or ArrayBuffer data.')
}

async function inputBytes(input) {
  if (input instanceof Uint8Array || input instanceof ArrayBuffer) return asBytes(input)
  if (input && typeof input.arrayBuffer === 'function') return new Uint8Array(await input.arrayBuffer())
  throw new TypeError('Choose a readable local file.')
}

function u16(view, offset) { return view.getUint16(offset, true) }
function u32(view, offset) { return view.getUint32(offset, true) }

export function normalizeArchivePath(name) {
  const path = String(name || '').replace(/\\/g, '/')
  if (!path || path.startsWith('/') || /^[A-Za-z]:/.test(path)) throw new Error('Archive contains an unsafe path.')
  const parts = path.split('/').filter(Boolean)
  if (parts.some((part) => part === '..' || part === '.')) throw new Error('Archive contains an unsafe path.')
  return parts.join('/')
}

function findEndOfCentralDirectory(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const start = Math.max(0, bytes.length - 65557)
  for (let offset = bytes.length - 22; offset >= start; offset -= 1) {
    if (u32(view, offset) === 0x06054b50) return offset
  }
  throw new Error('This file is not a supported ZIP-based document.')
}

let crcTable
function getCrcTable() {
  if (crcTable) return crcTable
  crcTable = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
    crcTable[n] = c >>> 0
  }
  return crcTable
}

export function crc32(bytesInput) {
  const bytes = asBytes(bytesInput)
  const table = getCrcTable()
  let crc = 0xffffffff
  for (const byte of bytes) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

async function inflateRaw(bytes) {
  if (typeof DecompressionStream === 'undefined') throw new Error('This browser does not support local DOCX/XLSX decompression.')
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

export async function openZip(input, options = {}) {
  const bytes = await inputBytes(input)
  const maxInput = options.maxInput ?? DOCX_MAX_INPUT
  if (bytes.length > maxInput) throw new RangeError(`File is too large. Maximum input size is ${Math.round(maxInput / 1024 / 1024)} MiB.`)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const eocd = findEndOfCentralDirectory(bytes)
  const totalEntries = u16(view, eocd + 10)
  const centralSize = u32(view, eocd + 12)
  const centralOffset = u32(view, eocd + 16)
  if (totalEntries === 0xffff || centralSize === 0xffffffff || centralOffset === 0xffffffff) throw new Error('ZIP64 document packages are not supported.')
  if (totalEntries > (options.maxEntries ?? ARCHIVE_MAX_ENTRIES)) throw new RangeError('Document archive contains too many entries.')
  if (centralOffset + centralSize > bytes.length) throw new Error('Document archive directory is malformed.')

  const entries = new Map()
  let expandedTotal = 0
  let offset = centralOffset
  for (let i = 0; i < totalEntries; i += 1) {
    if (u32(view, offset) !== 0x02014b50) throw new Error('Document archive directory is malformed.')
    const flags = u16(view, offset + 8)
    const method = u16(view, offset + 10)
    const crc = u32(view, offset + 16)
    const compressedSize = u32(view, offset + 20)
    const uncompressedSize = u32(view, offset + 24)
    const nameLength = u16(view, offset + 28)
    const extraLength = u16(view, offset + 30)
    const commentLength = u16(view, offset + 32)
    const localOffset = u32(view, offset + 42)
    const rawName = bytes.slice(offset + 46, offset + 46 + nameLength)
    const name = normalizeArchivePath(textDecoder.decode(rawName))
    if (flags & 1) throw new Error('Encrypted document packages are not supported.')
    if (![0, 8].includes(method)) throw new Error(`Archive entry ${name} uses an unsupported compression method.`)
    if (localOffset >= bytes.length) throw new Error('Document archive contains an invalid entry offset.')
    expandedTotal += uncompressedSize
    if (expandedTotal > (options.maxExpanded ?? ARCHIVE_MAX_EXPANDED)) throw new RangeError('Expanded document is too large for safe browser processing.')
    if (compressedSize > 0 && uncompressedSize / compressedSize > (options.maxRatio ?? ARCHIVE_MAX_RATIO)) throw new RangeError(`Archive entry ${name} exceeds the safe compression-ratio limit.`)
    entries.set(name, { name, flags, method, crc, compressedSize, uncompressedSize, localOffset })
    offset += 46 + nameLength + extraLength + commentLength
  }

  const cache = new Map()
  async function read(nameInput) {
    const name = normalizeArchivePath(nameInput)
    if (cache.has(name)) return cache.get(name)
    const entry = entries.get(name)
    if (!entry) return null
    if (u32(view, entry.localOffset) !== 0x04034b50) throw new Error(`Archive entry ${name} has a malformed local header.`)
    const localNameLength = u16(view, entry.localOffset + 26)
    const localExtraLength = u16(view, entry.localOffset + 28)
    const start = entry.localOffset + 30 + localNameLength + localExtraLength
    const end = start + entry.compressedSize
    if (end > bytes.length) throw new Error(`Archive entry ${name} is truncated.`)
    const compressed = bytes.slice(start, end)
    const output = entry.method === 0 ? compressed : await inflateRaw(compressed)
    if (output.length !== entry.uncompressedSize) throw new Error(`Archive entry ${name} has an unexpected expanded size.`)
    if (crc32(output) !== entry.crc) throw new Error(`Archive entry ${name} failed its integrity check.`)
    cache.set(name, output)
    return output
  }

  async function readText(name) {
    const value = await read(name)
    return value ? textDecoder.decode(value) : null
  }

  return { bytes, entries, names: [...entries.keys()], read, readText, expandedTotal }
}

function writeU16(bytes, offset, value) { new DataView(bytes.buffer).setUint16(offset, value, true) }
function writeU32(bytes, offset, value) { new DataView(bytes.buffer).setUint32(offset, value >>> 0, true) }
function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0)
  const output = new Uint8Array(total)
  let offset = 0
  for (const part of parts) { output.set(part, offset); offset += part.length }
  return output
}

export async function createZip(filesInput) {
  const files = []
  for (const file of filesInput) {
    const name = normalizeArchivePath(file.name)
    const data = file.data instanceof Blob ? new Uint8Array(await file.data.arrayBuffer()) : asBytes(file.data)
    files.push({ name, data })
  }
  const localParts = []
  const centralParts = []
  let localOffset = 0
  const dosDate = 33
  for (const file of files) {
    const nameBytes = textEncoder.encode(file.name)
    const crc = crc32(file.data)
    const local = new Uint8Array(30 + nameBytes.length + file.data.length)
    writeU32(local, 0, 0x04034b50); writeU16(local, 4, 20); writeU16(local, 6, 0x0800); writeU16(local, 8, 0)
    writeU16(local, 10, 0); writeU16(local, 12, dosDate); writeU32(local, 14, crc); writeU32(local, 18, file.data.length); writeU32(local, 22, file.data.length)
    writeU16(local, 26, nameBytes.length); writeU16(local, 28, 0); local.set(nameBytes, 30); local.set(file.data, 30 + nameBytes.length)
    localParts.push(local)

    const central = new Uint8Array(46 + nameBytes.length)
    writeU32(central, 0, 0x02014b50); writeU16(central, 4, 20); writeU16(central, 6, 20); writeU16(central, 8, 0x0800); writeU16(central, 10, 0)
    writeU16(central, 12, 0); writeU16(central, 14, dosDate); writeU32(central, 16, crc); writeU32(central, 20, file.data.length); writeU32(central, 24, file.data.length)
    writeU16(central, 28, nameBytes.length); writeU16(central, 30, 0); writeU16(central, 32, 0); writeU16(central, 34, 0); writeU16(central, 36, 0)
    writeU32(central, 38, 0); writeU32(central, 42, localOffset); central.set(nameBytes, 46)
    centralParts.push(central)
    localOffset += local.length
  }
  const centralBytes = concatBytes(centralParts)
  const eocd = new Uint8Array(22)
  writeU32(eocd, 0, 0x06054b50); writeU16(eocd, 4, 0); writeU16(eocd, 6, 0); writeU16(eocd, 8, files.length); writeU16(eocd, 10, files.length)
  writeU32(eocd, 12, centralBytes.length); writeU32(eocd, 16, localOffset); writeU16(eocd, 20, 0)
  return concatBytes([...localParts, centralBytes, eocd])
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}
function escapeXml(value) { return escapeHtml(value).replace(/&#39;/g, '&apos;') }

export function decodeXml(value) {
  return String(value ?? '')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

function stripXmlTags(fragment) {
  return decodeXml(String(fragment || '').replace(/<w:tab\b[^>]*\/?\s*>/g, '\t').replace(/<w:(?:br|cr)\b[^>]*\/?\s*>/g, '\n').replace(/<[^>]+>/g, ''))
}

function attribute(fragment, name) {
  const escaped = name.replace(':', '\\:')
  return fragment.match(new RegExp(`${escaped}=["']([^"']*)["']`))?.[1] ?? null
}
function firstElementText(xml, tag) {
  const pattern = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const match = String(xml || '').match(pattern)
  return match ? stripXmlTags(match[1]).trim() : ''
}
function safeLink(url) {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? url : null
  } catch { return null }
}
function safeBaseName(name) { return String(name || 'document').replace(/\.[^.]+$/, '').replace(/[^A-Za-z0-9._ -]+/g, '_').trim() || 'document' }
function safeFilename(name) { return safeBaseName(name).slice(0, 80) }
function mimeFromName(name) {
  const ext = String(name).toLowerCase().split('.').pop()
  return ({ png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', gif:'image/gif', webp:'image/webp', bmp:'image/bmp' })[ext] || 'application/octet-stream'
}
function extFromMime(mime, fallbackName='image.bin') {
  const known = { 'image/png':'png','image/jpeg':'jpg','image/gif':'gif','image/webp':'webp','image/bmp':'bmp' }
  return known[mime] || (fallbackName.split('.').pop() || 'bin')
}

function bytesToBase64(bytes) {
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64')
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}
export function bytesToDataUrl(bytes, mime) { return `data:${mime};base64,${bytesToBase64(bytes)}` }

function parseRelationships(xml, basePrefix='word') {
  const relationships = {}
  for (const match of String(xml || '').matchAll(/<Relationship\b([^>]*)\/?\s*>/g)) {
    const attrs = match[1]
    const id = attribute(attrs, 'Id')
    const target = attribute(attrs, 'Target')
    const mode = attribute(attrs, 'TargetMode')
    if (!id || !target) continue
    if (mode === 'External') relationships[id] = { external: true, target: safeLink(decodeXml(target)) }
    else {
      const joined = target.startsWith('/') ? target.slice(1) : `${basePrefix}/${target}`
      const segments = joined.split('/')
      const normalized = []
      for (const segment of segments) { if (segment === '..') normalized.pop(); else if (segment !== '.') normalized.push(segment) }
      relationships[id] = { external: false, target: normalizeArchivePath(normalized.join('/')) }
    }
  }
  return relationships
}

function parseStyles(xml) {
  const styles = new Map()
  for (const match of String(xml || '').matchAll(/<w:style\b([^>]*)>([\s\S]*?)<\/w:style>/g)) {
    const attrs = match[1], body = match[2]
    const id = attribute(attrs, 'w:styleId') || attribute(attrs, 'styleId')
    if (!id) continue
    const nameTag = body.match(/<w:name\b([^>]*)\/?\s*>/)?.[1] || ''
    const basedTag = body.match(/<w:basedOn\b([^>]*)\/?\s*>/)?.[1] || ''
    const outlineTag = body.match(/<w:outlineLvl\b([^>]*)\/?\s*>/)?.[1] || ''
    const name = decodeXml(attribute(nameTag, 'w:val') || attribute(nameTag, 'val') || id)
    const outlineRaw = attribute(outlineTag, 'w:val') || attribute(outlineTag, 'val')
    styles.set(id, { id, name, type: attribute(attrs, 'w:type') || attribute(attrs, 'type') || 'paragraph', basedOn: attribute(basedTag, 'w:val') || attribute(basedTag, 'val') || '', outlineLevel: outlineRaw === null ? null : Number(outlineRaw), used: 0 })
  }
  return styles
}

function headingLevelFor(styleId, styles) {
  const style = styles.get(styleId)
  if (Number.isInteger(style?.outlineLevel) && style.outlineLevel >= 0 && style.outlineLevel <= 5) return style.outlineLevel + 1
  const text = `${styleId || ''} ${style?.name || ''}`
  const match = text.match(/heading\s*([1-6])/i)
  return match ? Number(match[1]) : null
}

function parseNumbering(xml) {
  const abstract = new Map(), nums = new Map()
  for (const match of String(xml || '').matchAll(/<w:abstractNum\b([^>]*)>([\s\S]*?)<\/w:abstractNum>/g)) {
    const id = attribute(match[1], 'w:abstractNumId') || attribute(match[1], 'abstractNumId')
    if (!id) continue
    const levels = new Map()
    for (const levelMatch of match[2].matchAll(/<w:lvl\b([^>]*)>([\s\S]*?)<\/w:lvl>/g)) {
      const ilvl = Number(attribute(levelMatch[1], 'w:ilvl') || attribute(levelMatch[1], 'ilvl') || 0)
      const fmtTag = levelMatch[2].match(/<w:numFmt\b([^>]*)\/?\s*>/)?.[1] || ''
      const fmt = attribute(fmtTag, 'w:val') || attribute(fmtTag, 'val') || 'bullet'
      levels.set(ilvl, fmt)
    }
    abstract.set(id, levels)
  }
  for (const match of String(xml || '').matchAll(/<w:num\b([^>]*)>([\s\S]*?)<\/w:num>/g)) {
    const numId = attribute(match[1], 'w:numId') || attribute(match[1], 'numId')
    const absTag = match[2].match(/<w:abstractNumId\b([^>]*)\/?\s*>/)?.[1] || ''
    const absId = attribute(absTag, 'w:val') || attribute(absTag, 'val')
    if (numId && absId) nums.set(numId, abstract.get(absId) || new Map())
  }
  return nums
}

function parseRuns(fragment, relationships) {
  const runs = []
  const tokenRegex = /<w:hyperlink\b[^>]*>[\s\S]*?<\/w:hyperlink>|<w:r\b[^>]*>[\s\S]*?<\/w:r>/g
  for (const tokenMatch of String(fragment || '').matchAll(tokenRegex)) {
    const token = tokenMatch[0]
    const hyperlinkId = token.startsWith('<w:hyperlink') ? (attribute(token.match(/^<w:hyperlink\b([^>]*)>/)?.[1] || '', 'r:id') || attribute(token, 'r:id')) : null
    const relationship = hyperlinkId ? relationships[hyperlinkId] : null
    const runParts = token.startsWith('<w:hyperlink') ? [...token.matchAll(/<w:r\b[^>]*>[\s\S]*?<\/w:r>/g)].map((m)=>m[0]) : [token]
    for (const run of runParts) {
      const text = [...run.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)].map((m)=>decodeXml(m[1])).join('')
      const tabs = (run.match(/<w:tab\b/g) || []).length
      const breaks = (run.match(/<w:(?:br|cr)\b/g) || []).length
      const value = `${text}${'\t'.repeat(tabs)}${'\n'.repeat(breaks)}`
      const imageId = run.match(/<a:blip\b[^>]*r:embed=["']([^"']+)["']/)?.[1] || null
      if (value || imageId) runs.push({ text: value, bold: /<w:b\b/.test(run), italic: /<w:i\b/.test(run), code: /<w:rStyle\b[^>]*(?:Code|code)/.test(run), link: relationship?.external ? relationship.target : null, imageId })
    }
  }
  if (!runs.length) {
    const text = [...String(fragment || '').matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)].map((m)=>decodeXml(m[1])).join('')
    if (text) runs.push({ text, bold:false, italic:false, code:false, link:null, imageId:null })
  }
  return runs
}

function bodyBlocks(xml, styles, numbering, relationships) {
  const body = String(xml || '').match(/<w:body\b[^>]*>([\s\S]*?)<\/w:body>/)?.[1] || ''
  const blocks = []
  let position = 0
  const opener = /<w:(p|tbl)\b/g
  while (position < body.length) {
    opener.lastIndex = position
    const match = opener.exec(body)
    if (!match) break
    const type = match[1]
    const endTag = type === 'p' ? '</w:p>' : '</w:tbl>'
    const end = body.indexOf(endTag, match.index)
    if (end < 0) break
    const fragment = body.slice(match.index, end + endTag.length)
    position = end + endTag.length
    if (type === 'tbl') {
      const rows = []
      for (const rowMatch of fragment.matchAll(/<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/g)) {
        const cells = [...rowMatch[1].matchAll(/<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g)].map((cell)=>stripXmlTags(cell[1]).replace(/\s+/g,' ').trim())
        if (cells.length) rows.push(cells)
      }
      if (rows.length) blocks.push({ type:'table', rows })
      continue
    }
    const styleTag = fragment.match(/<w:pStyle\b([^>]*)\/?\s*>/)?.[1] || ''
    const styleId = attribute(styleTag, 'w:val') || attribute(styleTag, 'val') || 'Normal'
    if (styles.has(styleId)) styles.get(styleId).used += 1
    const numIdTag = fragment.match(/<w:numId\b([^>]*)\/?\s*>/)?.[1] || ''
    const levelTag = fragment.match(/<w:ilvl\b([^>]*)\/?\s*>/)?.[1] || ''
    const numId = attribute(numIdTag, 'w:val') || attribute(numIdTag, 'val')
    const level = Number(attribute(levelTag, 'w:val') || attribute(levelTag, 'val') || 0)
    const fmt = numId ? (numbering.get(numId)?.get(level) || 'bullet') : null
    const runs = parseRuns(fragment, relationships)
    const text = runs.map((run)=>run.text).join('').trimEnd()
    const imageIds = runs.map((run)=>run.imageId).filter(Boolean)
    const headingLevel = headingLevelFor(styleId, styles)
    if (text || imageIds.length) blocks.push({ type:'paragraph', text, runs, styleId, headingLevel, list: numId ? { level, ordered: fmt !== 'bullet' } : null, imageIds })
  }
  return blocks
}

function parseMetadata(coreXml, appXml) {
  const fields = {
    title:firstElementText(coreXml,'dc:title'), subject:firstElementText(coreXml,'dc:subject'), author:firstElementText(coreXml,'dc:creator'),
    keywords:firstElementText(coreXml,'cp:keywords'), description:firstElementText(coreXml,'dc:description'), lastModifiedBy:firstElementText(coreXml,'cp:lastModifiedBy'),
    revision:firstElementText(coreXml,'cp:revision'), created:firstElementText(coreXml,'dcterms:created'), modified:firstElementText(coreXml,'dcterms:modified'),
    category:firstElementText(coreXml,'cp:category'), contentStatus:firstElementText(coreXml,'cp:contentStatus'),
    application:firstElementText(appXml,'Application'), company:firstElementText(appXml,'Company'), pages:firstElementText(appXml,'Pages'), words:firstElementText(appXml,'Words'), characters:firstElementText(appXml,'Characters')
  }
  return Object.fromEntries(Object.entries(fields).filter(([,value])=>value !== ''))
}

export async function readDocx(input) {
  if (input?.name && /\.(?:docm|dotm)$/i.test(input.name)) throw new Error('Macro-enabled Word files are not supported. Please use an unencrypted .docx file.')
  const zip = await openZip(input)
  if (!zip.entries.has('[Content_Types].xml') || !zip.entries.has('word/document.xml')) throw new Error('This does not look like a valid DOCX document.')
  if (zip.names.some((name)=>/vbaProject\.bin$/i.test(name))) throw new Error('Macro-enabled Word files are not supported.')
  const contentTypes = await zip.readText('[Content_Types].xml')
  if (/macroEnabled/i.test(contentTypes || '')) throw new Error('Macro-enabled Word files are not supported.')
  const [documentXml, stylesXml, numberingXml, relsXml, coreXml, appXml] = await Promise.all([
    zip.readText('word/document.xml'), zip.readText('word/styles.xml'), zip.readText('word/numbering.xml'), zip.readText('word/_rels/document.xml.rels'), zip.readText('docProps/core.xml'), zip.readText('docProps/app.xml')
  ])
  const styles = parseStyles(stylesXml)
  const numbering = parseNumbering(numberingXml)
  const relationships = parseRelationships(relsXml, 'word')
  const blocks = bodyBlocks(documentXml, styles, numbering, relationships)
  const images = []
  for (const name of zip.names.filter((name)=>name.startsWith('word/media/') && !name.endsWith('/'))) {
    const entry = zip.entries.get(name)
    if (entry.uncompressedSize > IMAGE_MAX_BYTES) throw new RangeError(`Embedded image ${name.split('/').pop()} is too large for safe browser processing.`)
    const data = await zip.read(name)
    images.push({ name:name.split('/').pop(), path:name, mime:mimeFromName(name), bytes:data, size:data.length })
  }
  const imageByPath = new Map(images.map((image)=>[image.path,image]))
  for (const block of blocks) {
    block.images = (block.imageIds || []).map((id)=>relationships[id]).filter((rel)=>rel && !rel.external).map((rel)=>imageByPath.get(rel.target)).filter(Boolean)
  }
  const metadata = parseMetadata(coreXml, appXml)
  const styleReport = [...styles.values()].sort((a,b)=>b.used-a.used || a.name.localeCompare(b.name))
  const counts = {
    paragraphs: blocks.filter((block)=>block.type==='paragraph').length,
    headings: blocks.filter((block)=>block.type==='paragraph' && block.headingLevel).length,
    listItems: blocks.filter((block)=>block.type==='paragraph' && block.list).length,
    tables: blocks.filter((block)=>block.type==='table').length,
    images: images.length,
    declaredStyles: styleReport.length,
    usedStyles: styleReport.filter((style)=>style.used>0).length,
    archiveEntries: zip.names.length,
    expandedBytes: zip.expandedTotal
  }
  return { name: input?.name || 'document.docx', metadata, blocks, images, styles:styleReport, counts, archiveNames:zip.names }
}

function inlineHtml(runs) {
  return (runs || []).map((run)=>{
    let value = escapeHtml(run.text).replace(/\n/g,'<br>')
    if (run.code) value = `<code>${value}</code>`
    if (run.bold) value = `<strong>${value}</strong>`
    if (run.italic) value = `<em>${value}</em>`
    if (run.link && safeLink(run.link)) value = `<a href="${escapeHtml(run.link)}">${value}</a>`
    return value
  }).join('')
}
function imageHtml(image, src) { return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(image.name)}"><figcaption>${escapeHtml(image.name)}</figcaption></figure>` }

function blocksHtml(doc, imageSource) {
  const output = []
  for (const block of doc.blocks) {
    if (block.type === 'table') {
      output.push(`<table><tbody>${block.rows.map((row)=>`<tr>${row.map((cell)=>`<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`)
      continue
    }
    const content = inlineHtml(block.runs) || escapeHtml(block.text)
    if (block.headingLevel) output.push(`<h${block.headingLevel}>${content}</h${block.headingLevel}>`)
    else if (block.list) output.push(`<p class="list-item">${block.list.ordered ? '1.' : '•'} ${content}</p>`)
    else if (content) output.push(`<p>${content}</p>`)
    for (const image of block.images || []) output.push(imageHtml(image, imageSource(image)))
  }
  return output.join('\n')
}

export function docxToHtml(doc, { standalone=true } = {}) {
  const fragment = blocksHtml(doc, (image)=>bytesToDataUrl(image.bytes,image.mime))
  if (!standalone) return fragment
  const title = doc.metadata.title || safeBaseName(doc.name)
  return `<!doctype html>\n<html lang="${escapeHtml(doc.metadata.language || 'en')}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'"><title>${escapeHtml(title)}</title><style>body{max-width:820px;margin:40px auto;padding:0 20px;font:16px/1.65 system-ui,sans-serif;color:#172033}h1,h2,h3,h4,h5,h6{line-height:1.25}table{border-collapse:collapse;width:100%;margin:1.5em 0}td{border:1px solid #cbd5e1;padding:.5em;vertical-align:top}img{max-width:100%;height:auto}.list-item{padding-left:1.2em}code{font-family:ui-monospace,monospace}</style></head><body>${fragment}</body></html>`
}

function markdownEscape(value) { return String(value||'').replace(/([\\`*_[\]<>])/g,'\\$1') }
function inlineMarkdown(runs) {
  return (runs || []).map((run)=>{
    let value = markdownEscape(run.text)
    if (run.code) value = `\`${run.text.replace(/`/g,'\\`')}\``
    if (run.bold) value = `**${value}**`
    if (run.italic) value = `*${value}*`
    if (run.link && safeLink(run.link)) value = `[${value}](${run.link})`
    return value
  }).join('')
}
function markdownCell(value) { return String(value||'').replace(/\|/g,'\\|').replace(/\n/g,' ') }

export function docxToMarkdown(doc) {
  const out=[]
  for(const block of doc.blocks){
    if(block.type==='table'){
      const width=Math.max(...block.rows.map((row)=>row.length),1);const rows=block.rows.map((row)=>Array.from({length:width},(_,i)=>markdownCell(row[i]||'')))
      if(rows.length){out.push(`| ${rows[0].join(' | ')} |`);out.push(`| ${Array(width).fill('---').join(' | ')} |`);for(const row of rows.slice(1))out.push(`| ${row.join(' | ')} |`);out.push('')}
      continue
    }
    const text=inlineMarkdown(block.runs)||markdownEscape(block.text)
    if(block.headingLevel) out.push(`${'#'.repeat(block.headingLevel)} ${text}`)
    else if(block.list) out.push(`${'  '.repeat(block.list.level||0)}${block.list.ordered?'1.':'-'} ${text}`)
    else if(text) out.push(text)
    for(const image of block.images||[]) out.push(`![${markdownEscape(image.name)}](${bytesToDataUrl(image.bytes,image.mime)})`)
    out.push('')
  }
  return out.join('\n').replace(/\n{3,}/g,'\n\n').trim()+"\n"
}

function xhtmlForEpub(doc, imageMap) {
  const output=[]
  for(const block of doc.blocks){
    if(block.type==='table'){output.push(`<table><tbody>${block.rows.map((row)=>`<tr>${row.map((cell)=>`<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);continue}
    const content=inlineHtml(block.runs)||escapeHtml(block.text)
    if(block.headingLevel)output.push(`<h${block.headingLevel}>${content}</h${block.headingLevel}>`);else if(block.list)output.push(`<p>${block.list.ordered?'1.':'•'} ${content}</p>`);else if(content)output.push(`<p>${content}</p>`)
    for(const image of block.images||[]){const target=imageMap.get(image.path);if(target)output.push(imageHtml(image,target))}
  }
  return output.join('\n')
}

export async function createEpub(doc) {
  const title=doc.metadata.title||safeBaseName(doc.name), author=doc.metadata.author||'Unknown author', language=doc.metadata.language||'en'
  const identifier=`urn:tooliyapa:${typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now()}`
  const imageMap=new Map();const imageFiles=[]
  doc.images.forEach((image,index)=>{const ext=extFromMime(image.mime,image.name);const path=`images/image-${index+1}.${ext}`;imageMap.set(image.path,path);imageFiles.push({name:`OEBPS/${path}`,data:image.bytes,mime:image.mime,id:`img${index+1}`})})
  const content=xhtmlForEpub(doc,imageMap)
  const modified=new Date().toISOString().replace(/\.\d{3}Z$/,'Z')
  const manifestImages=imageFiles.map((file)=>`<item id="${file.id}" href="${file.name.replace('OEBPS/','')}" media-type="${file.mime}"/>`).join('')
  const files=[
    {name:'mimetype',data:'application/epub+zip'},
    {name:'META-INF/container.xml',data:`<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`},
    {name:'OEBPS/styles.css',data:'body{font-family:serif;line-height:1.55}img{max-width:100%;height:auto}table{border-collapse:collapse;width:100%}td{border:1px solid #999;padding:.35em}figure{margin:1em 0}'},
    {name:'OEBPS/nav.xhtml',data:`<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Navigation</title></head><body><nav epub:type="toc"><h1>Contents</h1><ol><li><a href="content.xhtml">${escapeXml(title)}</a></li></ol></nav></body></html>`},
    {name:'OEBPS/content.xhtml',data:`<?xml version="1.0" encoding="utf-8"?><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${escapeXml(title)}</title><link rel="stylesheet" type="text/css" href="styles.css"/></head><body><h1>${escapeXml(title)}</h1>${content}</body></html>`},
    {name:'OEBPS/content.opf',data:`<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${escapeXml(identifier)}</dc:identifier><dc:title>${escapeXml(title)}</dc:title><dc:language>${escapeXml(language)}</dc:language><dc:creator>${escapeXml(author)}</dc:creator><meta property="dcterms:modified">${modified}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="content" href="content.xhtml" media-type="application/xhtml+xml"/><item id="css" href="styles.css" media-type="text/css"/>${manifestImages}</manifest><spine><itemref idref="content"/></spine></package>`},
    ...imageFiles.map((file)=>({name:file.name,data:file.data}))
  ]
  return new Blob([await createZip(files)],{type:'application/epub+zip'})
}

export async function createImagesZip(doc) {
  if(!doc.images.length)throw new Error('No embedded images were found in this DOCX file.')
  return new Blob([await createZip(doc.images.map((image)=>({name:`images/${image.name}`,data:image.bytes})))],{type:'application/zip'})
}

export function inspectDocx(doc) {
  return { file:doc.name, counts:doc.counts, metadata:doc.metadata, usedStyles:doc.styles.filter((style)=>style.used>0), images:doc.images.map(({name,mime,size})=>({name,mime,size})), archiveEntries:doc.archiveNames }
}

function inlineMarkdownHtml(text) {
  let value=escapeHtml(text)
  const stash=[]
  const hold=(html)=>{const token=`\u0000${stash.length}\u0000`;stash.push(html);return token}
  value=value.replace(/`([^`]+)`/g,(_,code)=>hold(`<code>${code}</code>`))
  value=value.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,(_,label,url)=>hold(`<a href="${escapeHtml(url)}">${label}</a>`))
  value=value.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_]+)__/g,'<strong>$1</strong>')
  value=value.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g,'<em>$1</em>').replace(/(?<!_)_([^_]+)_(?!_)/g,'<em>$1</em>')
  value=value.replace(/\u0000(\d+)\u0000/g,(_,index)=>stash[Number(index)]||'')
  return value
}

export function parseMarkdown(markdownInput) {
  const markdown=String(markdownInput||'').replace(/\r\n?/g,'\n')
  if(markdown.length>500000)throw new RangeError('Markdown is too large. Use at most 500,000 characters.')
  const lines=markdown.split('\n'),blocks=[]
  let i=0
  while(i<lines.length){const line=lines[i]
    if(/^```/.test(line)){const lang=line.replace(/^```/,'').trim();const code=[];i+=1;while(i<lines.length&&!/^```/.test(lines[i])){code.push(lines[i]);i+=1}if(i<lines.length)i+=1;blocks.push({type:'code',text:code.join('\n'),language:lang});continue}
    const heading=line.match(/^(#{1,6})\s+(.+)$/);if(heading){blocks.push({type:'heading',level:heading[1].length,text:heading[2]});i+=1;continue}
    if(/^\s*(?:---+|\*\*\*+)\s*$/.test(line)){blocks.push({type:'rule'});i+=1;continue}
    if(/^>\s?/.test(line)){const values=[];while(i<lines.length&&/^>\s?/.test(lines[i])){values.push(lines[i].replace(/^>\s?/,''));i+=1}blocks.push({type:'blockquote',text:values.join(' ')});continue}
    const list=line.match(/^(\s*)([-+*]|\d+\.)\s+(.+)$/);if(list){const items=[];const ordered=/\d+\./.test(list[2]);while(i<lines.length){const item=lines[i].match(/^(\s*)([-+*]|\d+\.)\s+(.+)$/);if(!item||(/\d+\./.test(item[2]))!==ordered)break;items.push({text:item[3],level:Math.floor(item[1].length/2)});i+=1}blocks.push({type:'list',ordered,items});continue}
    if(line.includes('|')&&i+1<lines.length&&/^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(lines[i+1])){const parseRow=(row)=>row.trim().replace(/^\||\|$/g,'').split('|').map((cell)=>cell.trim());const rows=[parseRow(line)];i+=2;while(i<lines.length&&lines[i].includes('|')&&lines[i].trim()){rows.push(parseRow(lines[i]));i+=1}blocks.push({type:'table',rows});continue}
    if(!line.trim()){i+=1;continue}
    const paragraph=[line.trim()];i+=1;while(i<lines.length&&lines[i].trim()&&!/^(#{1,6})\s+/.test(lines[i])&&!/^```/.test(lines[i])&&!/^>\s?/.test(lines[i])&&!/^(\s*)([-+*]|\d+\.)\s+/.test(lines[i])){paragraph.push(lines[i].trim());i+=1}blocks.push({type:'paragraph',text:paragraph.join(' ')})
  }
  return blocks
}

export function markdownToHtml(markdown,{standalone=true,title='Markdown document'}={}) {
  const blocks=parseMarkdown(markdown),out=[]
  for(const block of blocks){
    if(block.type==='heading')out.push(`<h${block.level}>${inlineMarkdownHtml(block.text)}</h${block.level}>`)
    else if(block.type==='paragraph')out.push(`<p>${inlineMarkdownHtml(block.text)}</p>`)
    else if(block.type==='blockquote')out.push(`<blockquote>${inlineMarkdownHtml(block.text)}</blockquote>`)
    else if(block.type==='code')out.push(`<pre><code>${escapeHtml(block.text)}</code></pre>`)
    else if(block.type==='rule')out.push('<hr>')
    else if(block.type==='list'){const tag=block.ordered?'ol':'ul';out.push(`<${tag}>${block.items.map((item)=>`<li>${inlineMarkdownHtml(item.text)}</li>`).join('')}</${tag}>`)}
    else if(block.type==='table'){out.push(`<table><tbody>${block.rows.map((row,index)=>`<tr>${row.map((cell)=>index===0?`<th>${inlineMarkdownHtml(cell)}</th>`:`<td>${inlineMarkdownHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`)}
  }
  const fragment=out.join('\n')
  if(!standalone)return fragment
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><title>${escapeHtml(title)}</title><style>body{max-width:820px;margin:40px auto;padding:0 20px;font:16px/1.65 system-ui,sans-serif;color:#172033}pre{overflow:auto;background:#f1f5f9;padding:1em;border-radius:.5em}code{font-family:ui-monospace,monospace}blockquote{border-left:4px solid #94a3b8;padding-left:1em;color:#475569}table{border-collapse:collapse;width:100%;margin:1.5em 0}th,td{border:1px solid #cbd5e1;padding:.5em;text-align:left}</style></head><body>${fragment}</body></html>`
}

function docxRun(text,{bold=false,italic=false,code=false}={}) {
  const preserve=/^\s|\s$|\s{2,}/.test(text)?' xml:space="preserve"':''
  const props=[];if(bold)props.push('<w:b/>');if(italic)props.push('<w:i/>');if(code)props.push('<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>')
  return `<w:r>${props.length?`<w:rPr>${props.join('')}</w:rPr>`:''}<w:t${preserve}>${escapeXml(text)}</w:t></w:r>`
}
function inlineDocxRuns(text) {
  const source=String(text||''),runs=[];let position=0
  const pattern=/\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;let match
  while((match=pattern.exec(source))){if(match.index>position)runs.push(docxRun(source.slice(position,match.index)));if(match[1])runs.push(docxRun(match[1],{bold:true}));else if(match[2])runs.push(docxRun(match[2],{code:true}));else if(match[3])runs.push(docxRun(match[3],{italic:true}));else if(match[4])runs.push(docxRun(`${match[4]} (${match[5]})`));position=pattern.lastIndex}
  if(position<source.length)runs.push(docxRun(source.slice(position)));return runs.join('')||docxRun('')
}
function paragraphXml(text,style='Normal') { return `<w:p><w:pPr><w:pStyle w:val="${escapeXml(style)}"/></w:pPr>${inlineDocxRuns(text)}</w:p>` }
function blocksToDocumentXml(blocks) {
  const out=[]
  for(const block of blocks){
    if(block.type==='heading')out.push(paragraphXml(block.text,`Heading${block.level}`))
    else if(block.type==='paragraph')out.push(paragraphXml(block.text))
    else if(block.type==='blockquote')out.push(paragraphXml(`“${block.text}”`))
    else if(block.type==='code')out.push(`<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr>${docxRun(block.text,{code:true})}</w:p>`)
    else if(block.type==='rule')out.push(paragraphXml('────────────────────────'))
    else if(block.type==='list')block.items.forEach((item,index)=>out.push(paragraphXml(`${'  '.repeat(item.level||0)}${block.ordered?`${index+1}.`:'•'} ${item.text}`)))
    else if(block.type==='table')out.push(`<w:tbl>${block.rows.map((row)=>`<w:tr>${row.map((cell)=>`<w:tc><w:tcPr/><w:p>${inlineDocxRuns(cell)}</w:p></w:tc>`).join('')}</w:tr>`).join('')}</w:tbl>`)
    else if(block.type==='page-break')out.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')
  }
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${out.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`
}

export async function createDocxFromBlocks(blocks,{title='Tooliyapa document',author='Tooliyapa'}={}) {
  const now=new Date().toISOString()
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>${[1,2,3,4,5,6].map((level)=>`<w:style w:type="paragraph" w:styleId="Heading${level}"><w:name w:val="heading ${level}"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="${level-1}"/></w:pPr><w:rPr><w:b/><w:sz w:val="${Math.max(24,40-level*2)}"/></w:rPr></w:style>`).join('')}<w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/></w:rPr></w:style></w:styles>`
  const files=[
    {name:'[Content_Types].xml',data:`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`},
    {name:'_rels/.rels',data:`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`},
    {name:'word/document.xml',data:blocksToDocumentXml(blocks)},
    {name:'word/styles.xml',data:styles},
    {name:'word/_rels/document.xml.rels',data:'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'},
    {name:'docProps/core.xml',data:`<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(title)}</dc:title><dc:creator>${escapeXml(author)}</dc:creator><cp:lastModifiedBy>${escapeXml(author)}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`},
    {name:'docProps/app.xml',data:'<?xml version="1.0" encoding="UTF-8"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Tooliyapa</Application></Properties>'}
  ]
  return new Blob([await createZip(files)],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
}

export async function markdownToDocx(markdown,{title='Markdown document'}={}) { return createDocxFromBlocks(parseMarkdown(markdown),{title}) }

function blocksToPlainLines(blocks) {
  const lines=[]
  for(const block of blocks){
    if(block.type==='heading')lines.push({text:block.text,size:26-Math.min(block.level,6)*2,bold:true,space:10})
    else if(block.type==='paragraph')lines.push({text:block.text,size:15,space:8})
    else if(block.type==='blockquote')lines.push({text:`“${block.text}”`,size:14,italic:true,space:8})
    else if(block.type==='code')lines.push(...block.text.split('\n').map((text)=>({text,size:13,mono:true,space:2})),{text:'',size:10,space:5})
    else if(block.type==='rule')lines.push({text:'────────────────────────────',size:12,space:8})
    else if(block.type==='list')block.items.forEach((item,index)=>lines.push({text:`${'  '.repeat(item.level||0)}${block.ordered?`${index+1}.`:'•'} ${item.text}`,size:15,space:4}))
    else if(block.type==='table')block.rows.forEach((row,index)=>lines.push({text:row.join('   |   '),size:13,bold:index===0,space:4}))
    else if(block.type==='page-break')lines.push({pageBreak:true})
  }
  return lines
}

function docxBlocksToPlainBlocks(doc) {
  const blocks=[]
  for(const block of doc.blocks){
    if(block.type==='table')blocks.push({type:'table',rows:block.rows})
    else if(block.headingLevel)blocks.push({type:'heading',level:block.headingLevel,text:block.text})
    else if(block.list)blocks.push({type:'list',ordered:block.list.ordered,items:[{text:block.text,level:block.list.level||0}]})
    else blocks.push({type:'paragraph',text:block.text})
  }
  return blocks
}

function wrapCanvasText(ctx,text,maxWidth) {
  const paragraphs=String(text||'').split('\n');const lines=[]
  for(const paragraph of paragraphs){if(!paragraph){lines.push('');continue}const words=paragraph.split(/\s+/);let line='';for(const word of words){const candidate=line?`${line} ${word}`:word;if(ctx.measureText(candidate).width<=maxWidth||!line)line=candidate;else{lines.push(line);line=word}}if(line)lines.push(line)}return lines
}

async function canvasPngBytes(canvas) {
  const blob=await new Promise((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error('Could not render the PDF page.')),'image/png'))
  return new Uint8Array(await blob.arrayBuffer())
}

export async function createPdfFromBlocks(blocks,{title='Tooliyapa document'}={}) {
  if(typeof document==='undefined')throw new Error('PDF rendering requires a browser.')
  const { PDFDocument }=await import('pdf-lib')
  const pdf=await PDFDocument.create();const width=794,height=1123,margin=74,contentWidth=width-margin*2
  let canvas=null,ctx=null,y=0,pageCount=0
  const pages=[]
  const startPage=()=>{canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);ctx.fillStyle='#172033';ctx.textBaseline='top';y=margin;pageCount+=1;if(pageCount>100)throw new RangeError('Document is too long. PDF export is limited to 100 rendered pages.')}
  const finishPage=async()=>{if(canvas)pages.push(await canvasPngBytes(canvas));canvas=null;ctx=null}
  startPage()
  const lines=[{text:title,size:28,bold:true,space:18},...blocksToPlainLines(blocks)]
  for(const item of lines){
    if(item.pageBreak){await finishPage();startPage();continue}
    const fontFamily=item.mono?'ui-monospace, SFMono-Regular, Menlo, monospace':'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
    ctx.font=`${item.italic?'italic ':''}${item.bold?'700 ':'400 '}${item.size||15}px ${fontFamily}`
    const wrapped=wrapCanvasText(ctx,item.text,contentWidth);const lineHeight=Math.round((item.size||15)*1.45)
    for(const line of wrapped){if(y+lineHeight>height-margin){await finishPage();startPage();ctx.font=`${item.italic?'italic ':''}${item.bold?'700 ':'400 '}${item.size||15}px ${fontFamily}`}ctx.fillStyle='#172033';ctx.fillText(line,margin,y);y+=lineHeight}
    y+=item.space||4
  }
  await finishPage()
  for(const png of pages){const image=await pdf.embedPng(png);const page=pdf.addPage([595.28,841.89]);page.drawImage(image,{x:0,y:0,width:595.28,height:841.89})}
  pdf.setTitle(title);pdf.setProducer('Tooliyapa');pdf.setCreator('Tooliyapa')
  return new Blob([await pdf.save()],{type:'application/pdf'})
}

export async function markdownToPdf(markdown,{title='Markdown document'}={}) { return createPdfFromBlocks(parseMarkdown(markdown),{title}) }
export async function textToPdf(text,{title='Text document'}={}) {
  const value=String(text||'');if(value.length>500000)throw new RangeError('Text is too large. Use at most 500,000 characters.')
  const blocks=value.split(/\n{2,}/).map((paragraph)=>({type:'paragraph',text:paragraph}))
  return createPdfFromBlocks(blocks,{title})
}
export async function docxToPdf(doc,{title}={}) { return createPdfFromBlocks(docxBlocksToPlainBlocks(doc),{title:title||doc.metadata.title||safeBaseName(doc.name)}) }

export function pdfTextItemsToLines(items) {
  const usable=(items||[]).filter((item)=>item&&typeof item.str==='string'&&item.str.trim()).map((item)=>({text:item.str,x:Number(item.transform?.[4]||0),y:Number(item.transform?.[5]||0)}))
  usable.sort((a,b)=>Math.abs(b.y-a.y)>2?b.y-a.y:a.x-b.x)
  const lines=[]
  for(const item of usable){let line=lines.find((candidate)=>Math.abs(candidate.y-item.y)<=2);if(!line){line={y:item.y,parts:[]};lines.push(line)}line.parts.push(item)}
  lines.sort((a,b)=>b.y-a.y)
  return lines.map((line)=>line.parts.sort((a,b)=>a.x-b.x).map((part)=>part.text).join(' ').replace(/\s+/g,' ').trim()).filter(Boolean)
}

export async function pdfPagesToDocx(pageLines,{title='Converted PDF'}={}) {
  const blocks=[];pageLines.forEach((lines,index)=>{if(index)blocks.push({type:'page-break'});for(const line of lines)blocks.push({type:'paragraph',text:line})})
  return createDocxFromBlocks(blocks,{title})
}

function relationshipTargets(xml) {
  const map=new Map()
  for(const match of String(xml||'').matchAll(/<Relationship\b([^>]*)\/?\s*>/g)){const id=attribute(match[1],'Id'),target=attribute(match[1],'Target');if(id&&target)map.set(id,target)}return map
}
function sharedStrings(xml) {
  if(!xml)return[];return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((match)=>[...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((part)=>decodeXml(part[1])).join(''))
}
function columnIndex(ref){const letters=String(ref||'').match(/^[A-Z]+/i)?.[0]?.toUpperCase()||'A';let value=0;for(const ch of letters)value=value*26+(ch.charCodeAt(0)-64);return value-1}
function csvCell(value){const text=String(value??'');return /[",\n\r]/.test(text)?`"${text.replace(/"/g,'""')}"`:text}

export function worksheetXmlToCsv(xml, shared=[]) {
  const rows=[];let cellCount=0
  for(const rowMatch of String(xml||'').matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)){
    const row=[]
    for(const cellMatch of rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)){cellCount+=1;if(cellCount>100000)throw new RangeError('Worksheet is too large. CSV export is limited to 100,000 cells.');const attrs=cellMatch[1],body=cellMatch[2];const ref=attribute(attrs,'r')||`A${rows.length+1}`;const type=attribute(attrs,'t')||'';const raw=firstElementText(body,'v');let value=raw;if(type==='s')value=shared[Number(raw)]??'';else if(type==='inlineStr')value=[...body.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m)=>decodeXml(m[1])).join('');else if(type==='b')value=raw==='1'?'TRUE':'FALSE';else if(type==='str')value=decodeXml(raw);row[columnIndex(ref)]=value}
    rows.push(row.map((value)=>csvCell(value)).join(','))
    if(rows.length>20000)throw new RangeError('Worksheet is too large. CSV export is limited to 20,000 rows.')
  }
  return rows.join('\r\n')+'\r\n'
}

export async function readXlsx(input) {
  const zip=await openZip(input,{maxInput:50*1024*1024,maxExpanded:250*1024*1024,maxEntries:2000})
  if(!zip.entries.has('xl/workbook.xml'))throw new Error('This does not look like a valid XLSX workbook.')
  const [workbookXml,relsXml,sharedXml]=await Promise.all([zip.readText('xl/workbook.xml'),zip.readText('xl/_rels/workbook.xml.rels'),zip.readText('xl/sharedStrings.xml')])
  const rels=relationshipTargets(relsXml),shared=sharedStrings(sharedXml),sheets=[]
  for(const match of String(workbookXml||'').matchAll(/<sheet\b([^>]*)\/?\s*>/g)){const name=decodeXml(attribute(match[1],'name')||'Sheet');const rid=attribute(match[1],'r:id');const target=rid?rels.get(rid):null;if(!target)continue;const joined=target.startsWith('/')?target.slice(1):`xl/${target}`;const segments=[];for(const part of joined.split('/')){if(part==='..')segments.pop();else if(part!=='.')segments.push(part)}const path=normalizeArchivePath(segments.join('/'));sheets.push({name,path})}
  if(!sheets.length)throw new Error('No readable worksheets were found in this workbook.')
  return {name:input?.name||'workbook.xlsx',sheets,async sheetToCsv(index){const sheet=sheets[index];if(!sheet)throw new RangeError('Choose a worksheet.');const xml=await zip.readText(sheet.path);if(!xml)throw new Error('The selected worksheet could not be read.');return worksheetXmlToCsv(xml,shared)}}
}

export function fileBaseName(name) { return safeFilename(name) }
