'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { PDFDocument, degrees } from 'pdf-lib'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X, Download, Layers, Loader2, GripVertical, Trash2, RotateCw } from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes, downloadBlob } from '@/lib/pdf-utils'
import ToolShell from './ToolShell'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function PageThumb({ page, onDelete, onRotate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 hover:border-violet-400 dark:hover:border-violet-600 transition-colors">
        <div className="aspect-[3/4] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          {page.thumb ? (
            <img src={page.thumb} alt={`Page ${page.originalIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              style={{ transform: `rotate(${page.rotation}deg)` }} />
          ) : (
            <div className="text-xs text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
          )}
        </div>
        <div className="absolute top-1 left-1 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-medium">{page.originalIndex + 1}</div>
        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => onRotate(page.id)} className="p-1.5 rounded-md bg-white/90 hover:bg-white shadow text-gray-700" title="Rotate 90°">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(page.id)} className="p-1.5 rounded-md bg-red-500/90 hover:bg-red-600 shadow text-white" title="Delete page">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <button {...attributes} {...listeners}
          className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-violet-600/90 hover:bg-violet-700 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition cursor-grab active:cursor-grabbing flex items-center gap-1">
          <GripVertical className="w-3 h-3" /> drag
        </button>
      </div>
    </div>
  )
}

export default function OrganizePdfTool() {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected?.length) return toast.error('Only PDFs allowed.')
    const f = accepted[0]; if (!f) return
    setFile(f); setResult(null); setLoading(true); setProgress(0); setPages([])
    try {
      const buf = await f.arrayBuffer()
      const pdf = await PDFDocument.load(buf, { ignoreEncryption: true })
      const total = pdf.getPageCount()
      // Initialize page list with placeholders
      const initial = Array.from({ length: total }, (_, i) => ({
        id: crypto.randomUUID(), originalIndex: i, rotation: 0, thumb: null,
      }))
      setPages(initial)
      // Render thumbnails using pdfjs
      const pdfjs = await import('pdfjs-dist/build/pdf.mjs')
      const { configurePdfJsWorker } = await import('@/lib/pdfjs-worker')
      configurePdfJsWorker(pdfjs)
      const doc = await pdfjs.getDocument({ data: buf }).promise
      for (let i = 0; i < total; i++) {
        const p = await doc.getPage(i + 1)
        const viewport = p.getViewport({ scale: 0.4 })
        const canvas = document.createElement('canvas')
        canvas.width = viewport.width; canvas.height = viewport.height
        await p.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
        setPages((prev) => prev.map((pp, idx) => idx === i ? { ...pp, thumb: dataUrl } : pp))
        setProgress(Math.round(((i + 1) / total) * 100))
      }
    } catch (e) { console.error(e); toast.error('Cannot read PDF.') }
    finally { setLoading(false) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false, disabled: !!file,
  })

  const handleDragEnd = (e) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setPages((prev) => {
      const oldIdx = prev.findIndex((p) => p.id === active.id)
      const newIdx = prev.findIndex((p) => p.id === over.id)
      return arrayMove(prev, oldIdx, newIdx)
    })
  }

  const deletePage = (id) => setPages((prev) => prev.filter((p) => p.id !== id))
  const rotatePage = (id) => setPages((prev) => prev.map((p) => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))

  const handleApply = async () => {
    if (!file || !pages.length) return toast.error('No pages to save.')
    setProcessing(true); setResult(null)
    try {
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
      const out = await PDFDocument.create()
      const indices = pages.map((p) => p.originalIndex)
      const copied = await out.copyPages(src, indices)
      copied.forEach((page, i) => {
          const rot = pages[i].rotation
          if (rot) {
            const cur = page.getRotation().angle || 0
            page.setRotation(degrees((cur + rot) % 360))
          }
        out.addPage(page)
      })
      const bytes = await out.save()
      setResult(new Blob([bytes], { type: 'application/pdf' }))
      toast.success(`Saved ${pages.length} page${pages.length !== 1 ? 's' : ''}.`)
    } catch (e) { console.error(e); toast.error('Failed to save PDF.') }
    finally { setProcessing(false) }
  }

  const reset = () => { setFile(null); setPages([]); setResult(null); setProgress(0) }

  return (
    <ToolShell icon={Layers} title="Organize PDF" accent="violet"
      description="Drag pages to reorder, click to rotate, or delete pages you don't need.">
      {!file && (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-white dark:bg-gray-900 ${isDragActive ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40' : 'border-gray-300 dark:border-gray-700 hover:border-violet-400'}`}>
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="font-semibold text-gray-700 dark:text-gray-200">{isDragActive ? 'Drop here…' : 'Drag & drop a PDF, or click to browse'}</p>
        </div>
      )}
      {file && (
        <Card className="p-4 sm:p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/60">
            <FileText className="w-5 h-5 text-violet-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)} · {pages.length} pages</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={reset} aria-label="Remove file"><X className="w-4 h-4" aria-hidden="true" /></Button>
          </div>

          {loading && (<div className="mt-5"><Progress value={progress} className="h-2" /><p className="text-xs text-gray-500 mt-2 text-center">Loading thumbnails… {progress}%</p></div>)}

          {pages.length > 0 && !result && (
            <div className="mt-5">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">✨ <strong>Drag</strong> the page tiles to reorder. Hover to <strong>rotate</strong> or <strong>delete</strong>.</p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {pages.map((p) => <PageThumb key={p.id} page={p} onDelete={deletePage} onRotate={rotatePage} />)}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          <div className="mt-5">
            {!result ? (
              <Button onClick={handleApply} disabled={processing || !pages.length} className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12">
                {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Layers className="w-5 h-5 mr-2" /> Apply changes ({pages.length} page{pages.length !== 1 ? 's' : ''})</>}
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => downloadBlob(result, file.name.replace(/\.pdf$/i, '') + '-organized.pdf')} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"><Download className="w-5 h-5 mr-2" /> Download organized PDF</Button>
                <Button variant="outline" onClick={reset} className="h-12">Do another</Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </ToolShell>
  )
}
