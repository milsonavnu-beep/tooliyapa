'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Upload, FileText, X, Download, Type, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

export default function WatermarkTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState([35])
  const [angle, setAngle] = useState([45])
  const [size, setSize] = useState([72])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted) => { if (accepted[0]) { setFile(accepted[0]); setResult(null) } }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleApply = async () => {
    if (!file) return
    if (!text.trim()) return toast.error('Enter watermark text.')
    setProcessing(true); setResult(null)
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
      const font = await pdf.embedFont(StandardFonts.HelveticaBold)
      pdf.getPages().forEach((page) => {
        const { width, height } = page.getSize()
        const tw = font.widthOfTextAtSize(text, size[0])
        const x = width / 2 - tw / 2
        const y = height / 2 - size[0] / 2
        page.drawText(text, {
          x, y, size: size[0], font,
          color: rgb(0.85, 0.1, 0.1),
          opacity: opacity[0] / 100,
          rotate: degrees(angle[0]),
        })
      })
      const bytes = await pdf.save()
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success('Watermark added!')
    } catch (e) { console.error(e); toast.error('Failed to add watermark.') }
    finally { setProcessing(false) }
  }
  const reset = () => { setFile(null); setResult(null) }

  return (
    <ToolShell onBack={onBack} icon={Type} title="Watermark" accent="fuchsia" description="Add a text watermark to every page of your PDF.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white ${isDragActive ? 'border-fuchsia-500 bg-fuchsia-50' : 'border-gray-300 hover:border-fuchsia-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/60">
            <FileText className="w-5 h-5 text-fuchsia-600" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-500">{formatBytes(file.size)}</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {!result && (
            <div className="mt-5 space-y-4">
              <div><Label className="text-sm font-semibold">Watermark text</Label><Input value={text} onChange={(e) => setText(e.target.value)} className="mt-1" /></div>
              <div><Label className="text-sm">Opacity: {opacity[0]}%</Label><Slider value={opacity} onValueChange={setOpacity} min={5} max={100} step={5} className="mt-2" /></div>
              <div><Label className="text-sm">Rotation: {angle[0]}°</Label><Slider value={angle} onValueChange={setAngle} min={-90} max={90} step={5} className="mt-2" /></div>
              <div><Label className="text-sm">Size: {size[0]}pt</Label><Slider value={size} onValueChange={setSize} min={20} max={200} step={4} className="mt-2" /></div>
            </div>
          )}
          <div className="mt-5">
            {!result ? (
              <Button onClick={handleApply} disabled={processing} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white h-12">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying…</> : <><Type className="w-5 h-5 mr-2" /> Add watermark</>}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, '') + '-watermarked.pdf')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download</Button>
                <Button variant="outline" onClick={reset} className="h-12">Do another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
