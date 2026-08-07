'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Upload, FileText, X, Download, Minimize2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import { optimizePdfBytes } from '@/lib/pdf-ops'
import ToolShell from './ToolShell'

export default function CompressPdfTool() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [level, setLevel] = useState('standard')

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected?.length) return toast.error('Only PDFs allowed.')
    if (accepted[0]) {
      setFile(accepted[0])
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  })

  const handleCompress = async () => {
    if (!file) return
    setProcessing(true)
    setProgress(10)
    setResult(null)
    try {
      const buf = await file.arrayBuffer()
      setProgress(40)
      const bytes = await optimizePdfBytes(buf, level)
      setProgress(95)
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setResult({ blob, originalSize: file.size, newSize: blob.size })
      setProgress(100)
      if (blob.size >= file.size) {
        toast.warning('Already well-optimized — little or no further size reduction.')
      } else {
        toast.success(`Reduced by ${Math.round((1 - blob.size / file.size) * 100)}%!`)
      }
    } catch (e) {
      console.error(e)
      toast.error('Optimize failed. File may be corrupt or encrypted.')
    } finally {
      setProcessing(false)
    }
  }

  const reductionPct = result ? Math.max(0, Math.round((1 - result.newSize / result.originalSize) * 100)) : 0
  const reset = () => {
    setFile(null)
    setResult(null)
    setProgress(0)
  }

  return (
    <ToolShell
      icon={Minimize2}
      title="Compress PDF"
      accent="emerald"
      description="Lossless PDF optimization in your browser (object streams + optional metadata strip). Image-heavy PDFs may see little size reduction. Files are not uploaded to Tooliyapa servers."
    >
      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-white dark:bg-gray-900 ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/40'}`}
          aria-label="Upload a PDF to optimize"
        >
          <input {...getInputProps()} aria-label="Choose a PDF file" />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
          <p className="font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop here…' : 'Drag & drop a PDF here, or click to browse'}
          </p>
        </div>
      )}

      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/60 dark:bg-gray-800/60">
            <FileText className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset} aria-label="Remove file">
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            This tool performs <strong>lossless optimization</strong>. It does not re-encode embedded images.
            Already-compressed PDFs often stay the same size.
          </p>

          {!result && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Optimization level</p>
              <RadioGroup value={level} onValueChange={setLevel} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { v: 'compatible', label: 'Legacy', desc: 'May increase size' },
                  { v: 'standard', label: 'Standard', desc: 'Object streams' },
                  { v: 'maximum', label: 'Maximum', desc: 'Streams + strip metadata' },
                ].map((opt) => (
                  <label
                    key={opt.v}
                    htmlFor={`lv-${opt.v}`}
                    className={`flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition ${level === opt.v ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <RadioGroupItem value={opt.v} id={`lv-${opt.v}`} className="mt-0.5" />
                    <span>
                      <span className="block text-sm font-medium">{opt.label}</span>
                      <span className="block text-xs text-gray-500">{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}

          {processing && (
            <div className="mt-5">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2 text-center">Optimizing… {progress}%</p>
            </div>
          )}

          {result && (
            <div className="mt-5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-sm">
              <p>
                Original <strong>{formatBytes(result.originalSize)}</strong>
                {' → '}
                Optimized <strong>{formatBytes(result.newSize)}</strong>
                {reductionPct > 0 ? ` (−${reductionPct}%)` : ' (no reduction)'}
              </p>
            </div>
          )}

          <div className="mt-5">
            {!result ? (
              <Button onClick={handleCompress} disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12">
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Working…</>
                ) : (
                  <><Minimize2 className="w-5 h-5 mr-2" aria-hidden="true" /> Optimize PDF</>
                )}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => downloadBlob(result.blob, file.name.replace(/\.pdf$/i, '') + '-optimized.pdf')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                >
                  <Download className="w-5 h-5 mr-2" aria-hidden="true" /> Download
                </Button>
                <Button variant="outline" onClick={reset} className="h-12">Do another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
