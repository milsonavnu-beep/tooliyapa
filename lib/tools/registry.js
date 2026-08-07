/**
 * Tooliyapa tool registry — metadata only.
 *
 * IMPORTANT: Do not import tool UI components or pdf-lib / pdfjs-dist here.
 * This module must stay safe for server components, sitemap, metadata, and search.
 */

import { SITE_URL } from '../site.js'
import { getCategoryById } from './categories.js'

/**
 * @typedef {'active' | 'planned' | 'deprecated'} ToolStatus
 * @typedef {'browser-local'} ProcessingMode
 */

/** @type {import('./types').ToolDefinition[] | object[]} */
export const TOOLS = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    href: '/merge-pdf',
    category: 'pdf',
    tags: ['pdf', 'merge', 'combine', 'join'],
    shortDescription: 'Combine multiple PDFs into one.',
    longDescription:
      'Combine multiple PDF files into a single document. Drag to reorder files before merging. Processing stays in your browser.',
    icon: 'combine',
    accent: 'red',
    keywords: ['merge pdf', 'combine pdf', 'join pdf', 'pdf merger'],
    searchTerms: ['combine pdf', 'join pdf', 'merge files', 'pdf merger', 'concatenate'],
    status: 'active',
    featured: true,
    navLabel: 'Merge',
    navPriority: 1,
    relatedToolIds: ['split-pdf', 'organize-pdf', 'rotate-pdf'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Merge PDF — Free Online PDF Merger',
      description:
        'Combine multiple PDFs into one file in any order. Free, fast, and processed in your browser — files are not uploaded to Tooliyapa servers.',
    },
    howToUse: [
      'Upload two or more PDF files (drag & drop or browse).',
      'Drag files to set the merge order.',
      'Click Merge PDF.',
      'Download the combined PDF.',
    ],
    faq: [
      {
        question: 'Are my PDFs uploaded to Tooliyapa?',
        answer:
          'No. Merge runs entirely in your browser with pdf-lib. Your files are not uploaded to Tooliyapa servers. The site may still load advertising scripts such as Google AdSense, which are separate from file processing.',
      },
      {
        question: 'Can I change the order of files before merging?',
        answer: 'Yes. Drag files in the list to reorder them. The numbered list shows the final page order.',
      },
      {
        question: 'How many PDFs can I merge?',
        answer:
          'There is no hard app limit, but very large files or many documents can strain browser memory. Start with smaller batches if a merge fails.',
      },
    ],
    limitations: [
      'Very large PDFs may exhaust browser memory.',
      'Encrypted PDFs that require an open password may not load.',
    ],
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    href: '/split-pdf',
    category: 'pdf',
    tags: ['pdf', 'split', 'extract', 'pages'],
    shortDescription: 'Extract pages or split into ranges.',
    longDescription:
      'Extract selected pages or split every page into its own PDF. Thumbnails help you pick pages visually.',
    icon: 'scissors',
    accent: 'amber',
    keywords: ['split pdf', 'extract pages', 'separate pdf'],
    searchTerms: ['extract pages', 'split pages', 'separate pdf', 'cut pdf'],
    status: 'active',
    featured: true,
    navLabel: 'Split',
    navPriority: 2,
    relatedToolIds: ['merge-pdf', 'organize-pdf', 'page-numbers'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Split PDF — Extract & Split Pages Online',
      description:
        'Extract specific pages or split every page into a separate PDF. Free and private — processing stays in your browser.',
    },
    howToUse: [
      'Upload a PDF.',
      'Click thumbnails to select pages, or choose split-every-page.',
      'Run the split.',
      'Download the resulting PDF file(s).',
    ],
    faq: [
      {
        question: 'Can I extract only some pages?',
        answer: 'Yes. Select the page thumbnails you want, then extract them into a new PDF.',
      },
      {
        question: 'Are files uploaded?',
        answer:
          'No. Rendering and splitting run locally in your browser. Files are not uploaded to Tooliyapa servers.',
      },
    ],
    limitations: [
      'Page thumbnails require the self-hosted pdf.js worker and enough browser memory for large documents.',
    ],
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    href: '/compress-pdf',
    category: 'pdf',
    tags: ['pdf', 'compress', 'optimize', 'size'],
    shortDescription: 'Lossless optimize (may not shrink images).',
    longDescription:
      'Lossless PDF optimization using object streams and optional metadata stripping. This is not aggressive image recompression, so image-heavy PDFs may not shrink much.',
    icon: 'minimize-2',
    accent: 'emerald',
    keywords: ['compress pdf', 'optimize pdf', 'reduce pdf size'],
    searchTerms: ['optimize pdf', 'reduce size', 'shrink pdf', 'lossless compress'],
    status: 'active',
    featured: true,
    navLabel: 'Compress',
    navPriority: 3,
    relatedToolIds: ['merge-pdf', 'organize-pdf', 'pdf-to-jpg'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Compress PDF — Lossless PDF Optimization',
      description:
        'Lossless PDF optimization in your browser (object streams + optional metadata strip). Image-heavy files may not shrink. Files are not uploaded to Tooliyapa servers.',
    },
    howToUse: [
      'Upload a PDF.',
      'Choose an optimization level (Legacy, Standard, or Maximum).',
      'Click Optimize.',
      'Compare sizes and download the result.',
    ],
    faq: [
      {
        question: 'Why did my file size not decrease?',
        answer:
          'This tool performs lossless optimization. It does not re-encode embedded images. Already-compressed or image-heavy PDFs often stay the same size — that is expected.',
      },
      {
        question: 'Is optimization lossless?',
        answer:
          'Yes. Standard and Maximum modes keep page content intact while rewriting structure (and Maximum may strip metadata). Legacy mode prioritizes compatibility and may increase size.',
      },
      {
        question: 'What does Legacy do?',
        answer:
          'Legacy uses a more compatible save mode that may increase file size. Prefer Standard or Maximum for typical optimization.',
      },
    ],
    limitations: [
      'Does not re-encode images; size reduction is often modest.',
      'Legacy mode may increase file size.',
    ],
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    slug: 'rotate-pdf',
    href: '/rotate-pdf',
    category: 'pdf',
    tags: ['pdf', 'rotate', 'orientation'],
    shortDescription: 'Rotate all or selected pages.',
    longDescription: 'Rotate all pages or a selected range by 90°, 180°, or 270° in your browser.',
    icon: 'rotate-cw',
    accent: 'blue',
    keywords: ['rotate pdf', 'turn pages', 'landscape portrait'],
    searchTerms: ['rotate pages', 'turn pdf', 'fix orientation', 'landscape'],
    status: 'active',
    featured: false,
    navLabel: 'Rotate',
    navPriority: 4,
    relatedToolIds: ['organize-pdf', 'merge-pdf', 'split-pdf'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Rotate PDF — Rotate Pages Online',
      description:
        'Rotate all or selected pages of a PDF by 90°, 180°, or 270°. Free and processed in your browser.',
    },
    howToUse: [
      'Upload a PDF.',
      'Choose rotation angle and whether to rotate all pages or a range.',
      'Apply rotation.',
      'Download the updated PDF.',
    ],
    faq: [
      {
        question: 'Can I rotate only some pages?',
        answer: 'Yes. Choose a page range when you do not want to rotate the entire document.',
      },
      {
        question: 'Are files uploaded?',
        answer: 'No. Rotation runs locally with pdf-lib in your browser.',
      },
    ],
    limitations: ['Very large PDFs may be slow or memory-intensive in the browser.'],
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    slug: 'organize-pdf',
    href: '/organize-pdf',
    category: 'pdf',
    tags: ['pdf', 'organize', 'reorder', 'delete', 'pages'],
    shortDescription: 'Drag to reorder or delete pages.',
    longDescription:
      'Reorder, rotate, or delete PDF pages using drag-and-drop thumbnails. Useful when you need to remove PDF pages without a separate delete tool.',
    icon: 'layers',
    accent: 'violet',
    keywords: ['organize pdf', 'reorder pages', 'delete pages'],
    searchTerms: ['reorder pages', 'delete pages', 'remove pdf pages', 'arrange pages', 'move pages'],
    status: 'active',
    featured: false,
    navLabel: 'Organize',
    navPriority: 5,
    relatedToolIds: ['split-pdf', 'merge-pdf', 'rotate-pdf'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Organize PDF — Reorder & Delete Pages',
      description:
        'Drag-and-drop page thumbnails to reorder, rotate, or delete PDF pages. Processed in your browser.',
    },
    howToUse: [
      'Upload a PDF.',
      'Drag thumbnails to reorder pages; remove pages you do not need.',
      'Apply your organization changes.',
      'Download the new PDF.',
    ],
    faq: [
      {
        question: 'Can I delete pages from a PDF?',
        answer: 'Yes. Remove unwanted page thumbnails before saving. That is the supported way to remove PDF pages on Tooliyapa.',
      },
      {
        question: 'Can I reorder pages?',
        answer: 'Yes. Drag page thumbnails into the order you want.',
      },
    ],
    limitations: [
      'Thumbnail rendering needs enough memory for large documents.',
      'There is no separate “delete pages” tool — use Organize PDF.',
    ],
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    href: '/jpg-to-pdf',
    category: 'pdf',
    tags: ['pdf', 'jpg', 'jpeg', 'png', 'image', 'convert'],
    shortDescription: 'Convert JPG/PNG images to a single PDF.',
    longDescription:
      'Convert one or more JPG, JPEG, or PNG images into a single PDF. Portrait and landscape images are sized to fit page dimensions.',
    icon: 'file-image',
    accent: 'pink',
    keywords: ['jpg to pdf', 'png to pdf', 'image to pdf'],
    searchTerms: ['image to pdf', 'png to pdf', 'jpeg to pdf', 'photos to pdf', 'convert images'],
    status: 'active',
    featured: true,
    navLabel: 'JPG→PDF',
    navPriority: 6,
    relatedToolIds: ['pdf-to-jpg', 'merge-pdf'],
    processing: 'browser-local',
    inputType: 'image',
    outputType: 'pdf',
    seo: {
      title: 'JPG to PDF — Convert Images to PDF',
      description:
        'Convert JPG, JPEG and PNG images into a single PDF document. Free and instant — images stay in your browser.',
    },
    howToUse: [
      'Upload one or more JPG/JPEG/PNG images.',
      'Reorder images if needed.',
      'Convert to PDF.',
      'Download the resulting PDF.',
    ],
    faq: [
      {
        question: 'Are images uploaded?',
        answer:
          'No. Images are read and embedded locally in your browser. They are not uploaded to Tooliyapa servers.',
      },
      {
        question: 'Can I combine multiple images?',
        answer: 'Yes. Add multiple images and they become consecutive pages in one PDF.',
      },
      {
        question: 'Does it support PNG?',
        answer: 'Yes. JPG, JPEG, and PNG are supported.',
      },
    ],
    limitations: [
      'Very large images may need downscaling in memory-constrained browsers.',
      'Other formats (WebP, HEIC, etc.) are not the primary supported inputs.',
    ],
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    href: '/pdf-to-jpg',
    category: 'pdf',
    tags: ['pdf', 'jpg', 'image', 'convert', 'export'],
    shortDescription: 'Export each page as a JPG image.',
    longDescription: 'Render each PDF page as a JPG image using the self-hosted pdf.js worker in your browser.',
    icon: 'image',
    accent: 'orange',
    keywords: ['pdf to jpg', 'pdf to image', 'export pages'],
    searchTerms: ['pdf to image', 'export jpg', 'convert pdf pages', 'pdf screenshot'],
    status: 'active',
    featured: false,
    navLabel: 'PDF→JPG',
    navPriority: 7,
    relatedToolIds: ['jpg-to-pdf', 'split-pdf'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'image',
    seo: {
      title: 'PDF to JPG — Convert PDF Pages to Images',
      description:
        'Export each PDF page as a JPG image in your browser. Free — files are not uploaded to Tooliyapa servers.',
    },
    howToUse: [
      'Upload a PDF.',
      'Wait for pages to render.',
      'Download individual JPGs or all pages.',
      'Use JPG to PDF if you need to rebuild a PDF from images.',
    ],
    faq: [
      {
        question: 'Are files uploaded?',
        answer: 'No. Pages are rendered locally with pdf.js. Files are not uploaded to Tooliyapa servers.',
      },
      {
        question: 'What format do I get?',
        answer: 'Each page is exported as a JPG image.',
      },
    ],
    limitations: [
      'High page counts or large page sizes can be slow and memory-heavy.',
      'Output is raster images, not vector text.',
    ],
  },
  {
    id: 'page-numbers',
    name: 'Page Numbers',
    slug: 'page-numbers',
    href: '/page-numbers',
    category: 'pdf',
    tags: ['pdf', 'page numbers', 'pagination'],
    shortDescription: 'Add page numbers to your PDF.',
    longDescription: 'Add page numbers in configurable positions and formats to every page of a PDF.',
    icon: 'hash',
    accent: 'cyan',
    keywords: ['page numbers pdf', 'paginate pdf', 'add page numbers'],
    searchTerms: ['paginate', 'page numbering', 'add numbers', 'footer numbers'],
    status: 'active',
    featured: false,
    navLabel: 'Page #',
    navPriority: 8,
    relatedToolIds: ['watermark', 'organize-pdf'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Add Page Numbers to PDF',
      description:
        'Add page numbers to your PDF in any position with multiple formats. Free and processed in your browser.',
    },
    howToUse: [
      'Upload a PDF.',
      'Choose position and number format.',
      'Apply page numbers.',
      'Download the numbered PDF.',
    ],
    faq: [
      {
        question: 'Can I choose where numbers appear?',
        answer: 'Yes. Pick a position such as bottom-center or other supported placements in the tool UI.',
      },
      {
        question: 'Are files uploaded?',
        answer: 'No. Numbering is applied locally with pdf-lib.',
      },
    ],
    limitations: ['Existing content near the number position may overlap depending on page layout.'],
  },
  {
    id: 'watermark',
    name: 'Watermark',
    slug: 'watermark',
    href: '/watermark',
    category: 'pdf',
    tags: ['pdf', 'watermark', 'text', 'stamp'],
    shortDescription: 'Add a text watermark to every page.',
    longDescription: 'Stamp a text watermark across every page with opacity, rotation, and size controls.',
    icon: 'type',
    accent: 'fuchsia',
    keywords: ['watermark pdf', 'stamp pdf', 'text watermark'],
    searchTerms: ['stamp pdf', 'overlay text', 'confidential watermark', 'draft watermark'],
    status: 'active',
    featured: false,
    navLabel: 'Watermark',
    navPriority: 9,
    relatedToolIds: ['page-numbers', 'organize-pdf'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Watermark PDF — Add Text Watermark',
      description:
        'Add a text watermark to every page of your PDF with opacity and rotation controls. Runs in your browser.',
    },
    howToUse: [
      'Upload a PDF.',
      'Enter watermark text and adjust opacity, rotation, and size.',
      'Apply the watermark.',
      'Download the stamped PDF.',
    ],
    faq: [
      {
        question: 'Can I change opacity and rotation?',
        answer: 'Yes. The tool exposes controls for text, opacity, rotation, and size.',
      },
      {
        question: 'Are files uploaded?',
        answer: 'No. Watermarking runs locally in your browser.',
      },
    ],
    limitations: ['Image-based watermarks are not provided — text watermarks only.'],
  },
  {
    id: 'unlock-pdf',
    name: 'Remove PDF Restrictions',
    slug: 'unlock-pdf',
    href: '/unlock-pdf',
    category: 'pdf',
    tags: ['pdf', 'unlock', 'restrictions', 'permissions', 'owner'],
    shortDescription: 'Strip owner restrictions (not open-passwords).',
    longDescription:
      'Remove common owner-permission restrictions (print/copy limits) from PDFs you can already open. This does not decrypt open-password (user) encryption.',
    icon: 'unlock',
    accent: 'slate',
    keywords: ['unlock pdf', 'remove pdf restrictions', 'owner password'],
    searchTerms: [
      'remove restrictions',
      'owner permissions',
      'unlock permissions',
      'print restrictions',
      'remove password restrictions',
    ],
    status: 'active',
    featured: false,
    navLabel: 'Restrictions',
    navPriority: 10,
    relatedToolIds: ['compress-pdf', 'merge-pdf'],
    processing: 'browser-local',
    inputType: 'pdf',
    outputType: 'pdf',
    seo: {
      title: 'Remove PDF Restrictions — Owner Permissions',
      description:
        'Remove common owner-permission restrictions from PDFs you can already open. Does not decrypt open-password encryption. Runs in your browser.',
    },
    howToUse: [
      'Upload a PDF you can already open (no open-password required).',
      'Run Remove Restrictions.',
      'Download the re-saved PDF when processing succeeds.',
    ],
    faq: [
      {
        question: 'Can this remove an open password?',
        answer:
          'No. If a PDF requires a password just to open (user encryption), this tool cannot decrypt it in the browser.',
      },
      {
        question: 'What restrictions can the tool remove?',
        answer:
          'It can strip common owner restrictions such as print/copy limits by re-saving a readable PDF with pdf-lib where supported.',
      },
      {
        question: 'Are files uploaded?',
        answer: 'No. Processing stays in your browser. Files are not uploaded to Tooliyapa servers.',
      },
    ],
    limitations: [
      'Does not crack or decrypt open-password (user) encryption.',
      'Only helps with owner-permission restrictions on PDFs you can already open.',
    ],
  },
]

