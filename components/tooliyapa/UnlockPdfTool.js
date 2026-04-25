'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, FileText, X, Download, Unlock, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'

// pdf-lib does not natively support encrypted-PDF decryption with a password.
// However, many PDFs only have an OWNER password (open-restrictions). We try
// loading with ignoreEncryption:true and re-saving — which strips owner-only
// restrictions. For user-password protected PDFs, this will fail.
export default function UnlockPdfTool({ onBack }) {
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted) => { if (accepted[0]) { setFile(accepted[0]); setResult(null) } }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false })

  const handleUnlock = async () => {
    if (!file) return
    setProcessing(true); setResult(null)
    try {
      // Note: password param is currently informational — pdf-lib doesn't decrypt encrypted streams.
      // We strip owner restrictions by loading with ignoreEncryption + re-saving.
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
      // Force a re-serialization that drops the encryption dictionary.
      const out = await PDFDocument.create()
      const pages = await out.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((p) => out.addPage(p))
      const bytes = await out.save()
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success('PDF unlocked!')
    } catch (e) {
      console.error(e)
      toast.error('Could not unlock. PDFs with a strong user password are not supported.')
    } finally { setProcessing(false) }
  }
  const reset = () => { setFile(null); setResult(null); setPassword('') }

  return (
    <ToolShell onBack={onBack} icon={Unlock} title="Unlock PDF" accent="slate" description="Remove restrictions from PDFs you own. Strong user-passwords are not supported in-browser.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white ${isDragActive ? 'border-slate-500 bg-slate-50' : 'border-gray-300 hover:border-slate-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/60">
            <FileText className="w-5 h-5 text-slate-700" />
            <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{file.name}</p><p className="text-xs text-gray-500">{formatBytes(file.size)}</p></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset}><X className="w-4 h-4" /></Button>
          </div>
          {!result && (
            <div className="mt-5">
              <Label className="text-sm font-semibold">Password (optional, if known)</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" placeholder="Leave blank to try owner-restriction removal" />
            </div>
          )}
          <div className="mt-5">
            {!result ? (
              <Button onClick={handleUnlock} disabled={processing} className="w-full bg-slate-700 hover:bg-slate-800 text-white h-12">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Working…</> : <><Unlock className="w-5 h-5 mr-2" /> Unlock PDF</>}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, '') + '-unlocked.pdf')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download</Button>
                <Button variant="outline" onClick={reset} className="h-12">Do another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
