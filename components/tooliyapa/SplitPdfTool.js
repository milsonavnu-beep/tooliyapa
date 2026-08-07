'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Upload, FileText, X, Download, Scissors, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

export default function SplitPdfTool() {
  const [file, setFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [thumbs, setThumbs] = useState([]) // [{idx, url}]
  const [selected, setSelected] = useState(new Set())
  const [mode, setMode] = useState('extract') // extract | every
  const [loadingThumbs, setLoadingThumbs] = useState(false)
  const [thumbProgress, setThumbProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected?.length) return toast.error('Only PDF files allowed.')
    const f = accepted[0]; if (!f) return
    setFile(f); setResult(null); setSelected(new Set()); setThumbs([]); setLoadingThumbs(true); setThumbProgress(0)
    try {
      const buf = await f.arrayBuffer()
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
      const total = pdf.getPageCount()
      setPageCount(total)
      // Render thumbnails using pdfjs
      const pdfjs = await import('pdfjs-dist/build/pdf.mjs')
      const { configurePdfJsWorker } = await import('@/lib/pdfjs-worker')
      configurePdfJsWorker(pdfjs)
      const doc = await pdfjs.getDocument({ data: buf }).promise
      const out = []
      for (let i = 1; i <= total; i++) {
        const p = await doc.getPage(i)
        const viewport = p.getViewport({ scale: 0.4 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        await p.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        out.push({ idx: i - 1, url: canvas.toDataURL('image/jpeg', 0.7) })
        setThumbs([...out])
        setThumbProgress(Math.round((i / total) * 100))
      }
    } catch (e) { console.error(e); toast.error('Cannot read PDF.') }
    finally { setLoadingThumbs(false) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false, disabled: !!file })

  const toggle = (i) => setSelected((prev) => {
    const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n
  })
  const selectAll = () => setSelected(new Set(thumbs.map((t) => t.idx)))
  const selectNone = () => setSelected(new Set())

  const handleSplit = async () => {
    if (!file) return
    if (mode === 'extract' && selected.size === 0) return toast.error('Click pages to select them.')
    setProcessing(true); setProgress(10); setResult(null)
    try {
      const buf = await file.arrayBuffer()
      const src = await PDFDocument.load(buf, { ignoreEncryption: true })
      setProgress(40)
      if (mode === 'extract') {
        const indices = Array.from(selected).sort((a, b) => a - b)
        const out = await PDFDocument.create()
        const pages = await out.copyPages(src, indices)
        pages.forEach((p) => out.addPage(p))
        const bytes = await out.save()
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const name = `${file.name.replace(/\.pdf$/i, '')}-pages-${indices[0] + 1}-${indices[indices.length - 1] + 1}.pdf`
        setResult({ type: 'single', blob, name })
        setProgress(100); toast.success(`Extracted ${indices.length} page${indices.length !== 1 ? 's' : ''}!`)
      } else {
        const blobs = []
        for (let i = 0; i < pageCount; i++) {
          const out = await PDFDocument.create()
          const [page] = await out.copyPages(src, [i])
          out.addPage(page)
          const bytes = await out.save()
          blobs.push({ blob: new Blob([bytes], { type: 'application/pdf' }), name: `${file.name.replace(/\.pdf$/i, '')}-page-${i + 1}.pdf` })
          setProgress(Math.round(((i + 1) / pageCount) * 100))
        }
        setResult({ type: 'multi', blobs })
        toast.success(`Split into ${blobs.length} files!`)
      }
    } catch (e) { console.error(e); toast.error('Split failed.') }
    finally { setProcessing(false) }
  }
  const reset = () => { setFile(null); setResult(null); setProgress(0); setPageCount(0); setThumbs([]); setSelected(new Set()) }

  return (
    <ToolShell icon={Scissors} title="Split PDF" accent="amber" description="Click pages to extract them, or split every page into its own file.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white dark:bg-gray-900 ${isDragActive ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'border-gray-300 dark:border-gray-700 hover:border-amber-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700 dark:text-gray-200">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60">
            <FileText className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)} · {pageCount} pages</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset} aria-label="Remove file"><X className="w-4 h-4" aria-hidden="true" /></Button>
          </div>
          {loadingThumbs && (<div className="mt-5"><Progress value={thumbProgress} className="h-2" /><p className="text-xs text-gray-500 mt-2 text-center">Loading thumbnails… {thumbProgress}%</p></div>)}
          {!result && (
            <div className="mt-5">
              <RadioGroup value={mode} onValueChange={setMode} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {[{v:'extract',l:'Extract pages',d:'Click thumbnails to select'},{v:'every',l:'Split every page',d:'One PDF per page'}].map((o) => (
                  <label key={o.v} htmlFor={`m-${o.v}`} className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer ${mode === o.v ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'border-gray-200 dark:border-gray-700'}`}>
                    <RadioGroupItem value={o.v} id={`m-${o.v}`} className="mt-0.5" />
                    <div><Label htmlFor={`m-${o.v}`} className="font-medium cursor-pointer">{o.l}</Label><p className="text-xs text-gray-500 dark:text-gray-400">{o.d}</p></div>
                  </label>
                ))}
              </RadioGroup>
              {mode === 'extract' && thumbs.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">{selected.size} of {thumbs.length} pages selected</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectAll}>Select all</Button>
                      <Button variant="outline" size="sm" onClick={selectNone}>Clear</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-[480px] overflow-auto p-1">
                    {thumbs.map((t) => {
                      const isSel = selected.has(t.idx)
                      return (
                        <button key={t.idx} onClick={() => toggle(t.idx)}
                          className={`relative rounded-lg overflow-hidden border-2 transition ${isSel ? 'border-amber-500 ring-2 ring-amber-300' : 'border-gray-200 dark:border-gray-700 hover:border-amber-400'}`}>
                          <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                            <img src={t.url} alt={`Page ${t.idx + 1}`} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">{t.idx + 1}</div>
                          {isSel && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}
          {processing && (<div className="mt-5"><Progress value={progress} className="h-2" /><p className="text-xs text-gray-500 mt-2 text-center">Splitting… {progress}%</p></div>)}
          <div className="mt-5">
            {!result ? (
              <Button onClick={handleSplit} disabled={processing || loadingThumbs} className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-base">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Splitting…</> : <><Scissors className="w-5 h-5 mr-2" /> {mode === 'extract' ? `Extract ${selected.size} page${selected.size !== 1 ? 's' : ''}` : `Split ${pageCount} pages into separate files`}</>}
              </Button>
            ) : result.type === 'single' ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result.blob, result.name)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download</Button>
                <Button variant="outline" onClick={reset} className="h-12">Split another</Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-auto">
                {result.blobs.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="flex-1 text-sm truncate">{b.name}</span>
                    <Button size="sm" onClick={() => downloadBlob(b.blob, b.name)}><Download className="w-3 h-3 mr-1" />Download</Button>
                  </div>
                ))}
                <Button variant="outline" onClick={reset} className="w-full mt-2">Split another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