export function getAllTools() {
  return TOOLS.slice()
}

export function getActiveTools() {
  return TOOLS.filter((t) => t.status === 'active')
}

export function getToolById(id) {
  return TOOLS.find((t) => t.id === id) || null
}

export function getToolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug) || null
}

export function getToolByHref(href) {
  return TOOLS.find((t) => t.href === href) || null
}

export function getToolsByCategory(categoryId, { activeOnly = true } = {}) {
  return TOOLS.filter(
    (t) => t.category === categoryId && (!activeOnly || t.status === 'active')
  )
}

export function getFeaturedTools() {
  return getActiveTools()
    .filter((t) => t.featured)
    .sort((a, b) => (a.navPriority ?? 99) - (b.navPriority ?? 99))
}

export function getNavTools() {
  return getActiveTools().sort((a, b) => (a.navPriority ?? 99) - (b.navPriority ?? 99))
}

export function getRelatedTools(toolId) {
  const tool = getToolById(toolId)
  if (!tool) return []
  const seen = new Set()
  return (tool.relatedToolIds || [])
    .map((id) => getToolById(id))
    .filter((t) => {
      if (!t || t.status !== 'active' || t.id === toolId) return false
      if (seen.has(t.id)) return false
      seen.add(t.id)
      return true
    })
}

export function getActiveToolCount() {
  return getActiveTools().length
}

export function getToolCategory(tool) {
  return getCategoryById(tool?.category)
}

/** Absolute production URL for a tool or path. */
export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
