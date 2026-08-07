/**
 * Lightweight client-safe tool search over registry metadata.
 * No external services. Pure string matching.
 */

import { getActiveTools } from './registry.js'

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s+→\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokens(query) {
  return normalize(query).split(' ').filter(Boolean)
}

function haystackFor(tool) {
  return normalize(
    [
      tool.name,
      tool.shortDescription,
      tool.longDescription,
      tool.navLabel,
      tool.category,
      ...(tool.tags || []),
      ...(tool.keywords || []),
      ...(tool.searchTerms || []),
    ].join(' ')
  )
}

/**
 * Score a tool against a query. Higher is better. 0 = no match.
 */
export function scoreTool(tool, query) {
  const q = normalize(query)
  if (!q) return 0
  const hay = haystackFor(tool)
  const name = normalize(tool.name)
  const parts = tokens(query)

  let score = 0
  if (name === q) score += 100
  if (name.startsWith(q)) score += 40
  if (name.includes(q)) score += 25
  if (hay.includes(q)) score += 20

  for (const part of parts) {
    if (name.includes(part)) score += 12
    else if (hay.includes(part)) score += 6
    else return 0
  }

  if (tool.featured) score += 2
  return score
}

/**
 * Search active tools. Returns ranked tools (best first).
 * @param {string} query
 * @param {{ limit?: number, tools?: object[] }} [options]
 */
export function searchTools(query, options = {}) {
  const { limit = 20, tools = getActiveTools() } = options
  const q = normalize(query)
  if (!q) return []

  return tools
    .map((tool) => ({ tool, score: scoreTool(tool, q) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, limit)
    .map((row) => row.tool)
}
