import { createPageMetadata } from './site.js'

export const DOCUMENT_TOOLS = [
  {
    id: 'word-html', title: 'Word to HTML', href: '/documents/word-to-html', subcategory: 'Word conversions',
    description: 'Convert an unencrypted DOCX file into clean standalone HTML while keeping semantic headings, paragraphs, lists, tables, links, and supported images.',
    keywords: 'word docx html convert document web standalone', input: 'DOCX', output: 'HTML',
    about: 'This converter reads the DOCX package locally, reconstructs the document structure, and writes a script-free HTML document. It favors readable semantic structure over exact Microsoft Word page layout.',
    limitations: 'Floating shapes, text boxes, headers, footers, comments, tracked changes, unusual numbering, and exact desktop-font layout can differ or be omitted. Legacy .doc, encrypted files, and macro-enabled .docm files are not accepted.'
  },
  {
    id: 'word-markdown', title: 'Word to Markdown', href: '/documents/word-to-markdown', subcategory: 'Word conversions',
    description: 'Turn DOCX content into portable Markdown with headings, lists, tables, links, basic formatting, and supported embedded images.',
    keywords: 'word docx markdown md convert headings tables', input: 'DOCX', output: 'Markdown',
    about: 'Use this tool when you want editable plain-text content for documentation, repositories, note systems, or publishing workflows. Tooliyapa maps Word structure to Markdown rather than reproducing page geometry.',
    limitations: 'Markdown cannot represent every Word layout feature. Complex table spans, floating content, comments, headers, footers, and uncommon Word styles may be simplified.'
  },
  {
    id: 'word-epub', title: 'Word to EPUB', href: '/documents/word-to-epub', subcategory: 'Word conversions',
    description: 'Create a reflowable EPUB 3 ebook from an unencrypted DOCX file, including semantic content and supported embedded images.',
    keywords: 'word docx epub ebook convert reflowable publication', input: 'DOCX', output: 'EPUB',
    about: 'The generated EPUB is a reflowable publication designed for ebook readers. Headings, paragraphs, simple lists, tables, and supported images are placed into a standards-oriented EPUB package with navigation and metadata.',
    limitations: 'This is not a fixed-layout copy of the Word document. Page breaks, exact fonts, columns, floating shapes, and desktop pagination are intentionally not preserved.'
  },
  {
    id: 'word-metadata', title: 'Word Metadata Viewer', href: '/documents/word-metadata', subcategory: 'Word inspection',
    description: 'Inspect DOCX document properties such as title, author, subject, keywords, revision, creation date, modification date, and application metadata.',
    keywords: 'word docx metadata properties author title created modified inspect', input: 'DOCX', output: 'Metadata report',
    about: 'DOCX files can contain core and application properties that are not obvious from the visible document. This viewer reads those fields locally and presents only values actually stored in the file.',
    limitations: 'A blank field means the property was not found in the DOCX package. Tooliyapa does not infer missing authorship or ownership information.'
  },
  {
    id: 'word-styles', title: 'Word Style Analyzer', href: '/documents/word-style-analyzer', subcategory: 'Word inspection',
    description: 'Review paragraph and character styles declared in a DOCX file and see which paragraph styles are actually used.',
    keywords: 'word docx styles heading normal formatting analyzer paragraph', input: 'DOCX', output: 'Style report',
    about: 'The analyzer reads Word style definitions and counts their use in document paragraphs. It is useful for diagnosing heading structure, template consistency, and style-heavy documents before conversion.',
    limitations: 'The report describes OOXML style definitions and usage, not the exact final visual appearance produced by Microsoft Word after all theme, font, and layout rules are applied.'
  },
  {
    id: 'word-images', title: 'Extract Images from Word', href: '/documents/extract-images-from-word', subcategory: 'Word inspection',
    description: 'Find supported media embedded in a DOCX package and download the original image files individually or together in a ZIP.',
    keywords: 'word docx extract images pictures media download zip', input: 'DOCX', output: 'Images / ZIP',
    about: 'DOCX files are ZIP-based OOXML packages. This tool inspects the package locally and extracts files stored under the Word media area without uploading the source document.',
    limitations: 'Only embedded media files are extracted. Linked remote images, drawing instructions, charts, SmartArt, and unsupported vector objects are not converted into new raster images.'
  },
  {
    id: 'docx-inspector', title: 'DOCX Inspector', href: '/documents/docx-inspector', subcategory: 'Word inspection',
    description: 'Inspect a DOCX package for document counts, headings, tables, lists, styles, images, metadata, and archive-level information.',
    keywords: 'docx inspector analyze document structure headings tables images package', input: 'DOCX', output: 'Inspection report',
    about: 'DOCX Inspector combines structural analysis and package information in one report. It can help you understand a document before converting, publishing, or troubleshooting it.',
    limitations: 'Inspection is intentionally bounded for browser safety and does not execute macros, external relationships, embedded executables, or ActiveX content.'
  },
  {
    id: 'markdown-word', title: 'Markdown to Word', href: '/documents/markdown-to-word', subcategory: 'Markdown & text',
    description: 'Write or paste Markdown and export a standards-based DOCX document with headings, paragraphs, lists, code blocks, blockquotes, and tables.',
    keywords: 'markdown md word docx convert export document', input: 'Markdown', output: 'DOCX',
    about: 'Tooliyapa turns common Markdown structure into a simple editable Word document. A live preview helps you review the content before downloading the DOCX.',
    limitations: 'The exporter focuses on portable document structure. Advanced themes, arbitrary HTML, custom Word templates, Mermaid rendering, and pixel-perfect desktop layout are outside this first-party implementation.'
  },
  {
    id: 'markdown-html', title: 'Markdown to HTML', href: '/documents/markdown-to-html', subcategory: 'Markdown & text',
    description: 'Convert Markdown into a safe standalone HTML document with a live browser preview.',
    keywords: 'markdown md html convert preview web document', input: 'Markdown', output: 'HTML',
    about: 'The converter supports common headings, paragraphs, emphasis, links, lists, blockquotes, fenced code, horizontal rules, and simple tables. Source text is escaped before markup is generated.',
    limitations: 'Raw HTML inside Markdown is treated as text rather than executed. This keeps previews and exports predictable and avoids turning pasted Markdown into active webpage code.'
  },
  {
    id: 'markdown-pdf', title: 'Markdown to PDF', href: '/documents/markdown-to-pdf', subcategory: 'Markdown & text',
    description: 'Render Markdown into a downloadable A4 PDF in your browser with a live HTML preview before export.',
    keywords: 'markdown md pdf convert document export preview', input: 'Markdown', output: 'PDF',
    about: 'Tooliyapa renders the parsed Markdown into paginated A4 pages locally. Browser fonts are used during rendering so common Unicode text can be preserved visually.',
    limitations: 'The PDF pages are rendered for consistent browser appearance and may not preserve selectable text. Very large documents are capped to protect browser memory.'
  },
  {
    id: 'word-pdf', title: 'Word to PDF', href: '/documents/word-to-pdf', subcategory: 'Word conversions',
    description: 'Convert DOCX content into a readable A4 PDF locally in the browser using semantic text reflow rather than desktop Word pagination.',
    keywords: 'word docx pdf convert document browser', input: 'DOCX', output: 'PDF',
    about: 'This converter reconstructs readable document content from DOCX and lays it out onto PDF pages. It is useful when a browser-only, privacy-first conversion is more important than exact Microsoft Word pagination.',
    limitations: 'Exact page layout, floating objects, text boxes, headers, footers, columns, desktop fonts, and advanced Word drawing features are not reproduced. Review the PDF before relying on it as a final published copy.'
  },
  {
    id: 'text-pdf', title: 'Text to PDF', href: '/documents/text-to-pdf', subcategory: 'Markdown & text',
    description: 'Turn plain text into a clean A4 PDF without uploading the text to a conversion server.',
    keywords: 'text txt pdf convert plain text document', input: 'Plain text', output: 'PDF',
    about: 'Paste plain text, choose a title if needed, and create a paginated PDF entirely in the browser. Line breaks are preserved and long lines are wrapped to the printable width.',
    limitations: 'This is a plain-text workflow, so rich formatting, embedded images, and word-processing layout are not added automatically.'
  },
  {
    id: 'pdf-word', title: 'PDF to Word', href: '/documents/pdf-to-word', subcategory: 'Document conversions',
    description: 'Extract text from a text-based PDF and rebuild it as an editable DOCX document locally in your browser.',
    keywords: 'pdf word docx convert extract text editable document', input: 'PDF', output: 'DOCX',
    about: 'The converter reads positioned text from each PDF page, reconstructs lines, and places the extracted text into an editable Word document. No OCR service or server upload is used.',
    limitations: 'PDF is a final-layout format, so original columns, tables, images, fonts, headers, and precise positioning are not recreated. Image-only scans need OCR and are not converted into meaningful text by this tool.'
  },
  {
    id: 'excel-csv', title: 'Excel to CSV', href: '/documents/excel-to-csv', subcategory: 'Document conversions',
    description: 'Open an XLSX workbook locally, choose a worksheet, and export its cell values as CSV.',
    keywords: 'excel xlsx csv convert spreadsheet worksheet', input: 'XLSX', output: 'CSV',
    about: 'The XLSX reader resolves workbook sheets, shared strings, inline strings, booleans, formulas with cached values, and ordinary numeric cells directly from the OOXML package.',
    limitations: 'CSV stores values only. Formatting, formulas themselves, charts, images, macros, comments, merged-cell presentation, and workbook features are not preserved. Excel date serials may remain numeric when style metadata is ambiguous.'
  }
]

export const DOCUMENT_PAGES = Object.fromEntries(DOCUMENT_TOOLS.map((tool) => [tool.id, tool]))
export const AVAILABLE_DOCUMENT_TOOLS = DOCUMENT_TOOLS

export function documentMetadata(id) {
  const tool = DOCUMENT_PAGES[id]
  if (!tool) throw new Error(`Unknown document tool: ${id}`)
  return createPageMetadata({ title: `${tool.title} - Free Online Tool`, description: tool.description, pathname: tool.href })
}
