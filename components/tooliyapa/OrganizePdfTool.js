'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, X, Download, Layers, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob, parsePageRanges } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

export default function OrganizePdfTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [keep, setKeep] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback(async (accepted) => {
    const f = accepted[0]; if (!f) return
    try {
      const pdf = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true })
      setFile(f); setPageCount(pdf.getPageCount()); setKeep(`1-${pdf.getPageCount()}`); setResult(null)
    } catch { toast.error('Cannot read PDF.') }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleApply = async () => {
    if (!file) return
    const indices = parsePageRanges(keep, pageCount)
    if (!indices.length) return toast.error('Enter at least one valid page.')
    setProcessing(true); setResult(null)
    try {
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, indices)
      pages.forEach((p) => out.addPage(p))
      const bytes = await out.save()
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success(`Saved ${indices.length} pages.`)
    } catch (e) { console.error(e); toast.error('Failed to organize.') }
    finally { setProcessing(false) }
  }
  const reset = () => { setFile(null); setResult(null); setPageCount(0) }

  return (
    <ToolShell onBack={onBack} icon={Layers} title="Organize PDF" accent="violet" description="Reorder or delete pages by listing the pages you want to keep, in order.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white ${isDragActive ? 'border-violet-500 bg-violet-50' : 'border-gray-300 hover:border-violet-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/60">
            <FileText className="w-5 h-5 text-violet-600" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-500">{formatBytes(file.size)} · {pageCount} pages</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {!result && (
            <div className="mt-5">
              <Label className="text-sm font-semibold">Pages to keep (in this order)</Label>
              <Input value={keep} onChange={(e) => setKeep(e.target.value)} placeholder="e.g. 3, 1, 2, 5-7" className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">Tip: list pages in any order — e.g. <code>5,1-3,2</code> rearranges them.</p>
            </div>
          )}
          <div className="mt-5">
            {!result ? (
              <Button onClick={handleApply} disabled={processing} className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Layers className="w-5 h-5 mr-2" /> Apply changes</>}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, '') + '-organized.pdf')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download</Button>
                <Button variant="outline" onClick={reset} className="h-12">Do another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
