'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, FileArchive, FileText, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { downloadBlob, formatBytes } from '@/lib/pdf-utils'
import {
  bytesToDataUrl, createEpub, createImagesZip, docxToHtml, docxToMarkdown, docxToPdf, fileBaseName,
  inspectDocx, markdownToDocx, markdownToHtml, markdownToPdf, pdfPagesToDocx, pdfTextItemsToLines,
  readDocx, readXlsx, textToPdf,
} from '@/lib/document-engine'

const WORD_TOOL_IDS = new Set(['word-html','word-markdown','word-epub','word-metadata','word-styles','word-images','docx-inspector','word-pdf'])
const MARKDOWN_TOOL_IDS = new Set(['markdown-word','markdown-html','markdown-pdf'])
const MAX_FILE = 50 * 1024 * 1024

function ErrorMessage({ error }) { return error ? <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">{error}</div> : null }
function Status({ children }) { return <div aria-live="polite" className="sr-only">{children}</div> }

function FilePicker({ file, accept, label, hint, onFile, onClear }) {
  return <div>
    {!file ? <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/30 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/20">
      <Upload className="h-9 w-9 text-blue-600" aria-hidden="true"/><span className="mt-3 font-semibold text-slate-800 dark:text-white">{label}</span><span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</span><input type="file" accept={accept} className="sr-only" onChange={(event)=>onFile(event.target.files?.[0] || null)}/>
    </label> : <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><FileText className="h-6 w-6 shrink-0 text-blue-600" aria-hidden="true"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p></div><Button type="button" variant="ghost" size="icon" onClick={onClear} aria-label="Remove file"><X className="h-4 w-4"/></Button></div>}
  </div>
}

function ProcessingButton({ busy, disabled, onClick, children }) {
  return <Button type="button" onClick={onClick} disabled={disabled || busy} className="mt-5 h-12 w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto sm:min-w-52">{busy?<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Processing…</>:children}</Button>
}

function DownloadButton({ blob, filename, children='Download' }) {
  return <Button type="button" onClick={()=>downloadBlob(blob,filename)} className="h-11 bg-emerald-600 text-white hover:bg-emerald-700"><Download className="mr-2 h-4 w-4"/>{children}</Button>
}

function JsonResult({ data, filename, title='Result' }) {
  const text=JSON.stringify(data,null,2);const blob=useMemo(()=>new Blob([text],{type:'application/json'}),[text])
  return <Card className="mt-6 border-slate-200 p-5 dark:border-slate-800"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2><DownloadButton blob={blob} filename={filename}>Download JSON</DownloadButton></div><pre className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-xs leading-6 text-slate-700 dark:bg-slate-950 dark:text-slate-300">{text}</pre></Card>
}

function ImageResults({ doc }) {
  const urls=useMemo(()=>doc.images.map((image)=>({image,url:URL.createObjectURL(new Blob([image.bytes],{type:image.mime}))})),[doc])
  useEffect(()=>()=>urls.forEach(({url})=>URL.revokeObjectURL(url)),[urls])
  const [zipBusy,setZipBusy]=useState(false);const [error,setError]=useState('')
  const downloadZip=async()=>{setZipBusy(true);setError('');try{const blob=await createImagesZip(doc);downloadBlob(blob,`${fileBaseName(doc.name)}-images.zip`)}catch(e){setError(e.message||'Could not create the image ZIP.')}finally{setZipBusy(false)}}
  return <Card className="mt-6 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Embedded images</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{doc.images.length} image{doc.images.length===1?'':'s'} found.</p></div>{doc.images.length>0&&<Button onClick={downloadZip} disabled={zipBusy} variant="outline">{zipBusy?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<FileArchive className="mr-2 h-4 w-4"/>}Download ZIP</Button>}</div><ErrorMessage error={error}/>{doc.images.length?<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{urls.map(({image,url})=><div key={image.path} className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"><div className="flex h-40 items-center justify-center bg-slate-50 p-3 dark:bg-slate-950"><img src={url} alt={image.name} className="max-h-full max-w-full object-contain"/></div><div className="p-3"><p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{image.name}</p><p className="mt-1 text-xs text-slate-500">{image.mime} · {formatBytes(image.size)}</p><Button type="button" size="sm" variant="outline" className="mt-3" onClick={()=>downloadBlob(new Blob([image.bytes],{type:image.mime}),image.name)}><Download className="mr-1.5 h-3.5 w-3.5"/>Download</Button></div></div>)}</div>:<p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">No files were stored under the DOCX media folder.</p>}</Card>
}

