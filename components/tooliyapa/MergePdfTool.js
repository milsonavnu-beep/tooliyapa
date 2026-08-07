'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X, Download, Combine, Loader2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableFile({ id, file, idx, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Drag to reorder">
        <GripVertical className="w-5 h-5" />
      </button>
      <span className="text-xs font-bold text-gray-500 w-5 text-center">{idx + 1}</span>
      <FileText className="w-5 h-5 text-red-600 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={onRemove} aria-label="Remove file"><X className="w-4 h-4" aria-hidden="true" /></Button>
    </li>
  )
}

export default function MergePdfTool() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [mergedBlob, setMergedBlob] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected?.length) toast.error(`${rejected.length} file(s) rejected. Only PDFs allowed.`)
    setFiles((prev) => [...prev, ...accepted.map((f) => ({ id: crypto.randomUUID(), file: f }))])
    setMergedBlob(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: true })

  const handleDragEnd = (e) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setFiles((prev) => {
      const oldIdx = prev.findIndex((p) => p.id === active.id)
      const newIdx = prev.findIndex((p) => p.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const handleMerge = async () => {
    if (files.length < 2) return toast.error('Add at least 2 PDFs.')
    setProcessing(true); setProgress(0); setMergedBlob(null)
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
      setMergedBlob(new Blob([bytes], { type: 'application/pdf' }))
      toast.success('PDFs merged!')
    } catch (e) { console.error(e); toast.error('Merge failed. File may be corrupt or password-protected.') }
    finally { setProcessing(false) }
  }
  const reset = () => { setFiles([]); setMergedBlob(null); setProgress(0) }

  return (
    <ToolShell icon={Combine} title="Merge PDF" accent="red" description="Drag files to reorder, then merge them into a single PDF — all in your browser.">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white dark:bg-gray-900 ${isDragActive ? 'border-red-500 bg-red-50 dark:bg-red-950/40' : 'border-gray-300 dark:border-gray-700 hover:border-red-400'}`}>
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
        <p className="font-semibold text-gray-700 dark:text-gray-200">{isDragActive ? 'Drop here…' : 'Drag & drop PDFs here, or click to browse'}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PDF files only · Multiple files supported</p>
      </div>
      {files.length > 0 && (
        <Card className="mt-6 p-4 sm:p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{files.length} file{files.length !== 1 ? 's' : ''} · drag to reorder</h3>
            <Button variant="ghost" size="sm" onClick={reset}>Clear all</Button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {files.map((f, idx) => (
                  <SortableFile key={f.id} id={f.id} file={f.file} idx={idx} onRemove={() => removeFile(f.id)} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          {processing && (<div className="mt-5"><Progress value={progress} className="h-2" /><p className="text-xs text-gray-500 mt-2 text-center">Merging… {progress}%</p></div>)}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {!mergedBlob ? (
              <Button onClick={handleMerge} disabled={processing || files.length < 2} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-base">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Merging…</> : <><Combine className="w-5 h-5 mr-2" /> Merge {files.length} PDFs</>}
              </Button>
            ) : (
              <Button onClick={() => downloadBlob(mergedBlob, `merged-${Date.now()}.pdf`)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base">
                <Download className="w-5 h-5 mr-2" /> Download merged PDF
              </Button>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
