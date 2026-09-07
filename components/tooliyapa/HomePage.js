'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
  Combine, Minimize2, Scissors, RotateCw, Image as ImageIcon, FileImage,
  Hash, Type, Layers, Unlock, ShieldCheck, Cpu, Download,
} from 'lucide-react'
import DiceLogo from '@/components/tooliyapa/DiceLogo'

const TOOLS = [
  { href: '/merge-pdf', title: 'Merge PDF', desc: 'Combine PDFs in your chosen whole-file order.', icon: Combine, iconBg: 'bg-red-50 dark:bg-red-950/40', iconColor: 'text-red-600' },
  { href: '/split-pdf', title: 'Split PDF', desc: 'Extract thumbnail-selected pages or make one PDF per page.', icon: Scissors, iconBg: 'bg-amber-50 dark:bg-amber-950/40', iconColor: 'text-amber-600' },
  { href: '/compress-pdf', title: 'Compress PDF', desc: 'Optimize PDF structure losslessly without recompressing images.', icon: Minimize2, iconBg: 'bg-emerald-50 dark:bg-emerald-950/40', iconColor: 'text-emerald-600' },
  { href: '/rotate-pdf', title: 'Rotate PDF', desc: 'Rotate every page or specified page numbers and ranges.', icon: RotateCw, iconBg: 'bg-blue-50 dark:bg-blue-950/40', iconColor: 'text-blue-600' },
  { href: '/organize-pdf', title: 'Organize PDF', desc: 'Reorder, remove, and rotate individual pages.', icon: Layers, iconBg: 'bg-violet-50 dark:bg-violet-950/40', iconColor: 'text-violet-600' },
  { href: '/jpg-to-pdf', title: 'JPG to PDF', desc: 'Arrange JPG, JPEG, or PNG images into one PDF.', icon: FileImage, iconBg: 'bg-pink-50 dark:bg-pink-950/40', iconColor: 'text-pink-600' },
  { href: '/pdf-to-jpg', title: 'PDF to JPG', desc: 'Render every PDF page as a separate JPG image.', icon: ImageIcon, iconBg: 'bg-orange-50 dark:bg-orange-950/40', iconColor: 'text-orange-600' },
  { href: '/page-numbers', title: 'Page Numbers', desc: 'Number every page in a choice of header or footer positions.', icon: Hash, iconBg: 'bg-cyan-50 dark:bg-cyan-950/40', iconColor: 'text-cyan-600' },
  { href: '/watermark', title: 'Text Watermark', desc: 'Add the same customizable text watermark to every page.', icon: Type, iconBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', iconColor: 'text-fuchsia-600' },
  { href: '/unlock-pdf', title: 'Remove Restrictions', desc: 'Attempt to remove owner permissions from an already readable PDF.', icon: Unlock, iconBg: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-700 dark:text-slate-300' },
]

const linkClass = 'font-medium text-red-700 underline decoration-red-200 underline-offset-4 transition hover:text-red-800 hover:decoration-red-500 dark:text-red-400 dark:decoration-red-900 dark:hover:text-red-300'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16">
      <section className="text-center max-w-3xl mx-auto mb-12" aria-labelledby="homepage-heading">
        <div className="flex justify-center mb-6">
          <DiceLogo size={88} />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-medium mb-5">
          <ShieldCheck className="w-3 h-3" aria-hidden="true" /> Browser-based PDF processing
        </div>
        <h1 id="homepage-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Simple PDF tools for
          <span className="block bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">everyday document tasks.</span>
        </h1>
        <p className="mt-5 text-lg leading-8 text-gray-600 dark:text-gray-400">Merge, split, organize, rotate, convert, number, watermark, and optimize PDF files with focused tools that run in your browser.</p>
      </section>

      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">Choose a PDF tool</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href} aria-label={`${tool.title}: ${tool.desc}`}>
              <Card className="group cursor-pointer p-5 border border-gray-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white dark:bg-gray-900 h-full">
                <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">{tool.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{tool.desc}</p>
              </Card>
            </Link>
          )
        })}
        </div>
      </section>

      <section className="mt-20 max-w-6xl mx-auto" aria-labelledby="possibilities-heading">
        <div className="max-w-3xl">
          <h2 id="possibilities-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">What you can do with Tooliyapa</h2>
          <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">Start with the outcome you need. Each tool has a focused workflow, so you can move between tools when a document needs more than one change.</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Combine and organize</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400"><Link className={linkClass} href="/merge-pdf">Merge PDF</Link> joins separate documents in whole-file order. <Link className={linkClass} href="/split-pdf">Split PDF</Link> extracts thumbnail-selected pages or creates separate one-page files. For changes inside one document, <Link className={linkClass} href="/organize-pdf">Organize PDF</Link> reorders, removes, and rotates individual pages, while <Link className={linkClass} href="/rotate-pdf">Rotate PDF</Link> applies an angle to all or specified pages.</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Convert documents and images</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400"><Link className={linkClass} href="/jpg-to-pdf">JPG to PDF</Link> places JPG, JPEG, or PNG images into one PDF, with move controls setting their order. <Link className={linkClass} href="/pdf-to-jpg">PDF to JPG</Link> takes the opposite path by rendering every page as its own JPG.</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Prepare a finished PDF</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">Try <Link className={linkClass} href="/compress-pdf">Compress PDF</Link> for lossless structural optimization, <Link className={linkClass} href="/page-numbers">Page Numbers</Link> for consistent numbering on every page, or <Link className={linkClass} href="/watermark">Text Watermark</Link> for one visible text label across the document.</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Work with owner permissions</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400"><Link className={linkClass} href="/unlock-pdf">Remove PDF Restrictions</Link> can attempt to rewrite an already readable PDF without supported owner-permission restrictions. It does not guess passwords, crack encryption, or decrypt a file that requires a password to open.</p>
          </article>
        </div>
      </section>

      <section className="mt-16 max-w-6xl mx-auto rounded-2xl border border-red-100 bg-red-50/70 p-6 sm:p-8 dark:border-red-950 dark:bg-red-950/20" aria-labelledby="processing-heading">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <Cpu className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
            <h2 id="processing-heading" className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">How browser-based processing works</h2>
          </div>
          <div className="space-y-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
            <p>The selected files for these tool workflows are processed by code running in your browser. The selected files themselves are not uploaded to Tooliyapa servers as part of the processing workflow. When processing finishes, you download the generated result from the browser.</p>
            <p>Speed and capacity depend on the file&apos;s size and complexity as well as your device, available memory, and browser. A large scan or a PDF with complex pages can take longer or fail where a smaller document succeeds.</p>
            <p>Ordinary website services and third-party scripts are separate from PDF-file processing. Read the <Link className={linkClass} href="/privacy">Privacy Policy</Link> for more information about website data and service providers.</p>
          </div>
        </div>
      </section>

      <section className="mt-16 max-w-6xl mx-auto" aria-labelledby="choose-heading">
        <h2 id="choose-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Choose the right PDF tool</h2>
        <div className="mt-7 grid gap-x-10 gap-y-6 md:grid-cols-2">
          {[
            { title: 'Merge or organize?', desc: 'Merge combines separate PDFs in whole-file order. Organize changes the pages within one PDF, using thumbnails to reorder, remove, or rotate them.' },
            { title: 'Split or organize?', desc: 'Split creates one combined extraction from selected thumbnails or a separate PDF for each page. Organize produces one PDF after page-level edits.' },
            { title: 'Rotate or organize?', desc: 'Rotate applies one chosen angle to every page or to page numbers and ranges you specify. Organize is better when you want thumbnails and different rotations for individual pages.' },
            { title: 'What does compression change?', desc: 'Compress rewrites PDF structure losslessly and does not resize or recompress embedded images. An already optimized or image-heavy file may not become smaller.' },
            { title: 'What does a watermark do?', desc: 'Watermark adds visible text to every page. That marking is not document encryption, access control, DRM, or proof of ownership.' },
            { title: 'Which restrictions are supported?', desc: 'Restriction removal is an attempt for authorized, already readable PDFs with owner permissions. It is not open-password decryption, and results depend on the file.' },
          ].map((item) => (
            <article key={item.title} className="border-l-2 border-red-200 pl-4 dark:border-red-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-6xl mx-auto border-t border-gray-200 pt-12 dark:border-gray-800" aria-labelledby="trust-heading">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="trust-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Practical tools, clear expectations</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">Tooliyapa provides browser-based PDF utilities, and no account is currently required to use them.</p>
          </div>
          <div className="space-y-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
            <p>Keep your source file and check every downloaded result before sharing it or relying on it. Unusual, damaged, encrypted, or very large documents may fail, and specialized PDF features may not always survive a rewrite exactly.</p>
            <p>Learn more <Link className={linkClass} href="/about">about Tooliyapa</Link>, review the <Link className={linkClass} href="/privacy">Privacy Policy</Link>, or <Link className={linkClass} href="/contact">contact us</Link>. Use of the site is also covered by the <Link className={linkClass} href="/terms">Terms of Use</Link> and <Link className={linkClass} href="/disclaimer">Disclaimer</Link>.</p>
          </div>
        </div>
      </section>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto" aria-label="Workflow overview">
        {[
          { icon: Cpu, title: 'Runs in your browser', desc: 'Processing uses your device and browser resources.' },
          { icon: ShieldCheck, title: 'Local file workflow', desc: 'Selected files are not uploaded to Tooliyapa servers for processing.' },
          { icon: Download, title: 'Download and check', desc: 'Save the generated result, then verify it before use.' },
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="text-center p-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
