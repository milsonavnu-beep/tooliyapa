/**
 * Detect image kind from magic bytes (more reliable than File.type).
 * @param {ArrayBuffer|Uint8Array} buf
 * @returns {'jpeg'|'png'|'unknown'}
 */
export function detectImageKind(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg'
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a
  ) return 'png'
  return 'unknown'
}

/**
 * Guess kind from MIME / filename when magic bytes are inconclusive.
 */
export function guessImageKindFromFile(file) {
  const mime = (file?.type || '').toLowerCase()
  const name = (file?.name || '').toLowerCase()
  if (mime === 'image/jpeg' || mime === 'image/jpg' || name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'jpeg'
  if (mime === 'image/png' || name.endsWith('.png')) return 'png'
  return 'unknown'
}

/**
 * Embed a browser File into a pdf-lib PDFDocument.
 * Uses magic-byte detection; falls back to canvas re-encode for odd MIME cases.
 * Supports JPEG and PNG (as advertised by JPG to PDF tool).
 *
 * @param {import('pdf-lib').PDFDocument} pdf
 * @param {File|Blob} file
 */
export async function embedImageFile(pdf, file) {
  const ab = await file.arrayBuffer()
  const buf = new Uint8Array(ab)
  let kind = detectImageKind(buf)
  if (kind === 'unknown') kind = guessImageKindFromFile(file)

  if (kind === 'jpeg') {
    try {
      return await pdf.embedJpg(buf)
    } catch {
      // Fall through to canvas re-encode (e.g. unusual JPEG variants)
    }
  }
  if (kind === 'png') {
    try {
      return await pdf.embedPng(buf)
    } catch {
      // Fall through
    }
  }

  // Canvas fallback: decode with browser, re-encode as PNG (lossless for pdf-lib)
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') {
    throw new Error('Unsupported image format')
  }
  const blob = file instanceof Blob ? file : new Blob([buf])
  const bitmap = await createImageBitmap(blob)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas unavailable')
    ctx.drawImage(bitmap, 0, 0)
    const pngBlob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encode failed'))), 'image/png')
    })
    const pngBuf = new Uint8Array(await pngBlob.arrayBuffer())
    return await pdf.embedPng(pngBuf)
  } finally {
    bitmap.close?.()
  }
}
