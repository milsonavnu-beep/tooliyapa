/**
 * Shared production site URL helpers.
 * Canonical production host is https://tooliyapa.com (apex, not www).
 */
export const SITE_URL = 'https://tooliyapa.com'
export const SITE_NAME = 'Tooliyapa'

/** Public, indexable routes used by navigation, metadata checks, and sitemap generation. */
export const PUBLIC_ROUTES = [
  '/',
  '/calculators',
  '/calculators/percentage',
  '/calculators/loan',
  '/calculators/interest',
  '/merge-pdf',
  '/split-pdf',
  '/compress-pdf',
  '/rotate-pdf',
  '/organize-pdf',
  '/jpg-to-pdf',
  '/pdf-to-jpg',
  '/page-numbers',
  '/watermark',
  '/unlock-pdf',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
]

export function canonicalUrl(pathname = '/') {
  return pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`
}

export function createPageMetadata({ title, description, pathname }) {
  const url = canonicalUrl(pathname)

  return {
    // A title template does not apply to a page in the same segment as the
    // layout that defines it. Compose the root title here while keeping the
    // homepage's supplied page title clean and unbranded.
    title: pathname === '/' ? { absolute: `${title} | ${SITE_NAME}` } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
    },
  }
}