function WordTool({ toolId }) {
  const [file,setFile]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState(null)
  const choose=(next)=>{setError('');setResult(null);if(next&&next.size>MAX_FILE){setFile(null);setError('File is too large. Use a DOCX up to 50 MiB.');return}if(next&&!/\.docx$/i.test(next.name)){setFile(null);setError('Choose an unencrypted .docx file.');return}setFile(next)}
  const process=async()=>{if(!file)return;setBusy(true);setError('');setResult(null);try{const doc=await readDocx(file);const base=fileBaseName(file.name)
    if(toolId==='word-html'){const html=docxToHtml(doc);setResult({kind:'html',html,blob:new Blob([html],{type:'text/html;charset=utf-8'}),filename:`${base}.html`})}
    else if(toolId==='word-markdown'){const text=docxToMarkdown(doc);setResult({kind:'text',text,blob:new Blob([text],{type:'text/markdown;charset=utf-8'}),filename:`${base}.md`})}
    else if(toolId==='word-epub'){setResult({kind:'download',blob:await createEpub(doc),filename:`${base}.epub`,message:`EPUB created from ${doc.counts.paragraphs} paragraphs, ${doc.counts.tables} tables, and ${doc.counts.images} embedded images.`})}
    else if(toolId==='word-metadata')setResult({kind:'json',data:doc.metadata,filename:`${base}-metadata.json`,title:'Stored document metadata'})
    else if(toolId==='word-styles')setResult({kind:'json',data:doc.styles,filename:`${base}-styles.json`,title:'DOCX style analysis'})
    else if(toolId==='docx-inspector')setResult({kind:'json',data:inspectDocx(doc),filename:`${base}-inspection.json`,title:'DOCX inspection report'})
    else if(toolId==='word-images')setResult({kind:'images',doc})
    else if(toolId==='word-pdf')setResult({kind:'download',blob:await docxToPdf(doc),filename:`${base}.pdf`,message:'The DOCX content was reflowed into browser-rendered A4 pages. Review the PDF because exact Word pagination is not reproduced.'})
  }catch(e){console.error(e);setError(e.message||'Document processing failed.')}finally{setBusy(false)}}
  return <div><FilePicker file={file} accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" label="Choose a Word document" hint="DOCX only · up to 50 MiB · processed locally in this browser" onFile={choose} onClear={()=>choose(null)}/><ProcessingButton busy={busy} disabled={!file} onClick={process}>Run document tool</ProcessingButton><ErrorMessage error={error}/><Status>{busy?'Processing document':result?'Document processing complete':''}</Status>{result?.kind==='download'&&<Card className="mt-6 p-5"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Ready to download</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{result.message}</p><div className="mt-4"><DownloadButton blob={result.blob} filename={result.filename}/></div></Card>}{result?.kind==='html'&&<Card className="mt-6 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900 dark:text-white">HTML preview</h2><DownloadButton blob={result.blob} filename={result.filename}>Download HTML</DownloadButton></div><iframe title="Generated HTML preview" sandbox="" srcDoc={result.html} className="mt-4 h-[28rem] w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700"/></Card>}{result?.kind==='text'&&<Card className="mt-6 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Markdown output</h2><DownloadButton blob={result.blob} filename={result.filename}>Download Markdown</DownloadButton></div><textarea readOnly value={result.text} className="mt-4 h-80 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"/></Card>}{result?.kind==='json'&&<JsonResult data={result.data} filename={result.filename} title={result.title}/>} {result?.kind==='images'&&<ImageResults doc={result.doc}/>}</div>
}

const MARKDOWN_EXAMPLE=`# Project notes\n\nA simple **Markdown** document with a few useful structures.\n\n## Checklist\n\n- Review the first draft\n- Confirm the figures\n- Export the final document\n\n> Everything is processed in this browser.\n\n| Item | Status |\n| --- | --- |\n| Draft | Ready |\n| Review | Pending |\n`

