'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Upload, X, Download, FileImage, Loader2, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import { embedImageFile } from '@/lib/image-embed'
import ToolShell from './ToolShell'

export default function JpgToPdfTool() {
  const [imgs, setImgs] = useState([])
  const [orientation, setOrientation] = useState('auto')
  const [size, setSize] = useState('a4')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected?.length) toast.error('Only JPG and PNG images are allowed.')
    const items = accepted.map((f) => ({ id: crypto.randomUUID(), file: f, url: URL.createObjectURL(f) }))
    setImgs((prev) => [...prev, ...items])
    setResult(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    multiple: true,
  })

  const move = (idx, dir) => setImgs((prev) => {
    const arr = [...prev]
    const t = idx + dir
    if (t < 0 || t >= arr.length) return arr
    ;[arr[idx], arr[t]] = [arr[t], arr[idx]]
    return arr
  })

  const remove = (id) => {
    setImgs((prev) => {
      const target = prev.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  const handleConvert = async () => {
    if (!imgs.length) return
    setProcessing(true)
    setProgress(0)
    setResult(null)
    try {
      const pdf = await PDFDocument.create()
      for (let i = 0; i < imgs.length; i++) {
        const f = imgs[i].file
        const img = await embedImageFile(pdf, f)
        let pw, ph
        if (size === 'fit') {
          pw = img.width
          ph = img.height
        } else {
          const A4 = [595.28, 841.89]
          const LT = [612, 792]
          let [w, h] = size === 'a4' ? A4 : LT
          const land = orientation === 'landscape' || (orientation === 'auto' && img.width > img.height)
          if (land) [w, h] = [h, w]
          pw = w
          ph = h
        }
        const page = pdf.addPage([pw, ph])
        const scale = Math.min(pw / img.width, ph / img.height)
        const dw = img.width * scale
        const dh = img.height * scale
        page.drawImage(img, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh })
        setProgress(Math.round(((i + 1) / imgs.length) * 100))
      }
      const bytes = await pdf.save()
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success('Images converted to PDF!')
    } catch (e) {
      console.error(e)
      toast.error('Conversion failed. Use a standard JPG or PNG image.')
    } finally {
      setProcessing(false)
    }
  }

  const reset = () => {
    imgs.forEach((i) => URL.revokeObjectURL(i.url))
    setImgs([])
    setResult(null)
    setProgress(0)
  }

  return (
    <ToolShell
      icon={FileImage}
      title="JPG to PDF"
      accent="pink"
      description="Convert JPG and PNG images to a single PDF in your browser. Files are not uploaded to Tooliyapa servers."
    >
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white dark:bg-gray-900 ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}`}
        aria-label="Upload JPG or PNG images"
      >
        <input {...getInputProps()} aria-label="Choose JPG or PNG images" />
        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
        <p className="font-semibold text-gray-700 dark:text-gray-200">
          {isDragActive ? 'Drop images…' : 'Drag & drop JPG/PNG images, or click to browse'}
        </p>
      </div>

      {imgs.length > 0 && (
        <Card className="mt-6 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{imgs.length} image{imgs.length !== 1 ? 's' : ''}</h3>
            <Button variant="ghost" size="sm" onClick={reset}>Clear</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imgs.map((im, idx) => (
              <div key={im.id} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt={`Preview ${idx + 1}: ${im.file.name}`} className="w-full h-32 object-cover" />
                <div className="absolute top-1 right-1 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => move(idx, -1)} disabled={idx === 0} aria-label={`Move image ${idx + 1} up`}>
                    <ArrowUp className="w-3 h-3" aria-hidden="true" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => move(idx, 1)} disabled={idx === imgs.length - 1} aria-label={`Move image ${idx + 1} down`}>
                    <ArrowDown className="w-3 h-3" aria-hidden="true" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => remove(im.id)} aria-label={`Remove image ${idx + 1}`}>
                    <X className="w-3 h-3" aria-hidden="true" />
                  </Button>
                </div>
                <p className="absolute bottom-1 left-1 right-1 text-[10px] text-white bg-black/60 px-1 py-0.5 rounded truncate">
                  {idx + 1}. {im.file.name}
                </p>
              </div>
            ))}
          </div>

          {!result && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold">Page size</Label>
                <RadioGroup value={size} onValueChange={setSize} className="mt-2 grid grid-cols-3 gap-2">
                  {[{ v: 'a4', l: 'A4' }, { v: 'letter', l: 'Letter' }, { v: 'fit', l: 'Fit image' }].map((o) => (
                    <label key={o.v} htmlFor={`sz-${o.v}`} className={`flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer text-sm ${size === o.v ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                      <RadioGroupItem value={o.v} id={`sz-${o.v}`} />
                      <span>{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-sm font-semibold">Orientation</Label>
                <RadioGroup value={orientation} onValueChange={setOrientation} className="mt-2 grid grid-cols-3 gap-2">
                  {[{ v: 'auto', l: 'Auto' }, { v: 'portrait', l: 'Portrait' }, { v: 'landscape', l: 'Landscape' }].map((o) => (
                    <label key={o.v} htmlFor={`or-${o.v}`} className={`flex items-center justify-center gap-1 p-2 rounded-lg border cursor-pointer text-sm ${orientation === o.v ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                      <RadioGroupItem value={o.v} id={`or-${o.v}`} />
                      <span>{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {processing && (
            <div className="mt-5">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2 text-center">Converting… {progress}%</p>
            </div>
          )}

          <div className="mt-5">
            {!result ? (
              <Button onClick={handleConvert} disabled={processing} className="w-full bg-pink-600 hover:bg-pink-700 text-white h-12">
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Converting…</>
                ) : (
                  <><FileImage className="w-5 h-5 mr-2" aria-hidden="true" /> Convert to PDF</>
                )}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => downloadBlob(result, `images-${Date.now()}.pdf`)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                >
                  <Download className="w-5 h-5 mr-2" aria-hidden="true" /> Download PDF
                </Button>
                <Button variant="outline" onClick={reset} className="h-12">Convert more</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
