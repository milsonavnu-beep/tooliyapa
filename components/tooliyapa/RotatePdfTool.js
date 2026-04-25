'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument, degrees } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, FileText, X, Download, RotateCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob, parsePageRanges } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

export default function RotatePdfTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [pageCount, setPageCount] = useState(0)
  const [angle, setAngle] = useState('90')
  const [scope, setScope] = useState('all') // all | range
  const [ranges, setRanges] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback(async (accepted) => {
    const f = accepted[0]; if (!f) return
    try {
      const pdf = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true })
      setFile(f); setPageCount(pdf.getPageCount()); setResult(null); setRanges(`1-${pdf.getPageCount()}`)
    } catch { toast.error('Cannot read PDF.') }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleRotate = async () => {
    if (!file) return
    setProcessing(true); setResult(null)
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
      const target = scope === 'all' ? pdf.getPageIndices() : parsePageRanges(ranges, pageCount)
      if (!target.length) { setProcessing(false); return toast.error('No pages selected.') }
      const a = parseInt(angle, 10)
      target.forEach((i) => {
        const page = pdf.getPage(i)
        const cur = page.getRotation().angle || 0
        page.setRotation(degrees((cur + a) % 360))
      })
      const bytes = await pdf.save()
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success('Pages rotated!')
    } catch (e) { console.error(e); toast.error('Rotate failed.') }
    finally { setProcessing(false) }
  }

  const reset = () => { setFile(null); setResult(null); setPageCount(0) }

  return (
    <ToolShell onBack={onBack} icon={RotateCw} title="Rotate PDF" accent="blue" description="Rotate all or selected pages of a PDF.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/60">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-500">{formatBytes(file.size)} · {pageCount} pages</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {!result && (
            <div className="mt-5 space-y-4">
              <div>
                <Label className="text-sm font-semibold">Angle</Label>
                <RadioGroup value={angle} onValueChange={setAngle} className="grid grid-cols-3 gap-2 mt-2">
                  {['90','180','270'].map((a) => (
                    <label key={a} htmlFor={`a-${a}`} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer justify-center ${angle === a ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <RadioGroupItem value={a} id={`a-${a}`} /><span>{a}°</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-sm font-semibold">Apply to</Label>
                <RadioGroup value={scope} onValueChange={setScope} className="grid grid-cols-2 gap-2 mt-2">
                  {[{v:'all',l:'All pages'},{v:'range',l:'Specific pages'}].map((o) => (
                    <label key={o.v} htmlFor={`s-${o.v}`} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${scope === o.v ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                      <RadioGroupItem value={o.v} id={`s-${o.v}`} /><span>{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
                {scope === 'range' && <Input value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5" className="mt-2" />}
              </div>
            </div>
          )}
          <div className="mt-5">
            {!result ? (
              <Button onClick={handleRotate} disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rotating…</> : <><RotateCw className="w-5 h-5 mr-2" /> Rotate PDF</>}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, '') + '-rotated.pdf')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download</Button>
                <Button variant="outline" onClick={reset} className="h-12">Rotate another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
