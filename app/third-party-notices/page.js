import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata({
  title: 'Third-Party Notices',
  description: 'Open-source license notices and attribution for third-party software and reference implementations used by Tooliyapa.',
  pathname: '/third-party-notices',
})

const MIT_TEXT = `MIT License\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`

const PROJECTS = [
  { name: 'CalcSuite', upstream: 'CalcSuite by Kazi Tajkir Hossen', copyright: 'Copyright (c) 2026 Kazi Tajkir Hossen' },
  { name: 'WordConvert', upstream: 'erikvullings/word-convert', copyright: 'Copyright (c) 2026 Erik Vullings' },
  { name: 'MD2DOCX', upstream: 'Kyotu-Technology/md2docx', copyright: 'Copyright (c) 2025 KYOTU Technology' },
  { name: 'Paper Tools', upstream: 'jisung-02/paper-tools', copyright: 'Copyright (c) 2026 Jisung Chae' },
]

export default function Page() {
  return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6"><h1 className="text-3xl font-bold text-slate-900 dark:text-white">Third-Party Notices</h1><p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Tooliyapa contains independently written implementations that were informed by, compared against, or selectively adapted from permissively licensed open-source projects. Where code or substantial portions are reused or adapted, the applicable copyright and license notice is preserved here.</p><div className="mt-10 space-y-6">{PROJECTS.map((project)=><section key={project.name} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><h2 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Upstream project: {project.upstream}</p><p className="mt-3 text-slate-600 dark:text-slate-300">{project.copyright}</p><pre className="mt-5 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">{MIT_TEXT}</pre></section>)}</div></main>
}
