'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, FileText, X, Download, Scissors, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob, parsePageRanges } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

export default function SplitPdfTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [mode, setMode] = useState('extract') // extract | every
  const [ranges, setRanges] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected?.length) return toast.error('Only PDF files allowed.')
    const f = accepted[0]; if (!f) return
    try {
      const buf = await f.arrayBuffer()
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
      setFile(f); setPageCount(pdf.getPageCount()); setResult(null)
      setRanges(`1-${pdf.getPageCount()}`)
    } catch { toast.error('Cannot read PDF.') }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleSplit = async () => {
    if (!file) return
    setProcessing(true); setProgress(10); setResult(null)
    try {
      const buf = await file.arrayBuffer()
      const src = await PDFDocument.load(buf, { ignoreEncryption: true })
      setProgress(40)
      if (mode === 'extract') {
        const indices = parsePageRanges(ranges, pageCount)
        if (!indices.length) { setProcessing(false); return toast.error('Invalid page ranges.') }
        const out = await PDFDocument.create()
        const pages = await out.copyPages(src, indices)
        pages.forEach((p) => out.addPage(p))
        const bytes = await out.save()
        const blob = new Blob([bytes], { type: 'application/pdf' })
        setResult({ type: 'single', blob, name: file.name.replace(/\.pdf$/i, '') + `-pages-${indices[0] + 1}-${indices[indices.length - 1] + 1}.pdf` })
        setProgress(100); toast.success('Pages extracted!')
      } else {
        // split every page into separate PDF
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

  const reset = () => { setFile(null); setResult(null); setProgress(0); setPageCount(0) }

  return (
    <ToolShell onBack={onBack} icon={Scissors} title="Split PDF" accent="amber" description="Extract specific pages or split every page into its own file.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-white ${isDragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/40'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/60">
            <FileText className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{file.name}</p><p className="text-xs text-gray-500">{formatBytes(file.size)} · {pageCount} pages</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {!result && (
            <div className="mt-5 space-y-4">
              <RadioGroup value={mode} onValueChange={setMode} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[{v:'extract',l:'Extract pages',d:'Specify ranges'},{v:'every',l:'Split every page',d:'One PDF per page'}].map((o) => (
                  <label key={o.v} htmlFor={`m-${o.v}`} className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer ${mode === o.v ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}>
                    <RadioGroupItem value={o.v} id={`m-${o.v}`} className="mt-0.5" />
                    <div><Label htmlFor={`m-${o.v}`} className="font-medium cursor-pointer">{o.l}</Label><p className="text-xs text-gray-500">{o.d}</p></div>
                  </label>
                ))}
              </RadioGroup>
              {mode === 'extract' && (
                <div>
                  <Label className="text-sm">Page ranges (e.g. 1-3, 5, 8-10)</Label>
                  <Input value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5, 8-10" className="mt-1" />
                </div>
              )}
            </div>
          )}
          {processing && (<div className="mt-5"><Progress value={progress} className="h-2" /><p className="text-xs text-gray-500 mt-2 text-center">Splitting… {progress}%</p></div>)}
          <div className="mt-5">
            {!result ? (
              <Button onClick={handleSplit} disabled={processing} className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-base">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Splitting…</> : <><Scissors className="w-5 h-5 mr-2" /> Split PDF</>}
              </Button>
            ) : result.type === 'single' ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result.blob, result.name)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download</Button>
                <Button variant="outline" onClick={reset} className="h-12">Split another</Button>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-auto">
                {result.blobs.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-gray-200">
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
