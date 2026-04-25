'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Upload, FileText, X, Download, Minimize2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

export default function CompressPdfTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [level, setLevel] = useState('recommended')

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected?.length) return toast.error('Only PDFs allowed.')
    if (accepted[0]) { setFile(accepted[0]); setResult(null) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false,
  })

  const handleCompress = async () => {
    if (!file) return
    setProcessing(true); setProgress(10); setResult(null)
    try {
      const buf = await file.arrayBuffer(); setProgress(30)
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true }); setProgress(60)
      if (level === 'extreme') {
        try { pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); pdf.setKeywords([]); pdf.setProducer(''); pdf.setCreator('') } catch {}
      }
      const bytes = await pdf.save({ useObjectStreams: level !== 'low', addDefaultPage: false })
      setProgress(95)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setResult({ blob, originalSize: file.size, newSize: blob.size })
      setProgress(100)
      if (blob.size >= file.size) toast.warning('Already well-optimized — minimal further compression.')
      else toast.success(`Compressed by ${Math.round((1 - blob.size / file.size) * 100)}%!`)
    } catch (e) { console.error(e); toast.error('Compress failed. File may be corrupt or password-protected.') }
    finally { setProcessing(false) }
  }

  const reductionPct = result ? Math.max(0, Math.round((1 - result.newSize / result.originalSize) * 100)) : 0
  const reset = () => { setFile(null); setResult(null); setProgress(0) }

  return (
    <ToolShell onBack={onBack} icon={Minimize2} title="Compress PDF" accent="emerald"
      description="Reduce PDF size right in your browser. No upload, no waiting.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-white ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/40'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF here, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/60">
            <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {!result && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Compression level</p>
              <RadioGroup value={level} onValueChange={setLevel} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[{v:'low',label:'Low',desc:'Best quality'},{v:'recommended',label:'Recommended',desc:'Balanced'},{v:'extreme',label:'Extreme',desc:'Smallest size'}].map((opt) => (
                  <label key={opt.v} htmlFor={`lv-${opt.v}`} className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition ${level === opt.v ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <RadioGroupItem value={opt.v} id={`lv-${opt.v}`} className="mt-0.5" />
                    <div><Label htmlFor={`lv-${opt.v}`} className="font-medium cursor-pointer">{opt.label}</Label><p className="text-xs text-gray-500">{opt.desc}</p></div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}
          {processing && (<div className="mt-5"><Progress value={progress} className="h-2" /><p className="text-xs text-gray-500 mt-2 text-center">Compressing… {progress}%</p></div>)}
          {result && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center"><p className="text-xs uppercase text-gray-500 font-medium">Original</p><p className="text-lg font-bold text-gray-900 mt-1">{formatBytes(result.originalSize)}</p></div>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center"><p className="text-xs uppercase text-emerald-700 font-medium">Compressed</p><p className="text-lg font-bold text-emerald-700 mt-1">{formatBytes(result.newSize)}</p>{reductionPct > 0 && <p className="text-xs text-emerald-700 mt-1 font-semibold">−{reductionPct}%</p>}</div>
            </div>
          )}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {!result ? (
              <Button onClick={handleCompress} disabled={processing} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Compressing…</> : <><Minimize2 className="w-5 h-5 mr-2" /> Compress PDF</>}
              </Button>
            ) : (
              <>
                <Button onClick={() => downloadBlob(result.blob, file.name.replace(/\.pdf$/i, '') + '-compressed.pdf')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base">
                  <Download className="w-5 h-5 mr-2" /> Download compressed PDF
                </Button>
                <Button variant="outline" onClick={reset} className="h-12">Compress another</Button>
              </>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