function MarkdownTool({ toolId }) {
  const [text,setText]=useState(MARKDOWN_EXAMPLE),[title,setTitle]=useState('Document'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState(null)
  const preview=useMemo(()=>markdownToHtml(text,{standalone:true,title:title||'Document'}),[text,title])
  const process=async()=>{setBusy(true);setError('');setResult(null);try{if(!text.trim())throw new Error('Enter some Markdown first.');const base=fileBaseName(title||'document')
    if(toolId==='markdown-html'){const html=markdownToHtml(text,{standalone:true,title});setResult({blob:new Blob([html],{type:'text/html;charset=utf-8'}),filename:`${base}.html`,label:'Download HTML'})}
    else if(toolId==='markdown-word')setResult({blob:await markdownToDocx(text,{title}),filename:`${base}.docx`,label:'Download DOCX'})
    else if(toolId==='markdown-pdf')setResult({blob:await markdownToPdf(text,{title}),filename:`${base}.pdf`,label:'Download PDF'})
  }catch(e){console.error(e);setError(e.message||'Conversion failed.')}finally{setBusy(false)}}
  return <div><div className="grid gap-5 lg:grid-cols-2"><div><label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Document title<input value={title} onChange={(e)=>{setTitle(e.target.value);setResult(null)}} maxLength={120} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/></label><label className="mt-4 block text-sm font-semibold text-slate-800 dark:text-slate-200">Markdown<textarea value={text} onChange={(e)=>{setText(e.target.value);setResult(null)}} spellCheck="false" className="mt-2 h-[28rem] w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-6 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"/></label></div><div><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Live preview</p><iframe title="Markdown live preview" sandbox="" srcDoc={preview} className="mt-2 h-[32.2rem] w-full rounded-xl border border-slate-200 bg-white dark:border-slate-700"/></div></div><ProcessingButton busy={busy} disabled={!text.trim()} onClick={process}>Create {toolId==='markdown-word'?'DOCX':toolId==='markdown-html'?'HTML':'PDF'}</ProcessingButton><ErrorMessage error={error}/><Status>{busy?'Creating document':result?'Document ready':''}</Status>{result&&<Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-5"><div><h2 className="font-bold text-slate-900 dark:text-white">Export ready</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generated locally from the Markdown shown above.</p></div><DownloadButton blob={result.blob} filename={result.filename}>{result.label}</DownloadButton></Card>}</div>
}

function TextPdfTool() {
  const [text,setText]=useState(''),[title,setTitle]=useState('Text document'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState(null)
  const process=async()=>{setBusy(true);setError('');setResult(null);try{if(!text.trim())throw new Error('Enter some text first.');setResult(await textToPdf(text,{title:title||'Text document'}))}catch(e){setError(e.message||'PDF creation failed.')}finally{setBusy(false)}}
  return <div><label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Document title<input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900"/></label><label className="mt-4 block text-sm font-semibold text-slate-800 dark:text-slate-200">Plain text<textarea value={text} onChange={(e)=>{setText(e.target.value);setResult(null)}} className="mt-2 h-80 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 dark:border-slate-700 dark:bg-slate-900" placeholder="Paste or type your text…"/></label><ProcessingButton busy={busy} disabled={!text.trim()} onClick={process}>Create PDF</ProcessingButton><ErrorMessage error={error}/>{result&&<div className="mt-5"><DownloadButton blob={result} filename={`${fileBaseName(title||'text-document')}.pdf`}>Download PDF</DownloadButton></div>}</div>
}

function PdfWordTool() {
  const [file,setFile]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[result,setResult]=useState(null),[summary,setSummary]=useState('')
  const choose=(next)=>{setResult(null);setSummary('');setError('');if(next&&next.size>MAX_FILE){setFile(null);setError('File is too large. Use a PDF up to 50 MiB.');return}if(next&&!/\.pdf$/i.test(next.name)){setFile(null);setError('Choose a PDF file.');return}setFile(next)}
  const process=async()=>{if(!file)return;setBusy(true);setError('');setResult(null);try{const pdfjs=await import('pdfjs-dist/build/pdf.mjs');const{configurePdfJsWorker}=await import('@/lib/pdfjs-worker');configurePdfJsWorker(pdfjs);const pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;if(pdf.numPages>500)throw new RangeError('PDF to Word is limited to 500 pages per file.');const pages=[];let chars=0;for(let i=1;i<=pdf.numPages;i+=1){const page=await pdf.getPage(i);const content=await page.getTextContent();const lines=pdfTextItemsToLines(content.items);chars+=lines.join('').length;pages.push(lines)}if(chars===0)throw new Error('No selectable text was found. Image-only scans need OCR before PDF-to-Word conversion.');const blob=await pdfPagesToDocx(pages,{title:fileBaseName(file.name)});setResult(blob);setSummary(`Extracted ${chars.toLocaleString()} text characters from ${pdf.numPages} page${pdf.numPages===1?'':'s'}.`)}catch(e){console.error(e);setError(e.message||'PDF to Word conversion failed.')}finally{setBusy(false)}}
  return <div><FilePicker file={file} accept=".pdf,application/pdf" label="Choose a PDF" hint="Text-based PDF · up to 50 MiB · no OCR or server upload" onFile={choose} onClear={()=>choose(null)}/><ProcessingButton busy={busy} disabled={!file} onClick={process}>Convert to Word</ProcessingButton><ErrorMessage error={error}/><Status>{busy?'Extracting PDF text':result?'Word document ready':''}</Status>{result&&<Card className="mt-6 p-5"><h2 className="text-lg font-bold text-slate-900 dark:text-white">DOCX ready</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{summary} Layout, images, and tables are not reconstructed.</p><div className="mt-4"><DownloadButton blob={result} filename={`${fileBaseName(file.name)}.docx`}>Download DOCX</DownloadButton></div></Card>}</div>
}

function ExcelCsvTool() {
  const [file,setFile]=useState(null),[workbook,setWorkbook]=useState(null),[sheet,setSheet]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState(''),[csv,setCsv]=useState('')
  const choose=async(next)=>{setFile(null);setWorkbook(null);setCsv('');setError('');if(!next)return;if(next.size>MAX_FILE){setError('File is too large. Use an XLSX workbook up to 50 MiB.');return}if(!/\.xlsx$/i.test(next.name)){setError('Choose an .xlsx workbook.');return}setFile(next);setBusy(true);try{const loaded=await readXlsx(next);setWorkbook(loaded);setSheet(0)}catch(e){setFile(null);setError(e.message||'Workbook could not be opened.')}finally{setBusy(false)}}
  const convert=async()=>{if(!workbook)return;setBusy(true);setError('');setCsv('');try{setCsv(await workbook.sheetToCsv(sheet))}catch(e){setError(e.message||'Worksheet conversion failed.')}finally{setBusy(false)}}
  const blob=useMemo(()=>csv?new Blob([csv],{type:'text/csv;charset=utf-8'}):null,[csv])
  return <div><FilePicker file={file} accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" label="Choose an Excel workbook" hint="XLSX only · choose a worksheet after the workbook opens" onFile={choose} onClear={()=>choose(null)}/>{workbook&&<div className="mt-5 max-w-md"><label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Worksheet<select value={sheet} onChange={(e)=>{setSheet(Number(e.target.value));setCsv('')}} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-900">{workbook.sheets.map((item,index)=><option key={`${item.name}-${index}`} value={index}>{item.name}</option>)}</select></label></div>}<ProcessingButton busy={busy} disabled={!workbook} onClick={convert}>Convert worksheet to CSV</ProcessingButton><ErrorMessage error={error}/><Status>{busy?'Processing workbook':csv?'CSV ready':''}</Status>{csv&&<Card className="mt-6 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold text-slate-900 dark:text-white">CSV preview</h2><DownloadButton blob={blob} filename={`${fileBaseName(file.name)}-${fileBaseName(workbook.sheets[sheet].name)}.csv`}>Download CSV</DownloadButton></div><textarea readOnly value={csv.slice(0,50000)} className="mt-4 h-72 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"/><p className="mt-2 text-xs text-slate-500">Preview is limited to the first 50,000 characters; the downloaded CSV contains the complete converted worksheet.</p></Card>}</div>
}

export default function DocumentToolClient({ toolId }) {
  return <Card className="rounded-2xl border-slate-200 bg-slate-50/40 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 sm:p-7">{WORD_TOOL_IDS.has(toolId)?<WordTool toolId={toolId}/>:MARKDOWN_TOOL_IDS.has(toolId)?<MarkdownTool toolId={toolId}/>:toolId==='text-pdf'?<TextPdfTool/>:toolId==='pdf-word'?<PdfWordTool/>:toolId==='excel-csv'?<ExcelCsvTool/>:<p>Unsupported document tool.</p>}</Card>
}
