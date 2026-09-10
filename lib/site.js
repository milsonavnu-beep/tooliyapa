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
  '/calculators/percentage','/calculators/loan','/calculators/interest','/calculators/profit-margin','/calculators/tip','/calculators/basic','/calculators/statistics','/calculators/fraction','/calculators/ratio','/calculators/grade','/calculators/electrical-law',
  '/calculators/scientific','/calculators/lcm-gcf','/calculators/quadratic','/calculators/base-arithmetic','/calculators/random-number','/calculators/discount','/calculators/tax','/calculators/bmi','/calculators/bmr','/calculators/ideal-weight','/calculators/age','/calculators/date-difference','/calculators/countdown','/calculators/time-duration','/calculators/gpa',
  '/converters',
  '/converters/length','/converters/mass','/converters/temperature','/converters/volume','/converters/area','/converters/speed','/converters/data-storage','/converters/custom-unit','/converters/base','/converters/text-encoding','/converters/roman-numeral','/converters/scientific-notation','/converters/morse-code','/converters/color','/converters/power','/converters/voltage','/converters/frequency','/converters/energy',
  '/documents',
  '/documents/word-to-html','/documents/word-to-markdown','/documents/word-to-epub','/documents/word-metadata','/documents/word-style-analyzer','/documents/extract-images-from-word','/documents/docx-inspector','/documents/markdown-to-word','/documents/markdown-to-html','/documents/markdown-to-pdf','/documents/word-to-pdf','/documents/text-to-pdf','/documents/pdf-to-word','/documents/excel-to-csv',
  '/text',
  '/text/word-character-counter','/text/case-converter','/text/text-diff','/text/readability-analyzer','/text/text-analyzer','/text/find-replace','/text/sort-lines','/text/split-text','/text/reverse-text','/text/slug-generator','/text/lorem-ipsum','/text/word-cloud','/text/extractive-summarizer','/text/grammar-writing-checker','/text/text-similarity',
  '/merge-pdf','/split-pdf','/compress-pdf','/rotate-pdf','/organize-pdf','/jpg-to-pdf','/pdf-to-jpg','/page-numbers','/watermark','/unlock-pdf',
  '/about','/contact','/privacy','/terms','/disclaimer','/third-party-notices',
]

export function canonicalUrl(pathname = '/') { return pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}` }
export function createPageMetadata({ title, description, pathname }) { const url = canonicalUrl(pathname); return { title: pathname === '/' ? { absolute: `${title} | ${SITE_NAME}` } : title, description, alternates:{canonical:url}, openGraph:{title,description,type:'website',siteName:SITE_NAME,url} } }
