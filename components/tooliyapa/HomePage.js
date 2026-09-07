'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import {
  Combine, Minimize2, Scissors, RotateCw, Image as ImageIcon, FileImage,
  Hash, Type, Layers, Unlock, ShieldCheck, Cpu, Download, ArrowRight,
  LayoutGrid, Zap, FileText, Calculator, Files, ArrowLeftRight,
} from 'lucide-react'
import ToolSearch from '@/components/tooliyapa/ToolSearch'
import { PDF_TOOLS } from '@/lib/tools'

const TOOL_PRESENTATION = {
  '/merge-pdf': { desc: 'Combine PDFs in your chosen whole-file order.', icon: Combine, iconBg: 'bg-teal-50 dark:bg-teal-950/30', iconColor: 'text-teal-700 dark:text-teal-400' },
  '/split-pdf': { desc: 'Extract thumbnail-selected pages or make one PDF per page.', icon: Scissors, iconBg: 'bg-amber-50 dark:bg-amber-950/40', iconColor: 'text-amber-600' },
  '/compress-pdf': { desc: 'Optimize PDF structure losslessly without recompressing images.', icon: Minimize2, iconBg: 'bg-emerald-50 dark:bg-emerald-950/40', iconColor: 'text-emerald-600' },
  '/rotate-pdf': { desc: 'Rotate every page or specified page numbers and ranges.', icon: RotateCw, iconBg: 'bg-blue-50 dark:bg-blue-950/40', iconColor: 'text-blue-600' },
  '/organize-pdf': { desc: 'Reorder, remove, and rotate individual pages.', icon: Layers, iconBg: 'bg-violet-50 dark:bg-violet-950/40', iconColor: 'text-violet-600' },
  '/jpg-to-pdf': { desc: 'Arrange JPG, JPEG, or PNG images into one PDF.', icon: FileImage, iconBg: 'bg-pink-50 dark:bg-pink-950/40', iconColor: 'text-pink-600' },
  '/pdf-to-jpg': { desc: 'Render every PDF page as a separate JPG image.', icon: ImageIcon, iconBg: 'bg-orange-50 dark:bg-orange-950/40', iconColor: 'text-orange-600' },
  '/page-numbers': { desc: 'Number every page in a choice of header or footer positions.', icon: Hash, iconBg: 'bg-cyan-50 dark:bg-cyan-950/40', iconColor: 'text-cyan-600' },
  '/watermark': { desc: 'Add the same customizable text watermark to every page.', icon: Type, iconBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/40', iconColor: 'text-fuchsia-600' },
  '/unlock-pdf': { desc: 'Attempt to remove owner permissions from an already readable PDF.', icon: Unlock, iconBg: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-700 dark:text-slate-300' },
}

const TOOLS = PDF_TOOLS.map((tool) => ({ ...tool, ...TOOL_PRESENTATION[tool.href] }))
const FEATURED_TOOL_HREFS = ['/merge-pdf', '/compress-pdf', '/organize-pdf', '/jpg-to-pdf', '/pdf-to-jpg', '/split-pdf']
const FEATURED_TOOLS = FEATURED_TOOL_HREFS.map((href) => TOOLS.find((tool) => tool.href === href)).filter(Boolean)
const MORE_TOOLS = TOOLS.filter((tool) => !FEATURED_TOOL_HREFS.includes(tool.href))

const FUTURE_CATEGORIES = [
  { title: 'Calculators', desc: 'Everyday finance, math, and planning calculators.', icon: Calculator, iconBg: 'bg-amber-50 dark:bg-amber-950/35', iconColor: 'text-amber-600 dark:text-amber-400' },
  { title: 'Documents', desc: 'Practical tools for common document workflows.', icon: Files, iconBg: 'bg-blue-50 dark:bg-blue-950/35', iconColor: 'text-blue-600 dark:text-blue-400' },
  { title: 'Text', desc: 'Focused utilities for writing and text cleanup.', icon: Type, iconBg: 'bg-violet-50 dark:bg-violet-950/35', iconColor: 'text-violet-600 dark:text-violet-400' },
  { title: 'Converters', desc: 'Quick conversions for files, values, and formats.', icon: ArrowLeftRight, iconBg: 'bg-cyan-50 dark:bg-cyan-950/35', iconColor: 'text-cyan-600 dark:text-cyan-400' },
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
      <section id="tools" className="scroll-mt-24" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Tool discovery</p>
            <h2 id="categories-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Browse by category</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Start with the PDF tools available today. More Tooliyapa categories will appear here as they become ready to use.</p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Link href="#pdf-tools" className="group rounded-2xl border border-rose-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-rose-950 dark:bg-slate-900 dark:hover:border-rose-800" aria-label={`PDF Tools, ${PDF_TOOLS.length} tools available`}>
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-xl bg-rose-50 p-2.5 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"><FileText className="h-5 w-5" aria-hidden="true" /></span>
                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">Available now</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">PDF Tools</h3>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">Merge, split, compress, organize, convert and prepare PDFs.</p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{PDF_TOOLS.length} tools available</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>

            {FUTURE_CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.title} aria-disabled="true" className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`rounded-xl p-2.5 ${category.iconBg} ${category.iconColor}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">Coming soon</span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">{category.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{category.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="pdf-tools" className="mx-auto mt-14 max-w-6xl scroll-mt-24" aria-labelledby="featured-tools-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Available now</p>
            <h2 id="featured-tools-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Featured PDF tools</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Quick access to common PDF tasks, with every current Tooliyapa PDF tool still available below.</p>
          </div>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{PDF_TOOLS.length} tools available</span>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED_TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.href} href={tool.href} aria-label={`${tool.title}: ${tool.desc}`} className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded-2xl">
                <Card className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-teal-300 group-hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:group-hover:border-teal-800">
                  <div className="flex items-start gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tool.iconBg}`}><Icon className={`h-5 w-5 ${tool.iconColor}`} aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{tool.title}</h3>
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-700 dark:group-hover:text-teal-400" aria-hidden="true" />
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-400">{tool.desc}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-9 flex items-center gap-4">
          <h3 className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">More PDF tools</h3>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MORE_TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link key={tool.href} href={tool.href} aria-label={`${tool.title}: ${tool.desc}`} className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-800">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tool.iconBg}`}><Icon className={`h-4 w-4 ${tool.iconColor}`} aria-hidden="true" /></span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{tool.title}</h4>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-slate-400">{tool.desc}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl border-t border-slate-200 pt-16 dark:border-slate-800 sm:mt-24" aria-labelledby="possibilities-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">PDF workflows</p>
          <h2 id="possibilities-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">What you can do with Tooliyapa</h2>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">Start with the outcome you need. Each tool has a focused workflow, so you can move between tools when a document needs more than one change.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400"><Combine className="h-4 w-4" aria-hidden="true" /> Page management</span>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">Combine and organize</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400"><Link className={linkClass} href="/merge-pdf">Merge PDF</Link> joins separate documents in whole-file order. <Link className={linkClass} href="/split-pdf">Split PDF</Link> extracts thumbnail-selected pages or creates separate one-page files. For changes inside one document, <Link className={linkClass} href="/organize-pdf">Organize PDF</Link> reorders, removes, and rotates individual pages, while <Link className={linkClass} href="/rotate-pdf">Rotate PDF</Link> applies an angle to all or specified pages.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400"><FileImage className="h-4 w-4" aria-hidden="true" /> Conversion</span>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">Convert documents and images</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400"><Link className={linkClass} href="/jpg-to-pdf">JPG to PDF</Link> places JPG, JPEG, or PNG images into one PDF, with move controls setting their order. <Link className={linkClass} href="/pdf-to-jpg">PDF to JPG</Link> takes the opposite path by rendering every page as its own JPG.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400"><FileText className="h-4 w-4" aria-hidden="true" /> Finishing</span>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">Prepare a finished PDF</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Try <Link className={linkClass} href="/compress-pdf">Compress PDF</Link> for lossless structural optimization, <Link className={linkClass} href="/page-numbers">Page Numbers</Link> for consistent numbering on every page, or <Link className={linkClass} href="/watermark">Text Watermark</Link> for one visible text label across the document.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400"><Unlock className="h-4 w-4" aria-hidden="true" /> Permissions</span>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">Work with owner permissions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400"><Link className={linkClass} href="/unlock-pdf">Remove PDF Restrictions</Link> can attempt to rewrite an already readable PDF without supported owner-permission restrictions. It does not guess passwords, crack encryption, or decrypt a file that requires a password to open.</p>
          </article>
        </div>
      </section>

      <section className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-3xl border border-teal-200/70 bg-teal-50/70 p-6 shadow-sm dark:border-teal-900/70 dark:bg-teal-950/20 sm:p-9" aria-labelledby="processing-heading">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/60 blur-3xl dark:bg-teal-900/10" />
        <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
          <div>
            <span className="inline-flex rounded-xl border border-teal-200 bg-white p-3 text-teal-700 shadow-sm dark:border-teal-900 dark:bg-slate-900 dark:text-teal-400"><ShieldCheck className="h-6 w-6" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">PDF processing &amp; privacy</p>
            <h2 id="processing-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">How browser-based processing works</h2>
          </div>
          <div className="divide-y divide-teal-200/70 text-sm leading-6 text-slate-700 dark:divide-teal-900/60 dark:text-slate-300">
            <p className="pb-4">Selected PDF files for these tool workflows are processed by code running in your browser. The selected PDF files themselves are not uploaded to Tooliyapa servers as part of the PDF-processing workflow. When processing finishes, you download the generated result from the browser.</p>
            <p className="py-4">Speed and capacity depend on the file&apos;s size and complexity as well as your device, available memory, and browser. A large scan or a PDF with complex pages can take longer or fail where a smaller document succeeds.</p>
            <p className="pt-4">Ordinary website services and third-party scripts are separate from PDF-file processing. Read the <Link className={linkClass} href="/privacy">Privacy Policy</Link> for more information about website data and service providers.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl" aria-labelledby="choose-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Quick comparisons</p>
          <h2 id="choose-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Choose the right PDF tool</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Similar tasks can need different workflows. These distinctions help you choose without guessing.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Merge or organize?', desc: 'Merge combines separate PDFs in whole-file order. Organize changes the pages within one PDF, using thumbnails to reorder, remove, or rotate them.' },
            { title: 'Split or organize?', desc: 'Split creates one combined extraction from selected thumbnails or a separate PDF for each page. Organize produces one PDF after page-level edits.' },
            { title: 'Rotate or organize?', desc: 'Rotate applies one chosen angle to every page or to page numbers and ranges you specify. Organize is better when you want thumbnails and different rotations for individual pages.' },
            { title: 'What does compression change?', desc: 'Compress rewrites PDF structure losslessly and does not resize or recompress embedded images. An already optimized or image-heavy file may not become smaller.' },
            { title: 'What does a watermark do?', desc: 'Watermark adds visible text to every page. That marking is not document encryption, access control, DRM, or proof of ownership.' },
            { title: 'Which restrictions are supported?', desc: 'Restriction removal is an attempt for authorized, already readable PDFs with owner permissions. It is not open-password decryption, and results depend on the file.' },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition-colors hover:border-teal-200 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-teal-900">
              <div className="mb-4 h-1 w-8 rounded-full bg-teal-600" aria-hidden="true" />
              <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl rounded-3xl border border-slate-200 bg-[#fdfdfb] p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-9" aria-labelledby="trust-heading">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-400">Before you finish</p>
            <h2 id="trust-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Practical tools, clear expectations</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Tooliyapa provides browser-based PDF utilities, and no account is currently required to use them.</p>
          </div>
          <div className="space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <p>Keep your source file and check every downloaded result before sharing it or relying on it. Unusual, damaged, encrypted, or very large documents may fail, and specialized PDF features may not always survive a rewrite exactly.</p>
            <p>Learn more <Link className={linkClass} href="/about">about Tooliyapa</Link>, review the <Link className={linkClass} href="/privacy">Privacy Policy</Link>, or <Link className={linkClass} href="/contact">contact us</Link>. Use of the site is also covered by the <Link className={linkClass} href="/terms">Terms of Use</Link> and <Link className={linkClass} href="/disclaimer">Disclaimer</Link>.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-6 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Workflow overview">
        {[
          { icon: Cpu, title: 'Runs in your browser', desc: 'Processing uses your device and browser resources.' },
          { icon: ShieldCheck, title: 'Local file workflow', desc: 'Selected PDF files are not uploaded to Tooliyapa servers for PDF processing.' },
          { icon: Download, title: 'Download and check', desc: 'Save the generated result, then verify it before use.' },
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div><h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-400">{f.desc}</p></div>
            </div>
          )
        })}
      </div>
      </div>
    </div>
  )
}
