'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import {
  Combine, Minimize2, Scissors, RotateCw, Image as ImageIcon, FileImage,
  Hash, Type, Layers, Unlock, ShieldCheck, Cpu, Download, ArrowRight,
  LayoutGrid, Zap,
} from 'lucide-react'
import ToolSearch from '@/components/tooliyapa/ToolSearch'

const TOOLS = [
  { href: '/merge-pdf', title: 'Merge PDF', desc: 'Combine PDFs in your chosen whole-file order.', icon: Combine, iconBg: 'bg-teal-50 dark:bg-teal-950/30', iconColor: 'text-teal-700 dark:text-teal-400' },
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

const linkClass = 'font-medium text-teal-700 underline decoration-teal-200 underline-offset-4 transition hover:text-teal-800 hover:decoration-teal-500 dark:text-teal-400 dark:decoration-teal-900 dark:hover:text-teal-300'

export default function HomePage() {
  return (
    <div>
      <section className="relative isolate border-b border-slate-100 bg-[#fdfdfb] dark:border-slate-800 dark:bg-slate-950" aria-labelledby="homepage-heading">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-12 h-96 w-96 rounded-full bg-cyan-100/45 blur-3xl dark:bg-teal-950/30" />
          <div className="absolute -right-36 bottom-0 h-[28rem] w-[28rem] rounded-full bg-teal-100/40 blur-3xl dark:bg-teal-950/30" />
        </div>
        <div className="mx-auto grid max-w-[1360px] items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/90 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:border-teal-900 dark:bg-teal-950/50 dark:text-teal-300">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" /> Simple tools. Real productivity.
            </div>
            <h1 id="homepage-heading" className="text-[2.55rem] font-bold leading-[1.08] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-5xl lg:text-[3.55rem] xl:text-[4rem]">
              Everyday tools for <span className="text-teal-700 dark:text-teal-400">documents, calculations,</span> and productivity.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">Tooliyapa brings together PDF tools, calculators, Word/Excel tools, converters, and text utilities in one fast, browser-based workspace.</p>
            <div className="mt-7 max-w-xl">
              <ToolSearch />
              <p className="mt-2 pl-1 text-xs text-slate-500 dark:text-slate-400">Try “merge PDF” or “calculator” — search currently shows available PDF tools.</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="#tools" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-teal-300">Explore all tools <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link href="#tools" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:border-teal-700"><LayoutGrid className="h-4 w-4" aria-hidden="true" /> Browse categories</Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[650px] lg:max-w-none">
            <Image src="/branding/tooliyapa_hero_tools.png" alt="Tooliyapa toolbox with document, calculator, text, spreadsheet, and converter tools" width={1448} height={1086} className="h-auto w-full object-contain" sizes="(max-width: 1023px) 92vw, 46vw" priority />
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {[
                { icon: Cpu, title: 'Runs in your browser', desc: 'No installation needed' },
                { icon: Zap, title: 'Fast and simple', desc: 'Save time, get more done' },
                { icon: ShieldCheck, title: 'Privacy-first workflow', desc: 'Selected files stay on your device during processing' },
              ].map((item) => {
                const Icon = item.icon
                return <div key={item.title} className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-white/90 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/90"><span className="mt-0.5 rounded-lg bg-teal-50 p-1.5 text-teal-700 dark:bg-teal-950 dark:text-teal-300"><Icon className="h-4 w-4" aria-hidden="true" /></span><span><strong className="block text-xs font-semibold text-slate-900 dark:text-white">{item.title}</strong><span className="mt-0.5 block text-[11px] leading-4 text-slate-500 dark:text-slate-400">{item.desc}</span></span></div>
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 sm:py-16">
      <section id="tools" className="scroll-mt-24" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="sr-only">Choose a PDF tool</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href} aria-label={`${tool.title}: ${tool.desc}`}>
              <Card className="group cursor-pointer p-5 border border-gray-200 dark:border-gray-800 hover:border-teal-300 dark:hover:border-teal-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white dark:bg-gray-900 h-full">
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

      <section className="mt-16 max-w-6xl mx-auto rounded-2xl border border-teal-100 bg-teal-50/70 p-6 sm:p-8 dark:border-teal-950 dark:bg-teal-950/20" aria-labelledby="processing-heading">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <Cpu className="h-8 w-8 text-teal-700 dark:text-teal-400" aria-hidden="true" />
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
            <article key={item.title} className="border-l-2 border-teal-200 pl-4 dark:border-teal-900">
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
    </div>
  )
}
