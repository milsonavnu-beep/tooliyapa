'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X, Download, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

// Convert each PDF page to a JPG using pdfjs-dist (rendered onto a canvas)
export default function PdfToJpgTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [pages, setPages] = useState([]) // [{idx, blob, url}]

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected?.length) return toast.error('Only PDFs allowed.')
    if (accepted[0]) { setFile(accepted[0]); setPages([]) }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleConvert = async () => {
    if (!file) return
    setProcessing(true); setProgress(0); setPages([])
    try {
      // Lazy load pdfjs in the browser only
      const pdfjs = await import('pdfjs-dist/build/pdf.mjs')
      // Use the CDN worker that matches our installed pdfjs-dist version (4.0.379)
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

      const buf = await file.arrayBuffer()
      const doc = await pdfjs.getDocument({ data: buf }).promise
      const out = []
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        const ctx = canvas.getContext('2d')
        await page.render({ canvasContext: ctx, viewport }).promise
        const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.92))
        out.push({ idx: i, blob, url: URL.createObjectURL(blob) })
        setProgress(Math.round((i / doc.numPages) * 100))
      }
      setPages(out)
      toast.success(`Converted ${out.length} page${out.length !== 1 ? 's' : ''}!`)
    } catch (e) { console.error(e); toast.error('Conversion failed.') }
    finally { setProcessing(false) }
  }
  const reset = () => { pages.forEach((p) => URL.revokeObjectURL(p.url)); setFile(null); setPages([]); setProgress(0) }

  const downloadAll = () => {
    pages.forEach((p, i) => setTimeout(() => downloadBlob(p.blob, `${file.name.replace(/\.pdf$/i, '')}-page-${p.idx}.jpg`), i * 250))
  }

  return (
    <ToolShell onBack={onBack} icon={ImageIcon} title="PDF to JPG" accent="orange" description="Render each page of a PDF as a JPG image.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/60">
            <FileText className="w-5 h-5 text-orange-600" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-500">{formatBytes(file.size)}</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {processing && (<div className="mt-5"><Progress value={progress} className="h-2" /><p className="text-xs text-gray-500 mt-2 text-center">Rendering pages… {progress}%</p></div>)}
          {pages.length > 0 && (
            <div className="mt-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-auto">
                {pages.map((p) => (
                  <div key={p.idx} className="relative border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <img src={p.url} alt={`Page ${p.idx}`} className="w-full h-40 object-contain" />
                    <div className="flex items-center justify-between p-2 bg-gray-50 border-t">
                      <span className="text-xs font-medium">Page {p.idx}</span>
                      <Button size="sm" variant="outline" onClick={() => downloadBlob(p.blob, `${file.name.replace(/\.pdf$/i, '')}-page-${p.idx}.jpg`)}><Download className="w-3 h-3 mr-1" />JPG</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {!pages.length ? (
              <Button onClick={handleConvert} disabled={processing} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting…</> : <><ImageIcon className="w-5 h-5 mr-2" /> Convert to JPG</>}
              </Button>
            ) : (
              <>
                <Button onClick={downloadAll} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download all</Button>
                <Button variant="outline" onClick={reset} className="h-12">Convert another</Button>
              </>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
