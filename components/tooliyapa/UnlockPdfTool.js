'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileText, X, Download, Unlock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import { removePdfOwnerRestrictions } from '@/lib/pdf-ops'
import ToolShell from './ToolShell'

export default function UnlockPdfTool() {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted) => {
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

  const handleUnlock = async () => {
    if (!file) return
    setProcessing(true)
    setResult(null)
    try {
      const bytes = await removePdfOwnerRestrictions(await file.arrayBuffer())
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success('Restrictions removed where supported.')
    } catch (e) {
      console.error(e)
      toast.error('Could not process this PDF. Open-password (user) encryption is not supported in the browser.')
    } finally {
      setProcessing(false)
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
  }

  return (
    <ToolShell
      icon={Unlock}
      title="Remove PDF Restrictions"
      accent="slate"
      description="Remove common owner-permission restrictions from PDFs you can already open. This does not crack or decrypt open-password (user) encryption. Files stay in your browser."
    >
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-3 text-sm text-amber-900 dark:text-amber-200">
        <strong>What this tool can do:</strong> strip owner restrictions (print/copy limits) by re-saving a readable PDF.
        <br />
        <strong>What it cannot do:</strong> unlock PDFs that require a password just to open.
      </div>

      {!file && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white dark:bg-gray-900 ${isDragActive ? 'border-slate-500 bg-slate-50' : 'border-gray-300 hover:border-slate-400'}`}
          aria-label="Upload a PDF to remove owner restrictions"
        >
          <input {...getInputProps()} aria-label="Choose a PDF file" />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
          <p className="font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}
          </p>
        </div>
      )}

      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/60 dark:bg-gray-800/60">
            <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset} aria-label="Remove file">
              <X className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-5">
            {!result ? (
              <Button onClick={handleUnlock} disabled={processing} className="w-full bg-slate-700 hover:bg-slate-800 text-white h-12">
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" /> Working…</>
                ) : (
                  <><Unlock className="w-5 h-5 mr-2" aria-hidden="true" /> Remove restrictions</>
                )}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, '') + '-unrestricted.pdf')}
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
