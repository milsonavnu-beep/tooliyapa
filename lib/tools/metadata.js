/**
 * Central metadata helpers for tools and categories.
 * Ensures canonical + og:url use the correct absolute page URL.
 */

import { SITE_NAME, SITE_URL } from '../site.js'
import { getActiveCategories, getCategoryBySlug } from './categories.js'
import { absoluteUrl, getActiveTools, getToolById, getToolBySlug } from './registry.js'

function assertNoPreviewHost(value) {
  const text = String(value || '')
  if (/emergentagent|swift-pdf-tools|preview\.emergent/i.test(text)) {
    throw new Error(`Preview-domain reference leaked into metadata: ${text}`)
  }
  return text
}

/**
 * Build Next.js Metadata for a registered tool.
 * @param {string} toolId
 */
export function buildToolMetadata(toolId) {
  const tool = getToolById(toolId)
  if (!tool) throw new Error(`Unknown tool id: ${toolId}`)

  const canonicalPath = tool.href
  const canonical = absoluteUrl(canonicalPath)
  const title = tool.seo?.title || tool.name
  const description = tool.seo?.description || tool.shortDescription

  assertNoPreviewHost(canonical)
  assertNoPreviewHost(title)
  assertNoPreviewHost(description)

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/**
 * Build Next.js Metadata for a public category page.
 * @param {string} categorySlug
 */
export function buildCategoryMetadata(categorySlug) {
  const category = getCategoryBySlug(categorySlug)
  if (!category || category.status !== 'active') {
    throw new Error(`Unknown or inactive category: ${categorySlug}`)
  }

  const canonicalPath = category.href
  const canonical = absoluteUrl(canonicalPath)
  const title = category.seo?.title || category.name
  const description = category.seo?.description || category.description

  assertNoPreviewHost(canonical)

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function buildHomeMetadata() {
  const title = 'Tooliyapa - Free Online PDF Tools | Merge, Split, Compress'
  const description =
    'Free, privacy-friendly, fast online PDF tools. Merge, split, compress, rotate, watermark and convert PDFs — all in your browser. Files are not uploaded to Tooliyapa servers.'
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/** Unique public paths for sitemap generation. */
export function listSitemapPaths() {
  const paths = ['/', ...getActiveCategories().map((c) => c.href), ...getActiveTools().map((t) => t.href)]
  return [...new Set(paths)]
}

export function resolveToolSlugMetadata(slug) {
  const tool = getToolBySlug(slug)
  if (!tool) return null
  return buildToolMetadata(tool.id)
}
