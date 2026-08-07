import { PDFDocument } from 'pdf-lib'

/**
 * Lossless PDF optimization via pdf-lib re-save.
 * Does NOT recompress embedded images — already-optimized PDFs may not shrink.
 *
 * @param {ArrayBuffer|Uint8Array} arrayBuffer
 * @param {'compatible'|'standard'|'maximum'} level
 */
export async function optimizePdfBytes(arrayBuffer, level = 'standard') {
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  if (level === 'maximum') {
    try {
      pdf.setTitle('')
      pdf.setAuthor('')
      pdf.setSubject('')
      pdf.setKeywords([])
      pdf.setProducer('')
      pdf.setCreator('')
    } catch {
      /* metadata may be absent */
    }
  }
  const useObjectStreams = level !== 'compatible'
  return pdf.save({ useObjectStreams, addDefaultPage: false })
}

/**
 * Strip owner-permission / encryption dictionary when pdf-lib can load the PDF
 * with ignoreEncryption. Does NOT decrypt open/user-password protected PDFs.
 *
 * @param {ArrayBuffer|Uint8Array} arrayBuffer
 */
export async function removePdfOwnerRestrictions(arrayBuffer) {
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  const out = await PDFDocument.create()
  const pages = await out.copyPages(pdf, pdf.getPageIndices())
  pages.forEach((p) => out.addPage(p))
  return out.save()
}
