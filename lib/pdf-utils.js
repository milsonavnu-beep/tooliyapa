export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Robust download that works in normal pages AND in sandboxed preview iframes.
 * Uses both <a download> AND target="_blank" + window.open fallback.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    a.target = '_blank' // fallback if iframe sandbox blocks download attribute
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch (e) {
    // last resort: open in new tab so user can manually save
    window.open(url, '_blank')
  }
  // Keep blob alive long enough for the browser to start the download
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

export async function readFileAsArrayBuffer(file) {
  return await file.arrayBuffer()
}

export function parsePageRanges(input, totalPages) {
  // Accepts e.g. "1-3,5,8-10" — returns sorted unique page indices (0-based)
  const set = new Set()
  const parts = (input || '').split(',').map((s) => s.trim()).filter(Boolean)
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/)
    if (m) {
      let a = parseInt(m[1], 10)
      let b = parseInt(m[2], 10)
      if (a > b) [a, b] = [b, a]
      for (let i = a; i <= b; i++) {
        if (i >= 1 && i <= totalPages) set.add(i - 1)
      }
    } else if (/^\d+$/.test(part)) {
      const n = parseInt(part, 10)
      if (n >= 1 && n <= totalPages) set.add(n - 1)
    }
  }
  return Array.from(set).sort((a, b) => a - b)
}
