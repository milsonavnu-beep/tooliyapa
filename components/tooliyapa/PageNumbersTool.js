'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, FileText, X, Download, Hash, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

export default function PageNumbersTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [position, setPosition] = useState('bottom-center')
  const [format, setFormat] = useState('n')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted) => { if (accepted[0]) { setFile(accepted[0]); setResult(null) } }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleApply = async () => {
    if (!file) return
    setProcessing(true); setResult(null)
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
      const font = await pdf.embedFont(StandardFonts.Helvetica)
      const total = pdf.getPageCount()
      pdf.getPages().forEach((page, idx) => {
        const n = idx + 1
        const text = format === 'n' ? `${n}` : format === 'n_total' ? `${n} / ${total}` : `Page ${n}`
        const size = 11
        const tw = font.widthOfTextAtSize(text, size)
        const { width, height } = page.getSize()
        const margin = 28
        let x = width / 2 - tw / 2, y = margin
        if (position.endsWith('left')) x = margin
        else if (position.endsWith('right')) x = width - margin - tw
        if (position.startsWith('top')) y = height - margin
        page.drawText(text, { x, y, size, font, color: rgb(0.2, 0.2, 0.2) })
      })
      const bytes = await pdf.save()
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success('Page numbers added!')
    } catch (e) { console.error(e); toast.error('Failed to add page numbers.') }
    finally { setProcessing(false) }
  }
  const reset = () => { setFile(null); setResult(null) }

  return (
    <ToolShell onBack={onBack} icon={Hash} title="Page Numbers" accent="cyan" description="Add page numbers to your PDF in any position.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white ${isDragActive ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 hover:border-cyan-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/60">
            <FileText className="w-5 h-5 text-cyan-600" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-500">{formatBytes(file.size)}</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {!result && (
            <div className="mt-5 space-y-4">
              <div><Label className="text-sm font-semibold">Position</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right'].map((p) => (
                    <button key={p} onClick={() => setPosition(p)} className={`p-2 rounded-lg border text-xs capitalize ${position === p ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300'}`}>{p.replace('-', ' ')}</button>
                  ))}
                </div>
              </div>
              <div><Label className="text-sm font-semibold">Format</Label>
                <RadioGroup value={format} onValueChange={setFormat} className="grid grid-cols-3 gap-2 mt-2">
                  {[{v:'n',l:'1, 2, 3'},{v:'n_total',l:'1 / N'},{v:'page_n',l:'Page 1'}].map((o) => (
                    <label key={o.v} htmlFor={`f-${o.v}`} className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer text-sm ${format === o.v ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'}`}>
                      <RadioGroupItem value={o.v} id={`f-${o.v}`} /><span>{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
          <div className="mt-5">
            {!result ? (
              <Button onClick={handleApply} disabled={processing} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-12">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding…</> : <><Hash className="w-5 h-5 mr-2" /> Add page numbers</>}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, '') + '-numbered.pdf')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download</Button>
                <Button variant="outline" onClick={reset} className="h-12">Do another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
