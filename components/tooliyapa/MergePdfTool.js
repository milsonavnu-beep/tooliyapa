'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Upload, FileText, X, ArrowUp, ArrowDown, Download, Combine, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes } from '@/lib/pdf-utils'

export default function MergePdfTool({ onBack }) {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mergedBlob, setMergedBlob] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected && rejected.length) {
      toast.error(`${rejected.length} file(s) rejected. Only PDF files are accepted.`)
    }
    const newFiles = accepted.map((f) => ({ id: crypto.randomUUID(), file: f }))
    setFiles((prev) => [...prev, ...newFiles])
    setMergedBlob(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  })

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id))
  const moveFile = (idx, dir) => {
    setFiles((prev) => {
      const arr = [...prev]
      const target = idx + dir
      if (target < 0 || target >= arr.length) return arr
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please add at least 2 PDF files to merge.')
      return
    }
    setProcessing(true)
    setProgress(0)
    setMergedBlob(null)

    try {
      const merged = await PDFDocument.create()
      for (let i = 0; i < files.length; i++) {
        const buf = await files[i].file.arrayBuffer()
        const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach((p) => merged.addPage(p))
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }
      const bytes = await merged.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      setMergedBlob(blob)
      toast.success('PDFs merged successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to merge PDFs. One or more files may be corrupted or password-protected.')
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!mergedBlob) return
    const url = URL.createObjectURL(mergedBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `merged-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFiles([])
    setMergedBlob(null)
    setProgress(0)
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="text-center mb-8">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-red-50 items-center justify-center mb-4">
          <Combine className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Merge PDF</h1>
        <p className="mt-2 text-gray-600">Combine multiple PDFs in the order you choose. All in your browser.</p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-white ${
          isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/40'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
        <p className="font-semibold text-gray-700">
          {isDragActive ? 'Drop the files here…' : 'Drag & drop PDFs here, or click to browse'}
        </p>
        <p className="text-sm text-gray-500 mt-1">PDF files only · Multiple files supported</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <Card className="mt-6 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{files.length} file{files.length !== 1 ? 's' : ''} ready</h3>
            <Button variant="ghost" size="sm" onClick={reset}>Clear all</Button>
          </div>
          <ul className="space-y-2">
            {files.map((f, idx) => (
              <li key={f.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/60">
                <FileText className="w-5 h-5 text-red-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{f.file.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(f.file.size)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFile(idx, -1)} disabled={idx === 0}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveFile(idx, 1)} disabled={idx === files.length - 1}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeFile(f.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {processing && (
            <div className="mt-5">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-2 text-center">Merging… {progress}%</p>
            </div>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {!mergedBlob ? (
              <Button
                onClick={handleMerge}
                disabled={processing || files.length < 2}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-base"
              >
                {processing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Merging…</>
                ) : (
                  <><Combine className="w-5 h-5 mr-2" /> Merge {files.length} PDF{files.length !== 1 ? 's' : ''}</>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDownload}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base"
              >
                <Download className="w-5 h-5 mr-2" /> Download merged PDF
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
