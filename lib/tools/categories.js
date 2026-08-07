/**
 * Tooliyapa category catalogue.
 *
 * Only categories with status: 'active' and at least one active tool
 * should appear in public navigation, sitemap, and category pages.
 * Planned categories stay internal until the first real tool ships.
 */

export const CATEGORIES = [
  {
    id: 'pdf',
    name: 'PDF Tools',
    slug: 'pdf',
    href: '/pdf',
    description:
      'Free browser-based PDF utilities — merge, split, optimize, convert, rotate, organize, and more. Files are processed locally and are not uploaded to Tooliyapa servers.',
    shortDescription: 'Merge, split, convert, and edit PDFs in your browser.',
    icon: 'file-text',
    order: 1,
    status: 'active',
    seo: {
      title: 'PDF Tools — Free Online PDF Utilities',
      description:
        'Free PDF tools that run in your browser. Merge, split, optimize, rotate, organize, convert JPG↔PDF, watermark, number pages, and remove owner restrictions — without uploading files to Tooliyapa servers.',
    },
  },
  // Future categories — inactive until a real tool exists. Never expose publicly.
  {
    id: 'image',
    name: 'Image Tools',
    slug: 'image',
    href: '/image',
    description: 'Browser-based image utilities.',
    shortDescription: 'Resize, compress, and convert images.',
    icon: 'image',
    order: 2,
    status: 'planned',
    seo: { title: 'Image Tools', description: 'Image utilities for Tooliyapa.' },
  },
  {
    id: 'text',
    name: 'Text Tools',
    slug: 'text',
    href: '/text',
    description: 'Browser-based text utilities.',
    shortDescription: 'Count, convert, and format text.',
    icon: 'type',
    order: 3,
    status: 'planned',
    seo: { title: 'Text Tools', description: 'Text utilities for Tooliyapa.' },
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    slug: 'developer',
    href: '/developer',
    description: 'Browser-based developer utilities.',
    shortDescription: 'JSON, Base64, UUID, and more.',
    icon: 'code',
    order: 4,
    status: 'planned',
    seo: { title: 'Developer Tools', description: 'Developer utilities for Tooliyapa.' },
  },
  {
    id: 'converters',
    name: 'Converters',
    slug: 'converters',
    href: '/converters',
    description: 'Format and unit converters.',
    shortDescription: 'Convert between formats and units.',
    icon: 'refresh-cw',
    order: 5,
    status: 'planned',
    seo: { title: 'Converters', description: 'Converters for Tooliyapa.' },
  },
  {
    id: 'calculators',
    name: 'Calculators',
    slug: 'calculators',
    href: '/calculators',
    description: 'Simple calculators that run locally.',
    shortDescription: 'Percentage, age, and finance helpers.',
    icon: 'calculator',
    order: 6,
    status: 'planned',
    seo: { title: 'Calculators', description: 'Calculators for Tooliyapa.' },
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    slug: 'date-time',
    href: '/date-time',
    description: 'Date and time utilities.',
    shortDescription: 'Timestamps, age, and date helpers.',
    icon: 'calendar',
    order: 7,
    status: 'planned',
    seo: { title: 'Date & Time Tools', description: 'Date and time utilities for Tooliyapa.' },
  },
  {
    id: 'generators',
    name: 'Generators',
    slug: 'generators',
    href: '/generators',
    description: 'Local generators for passwords, QR codes, and more.',
    shortDescription: 'Passwords, QR codes, and IDs.',
    icon: 'sparkles',
    order: 8,
    status: 'planned',
    seo: { title: 'Generators', description: 'Generators for Tooliyapa.' },
  },
  {
    id: 'design',
    name: 'Design & Colour',
    slug: 'design',
    href: '/design',
    description: 'Colour and design helpers.',
    shortDescription: 'Colour pickers and design utilities.',
    icon: 'palette',
    order: 9,
    status: 'planned',
    seo: { title: 'Design & Colour Tools', description: 'Design utilities for Tooliyapa.' },
  },
  {
    id: 'seo',
    name: 'SEO & Web',
    slug: 'seo',
    href: '/seo',
    description: 'SEO and web helper utilities.',
    shortDescription: 'Meta, slug, and web helpers.',
    icon: 'globe',
    order: 10,
    status: 'planned',
    seo: { title: 'SEO & Web Tools', description: 'SEO utilities for Tooliyapa.' },
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    slug: 'privacy',
    href: '/privacy',
    description: 'Privacy and security helpers that run locally.',
    shortDescription: 'Hashing, encoding, and privacy helpers.',
    icon: 'shield',
    order: 11,
    status: 'planned',
    seo: { title: 'Privacy & Security Tools', description: 'Privacy utilities for Tooliyapa.' },
  },
]

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || null
}

export function getCategoryBySlug(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null
}

/** Categories that may appear in public UI / sitemap. */
export function getActiveCategories() {
  return CATEGORIES.filter((c) => c.status === 'active').sort((a, b) => a.order - b.order)
}

export function isCategoryPublic(category) {
  return category?.status === 'active'
}
