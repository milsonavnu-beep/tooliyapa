'use client'

import { useMemo, useState } from 'react'
import {
  analyzeText, convertCase, diffText, findAndReplace, generateLorem, grammarWritingIssues,
  readabilityAnalysis, reverseText, slugify, sortLines, splitText, summarizeExtractively,
  textSimilarity, textStats, wordFrequency,
} from '@/lib/text-utils'

const areaClass='min-h-44 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const inputClass='h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-600/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
const selectClass=inputClass
const buttonClass='inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:bg-violet-600 dark:hover:bg-violet-500'
const secondaryButton='inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

function Workspace({ children }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">{children}</div> }
function Field({ label, children, hint }) { return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</span>{children}{hint&&<span className="mt-1.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</span>}</label> }
function ResultBox({ title='Result', children }) { return <section aria-live="polite" className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-4 dark:border-violet-950 dark:bg-violet-950/20"><h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2><div className="mt-3 text-sm text-slate-700 dark:text-slate-300">{children}</div></section> }
function ErrorBox({ error }) { return error?<p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">{error}</p>:null }
function MetricGrid({ items }) { return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{items.map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950"><div className="text-xs text-slate-500 dark:text-slate-400">{label}</div><div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{value}</div></div>)}</div> }
function CopyButton({ value }) { const [copied,setCopied]=useState(false); return <button type="button" className={secondaryButton} onClick={async()=>{try{await navigator.clipboard.writeText(String(value));setCopied(true);setTimeout(()=>setCopied(false),1200)}catch{}}}>{copied?'Copied':'Copy result'}</button> }
function safe(fn) { try { return { value: fn(), error: '' } } catch (error) { return { value: null, error: error instanceof Error ? error.message : 'Unable to process this text.' } } }

function WordCounter() {
  const [text,setText]=useState('')
  const stats=useMemo(()=>textStats(text),[text])
  return <Workspace><Field label="Text"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type or paste text here…" maxLength={200000}/></Field><ResultBox title="Live counts"><MetricGrid items={[["Words",stats.words],["Characters",stats.characters],["Without spaces",stats.charactersNoSpaces],["Sentences",stats.sentences],["Paragraphs",stats.paragraphs],["Lines",stats.lines],["Reading time",`${stats.readingMinutes.toFixed(1)} min`],["Speaking time",`${stats.speakingMinutes.toFixed(1)} min`]]}/></ResultBox></Workspace>
}

function CaseConverter() {
  const [text,setText]=useState(''); const [mode,setMode]=useState('upper')
  const output=useMemo(()=>convertCase(text,mode),[text,mode])
  const modes=[['upper','UPPERCASE'],['lower','lowercase'],['title','Title Case'],['sentence','Sentence case'],['toggle','tOGGLE cASE']]
  return <Workspace><Field label="Text"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000} placeholder="Type or paste text here…"/></Field><div className="mt-4 flex flex-wrap gap-2">{modes.map(([value,label])=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>setMode(value)} className={mode===value?buttonClass:secondaryButton}>{label}</button>)}</div><ResultBox><pre className="whitespace-pre-wrap break-words font-sans">{output||'Your converted text will appear here.'}</pre>{output&&<div className="mt-4"><CopyButton value={output}/></div>}</ResultBox></Workspace>
}

function TextDiff() {
  const [a,setA]=useState(''); const [b,setB]=useState('')
  const result=useMemo(()=>safe(()=>diffText(a,b)),[a,b])
  return <Workspace><div className="grid gap-4 lg:grid-cols-2"><Field label="Original text"><textarea className={areaClass} value={a} onChange={(e)=>setA(e.target.value)} maxLength={200000}/></Field><Field label="Changed text"><textarea className={areaClass} value={b} onChange={(e)=>setB(e.target.value)} maxLength={200000}/></Field></div><ErrorBox error={result.error}/>{result.value&&<ResultBox title="Line-by-line differences"><div className="max-h-[32rem] overflow-auto rounded-xl border border-slate-200 bg-white font-mono text-xs dark:border-slate-800 dark:bg-slate-950">{result.value.map((item,index)=><div key={`${index}-${item.type}`} className={`flex gap-2 border-b border-slate-100 px-3 py-2 last:border-0 dark:border-slate-800 ${item.type==='add'?'bg-emerald-50 dark:bg-emerald-950/20':item.type==='remove'?'bg-red-50 dark:bg-red-950/20':''}`}><span aria-hidden="true" className="w-4 shrink-0 text-slate-400">{item.type==='add'?'+':item.type==='remove'?'-':' '}</span><span className="whitespace-pre-wrap break-all">{item.text||' '}</span></div>)}</div></ResultBox>}</Workspace>
}

function Readability() {
  const [text,setText]=useState(''); const result=useMemo(()=>readabilityAnalysis(text),[text])
  return <Workspace><Field label="English prose"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000} placeholder="Paste a few complete English sentences…"/></Field><ResultBox title="Readability estimate">{result.available?<MetricGrid items={[["Flesch Reading Ease",result.fleschReadingEase],["Flesch-Kincaid grade",result.fleschKincaidGrade],["Words analyzed",result.words],["Avg. words / sentence",result.averageSentenceWords]]}/>:<p>{result.reason}</p>}</ResultBox></Workspace>
}

function Analyzer() {
  const [text,setText]=useState(''); const data=useMemo(()=>analyzeText(text),[text])
  return <Workspace><Field label="Text"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><ResultBox title="Analysis"><MetricGrid items={[["Words",data.words],["Unique words",data.uniqueWords],["Lexical diversity",`${(data.lexicalDiversity*100).toFixed(1)}%`],["Avg. word length",data.averageWordLength.toFixed(1)]]}/><div className="mt-5 grid gap-4 md:grid-cols-2"><div><h3 className="font-semibold text-slate-900 dark:text-white">Frequent words</h3><div className="mt-2 flex flex-wrap gap-2">{data.topWords.length?data.topWords.map(({word,count})=><span key={word} className="rounded-full bg-white px-2.5 py-1 text-xs dark:bg-slate-900">{word} · {count}</span>):<span className="text-slate-500">No words yet.</span>}</div></div><div><h3 className="font-semibold text-slate-900 dark:text-white">Longest words</h3><p className="mt-2 break-words text-sm">{data.longestWords.join(', ')||'No words yet.'}</p></div></div></ResultBox></Workspace>
}

function FindReplace() {
  const [text,setText]=useState(''); const [find,setFind]=useState(''); const [replacement,setReplacement]=useState(''); const [caseSensitive,setCaseSensitive]=useState(false); const [wholeWord,setWholeWord]=useState(false)
  const result=useMemo(()=>find?safe(()=>findAndReplace(text,find,replacement,{caseSensitive,wholeWord})):{value:null,error:''},[text,find,replacement,caseSensitive,wholeWord])
  return <Workspace><Field label="Source text"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Find"><input className={inputClass} value={find} onChange={(e)=>setFind(e.target.value)} maxLength={2000}/></Field><Field label="Replace with"><input className={inputClass} value={replacement} onChange={(e)=>setReplacement(e.target.value)} maxLength={2000}/></Field></div><div className="mt-4 flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={caseSensitive} onChange={(e)=>setCaseSensitive(e.target.checked)}/>Case sensitive</label><label className="flex items-center gap-2"><input type="checkbox" checked={wholeWord} onChange={(e)=>setWholeWord(e.target.checked)}/>Whole word</label></div><ErrorBox error={result.error}/>{result.value&&<ResultBox title={`${result.value.matches} match${result.value.matches===1?'':'es'} replaced`}><pre className="whitespace-pre-wrap break-words font-sans">{result.value.output}</pre><div className="mt-4"><CopyButton value={result.value.output}/></div></ResultBox>}</Workspace>
}

function SortLines() {
  const [text,setText]=useState(''); const [direction,setDirection]=useState('asc'); const [numeric,setNumeric]=useState(false); const [unique,setUnique]=useState(false); const [trim,setTrim]=useState(false); const [removeEmpty,setRemoveEmpty]=useState(false)
  const output=useMemo(()=>sortLines(text,{direction,numeric,unique,trim,removeEmpty}),[text,direction,numeric,unique,trim,removeEmpty])
  return <Workspace><Field label="One item per line"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><div className="mt-4 grid gap-3 sm:grid-cols-2"><Field label="Order"><select className={selectClass} value={direction} onChange={(e)=>setDirection(e.target.value)}><option value="asc">Ascending</option><option value="desc">Descending</option></select></Field><div className="flex flex-wrap items-end gap-4 pb-2 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={numeric} onChange={(e)=>setNumeric(e.target.checked)}/>Numeric</label><label className="flex items-center gap-2"><input type="checkbox" checked={unique} onChange={(e)=>setUnique(e.target.checked)}/>Unique</label><label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={(e)=>setTrim(e.target.checked)}/>Trim</label><label className="flex items-center gap-2"><input type="checkbox" checked={removeEmpty} onChange={(e)=>setRemoveEmpty(e.target.checked)}/>Remove blanks</label></div></div><ResultBox><pre className="whitespace-pre-wrap break-words font-sans">{output}</pre>{output&&<div className="mt-4"><CopyButton value={output}/></div>}</ResultBox></Workspace>
}

function SplitTextTool() {
  const [text,setText]=useState(''); const [mode,setMode]=useState('delimiter'); const [delimiter,setDelimiter]=useState(','); const [chunkSize,setChunkSize]=useState(100)
  const result=useMemo(()=>safe(()=>splitText(text,{mode,delimiter,chunkSize})),[text,mode,delimiter,chunkSize])
  return <Workspace><Field label="Text"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><div className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="Split by"><select className={selectClass} value={mode} onChange={(e)=>setMode(e.target.value)}><option value="delimiter">Delimiter</option><option value="lines">Lines</option><option value="words">Word chunks</option><option value="characters">Character chunks</option></select></Field>{mode==='delimiter'&&<Field label="Delimiter"><input className={inputClass} value={delimiter} onChange={(e)=>setDelimiter(e.target.value)} maxLength={100}/></Field>}{(mode==='words'||mode==='characters')&&<Field label="Chunk size"><input className={inputClass} type="number" min="1" max={mode==='words'?1000:10000} value={chunkSize} onChange={(e)=>setChunkSize(e.target.value)}/></Field>}</div><ErrorBox error={result.error}/>{result.value&&<ResultBox title={`${result.value.length} part${result.value.length===1?'':'s'}`}><ol className="max-h-[30rem] space-y-2 overflow-auto">{result.value.slice(0,500).map((part,index)=><li key={index} className="rounded-lg bg-white p-2 dark:bg-slate-900"><span className="mr-2 text-xs text-slate-400">{index+1}.</span><span className="whitespace-pre-wrap break-words">{part||'(empty)'}</span></li>)}</ol>{result.value.length>500&&<p className="mt-3 text-xs text-slate-500">Showing the first 500 parts.</p>}</ResultBox>}</Workspace>
}

function ReverseTextTool() {
  const [text,setText]=useState(''); const [mode,setMode]=useState('characters'); const output=useMemo(()=>reverseText(text,mode),[text,mode])
  return <Workspace><Field label="Text"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><div className="mt-4 max-w-xs"><Field label="Reverse"><select className={selectClass} value={mode} onChange={(e)=>setMode(e.target.value)}><option value="characters">Characters</option><option value="words">Word order</option><option value="lines">Line order</option></select></Field></div><ResultBox><pre className="whitespace-pre-wrap break-words font-sans">{output}</pre>{output&&<div className="mt-4"><CopyButton value={output}/></div>}</ResultBox></Workspace>
}

function SlugGenerator() {
  const [text,setText]=useState(''); const [separator,setSeparator]=useState('-'); const output=useMemo(()=>slugify(text,separator),[text,separator])
  return <Workspace><div className="grid gap-4 sm:grid-cols-[1fr_180px]"><Field label="Title or phrase"><input className={inputClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><Field label="Separator"><select className={selectClass} value={separator} onChange={(e)=>setSeparator(e.target.value)}><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select></Field></div><ResultBox><code className="break-all text-base">{output||'your-slug-will-appear-here'}</code>{output&&<div className="mt-4"><CopyButton value={output}/></div>}</ResultBox></Workspace>
}

function Lorem() {
  const [unit,setUnit]=useState('paragraphs'); const [count,setCount]=useState(3); const output=useMemo(()=>generateLorem({unit,count}),[unit,count])
  return <Workspace><div className="grid gap-4 sm:grid-cols-2"><Field label="Generate"><select className={selectClass} value={unit} onChange={(e)=>setUnit(e.target.value)}><option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option></select></Field><Field label="Count"><input className={inputClass} type="number" min="1" max={unit==='paragraphs'?50:1000} value={count} onChange={(e)=>setCount(e.target.value)}/></Field></div><ResultBox><pre className="whitespace-pre-wrap font-sans leading-7">{output}</pre><div className="mt-4"><CopyButton value={output}/></div></ResultBox></Workspace>
}

function WordCloud() {
  const [text,setText]=useState(''); const words=useMemo(()=>wordFrequency(text,{limit:40,minLength:2}),[text]); const max=words[0]?.count||1
  return <Workspace><Field label="Text"><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><ResultBox title="Frequent words">{words.length?<div className="flex min-h-56 flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-xl bg-white p-5 dark:bg-slate-950">{words.map(({word,count})=><span key={word} title={`${count} occurrences`} style={{fontSize:`${0.85+1.65*(count/max)}rem`}} className="font-semibold text-violet-700 dark:text-violet-300">{word}</span>)}</div>:<p>Add enough text to build a word-frequency view.</p>}</ResultBox></Workspace>
}

function Summarizer() {
  const [text,setText]=useState(''); const [count,setCount]=useState(5); const summary=useMemo(()=>summarizeExtractively(text,count),[text,count]); const output=summary.join(' ')
  return <Workspace><Field label="Source text" hint="This is an extractive frequency-based tool, not generative AI."><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><div className="mt-4 max-w-xs"><Field label="Sentences to keep"><input className={inputClass} type="number" min="1" max="50" value={count} onChange={(e)=>setCount(e.target.value)}/></Field></div><ResultBox title="Extractive summary"><p className="leading-7">{output||'Add source text to select key sentences.'}</p>{output&&<div className="mt-4"><CopyButton value={output}/></div>}</ResultBox></Workspace>
}

function GrammarChecker() {
  const [text,setText]=useState(''); const issues=useMemo(()=>grammarWritingIssues(text),[text])
  return <Workspace><Field label="English prose" hint="Uses a small deterministic rule set; it is not an AI or comprehensive grammar engine."><textarea className={areaClass} value={text} onChange={(e)=>setText(e.target.value)} maxLength={200000}/></Field><ResultBox title={`${issues.length} possible issue${issues.length===1?'':'s'}`}>{issues.length?<ul className="space-y-3">{issues.map((issue,index)=><li key={`${issue.type}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-300">{issue.type}</span>{issue.line&&<span className="text-xs text-slate-500">Line {issue.line}</span>}</div><p className="mt-2">{issue.message}</p>{issue.excerpt&&<p className="mt-1 text-xs text-slate-500">{issue.excerpt}</p>}</li>)}</ul>:<p>No issues from the current rule set. That does not guarantee the text is error-free.</p>}</ResultBox></Workspace>
}

function Similarity() {
  const [a,setA]=useState(''); const [b,setB]=useState(''); const [gramSize,setGramSize]=useState(3); const data=useMemo(()=>textSimilarity(a,b,gramSize),[a,b,gramSize])
  return <Workspace><div className="grid gap-4 lg:grid-cols-2"><Field label="First text"><textarea className={areaClass} value={a} onChange={(e)=>setA(e.target.value)} maxLength={200000}/></Field><Field label="Second text"><textarea className={areaClass} value={b} onChange={(e)=>setB(e.target.value)} maxLength={200000}/></Field></div><div className="mt-4 max-w-xs"><Field label="Phrase size"><select className={selectClass} value={gramSize} onChange={(e)=>setGramSize(Number(e.target.value))}><option value="2">2 words</option><option value="3">3 words</option><option value="4">4 words</option><option value="5">5 words</option></select></Field></div><ResultBox title="Local overlap"><MetricGrid items={[["Similarity",`${data.similarity}%`],["Compared phrase size",`${data.comparedGramSize} words`]]}/><h3 className="mt-5 font-semibold text-slate-900 dark:text-white">Matching phrases</h3><div className="mt-2 flex flex-wrap gap-2">{data.commonPhrases.length?data.commonPhrases.map((phrase)=><span key={phrase} className="rounded-full bg-white px-2.5 py-1 text-xs dark:bg-slate-900">{phrase}</span>):<span className="text-slate-500">No matching phrases at this setting.</span>}</div><p className="mt-4 text-xs leading-5 text-slate-500">This compares only the two supplied texts. It is not a plagiarism detector and does not search the web or external databases.</p></ResultBox></Workspace>
}

export default function TextToolClient({ toolId }) {
  switch (toolId) {
    case 'word-counter': return <WordCounter/>
    case 'case-converter': return <CaseConverter/>
    case 'text-diff': return <TextDiff/>
    case 'readability': return <Readability/>
    case 'text-analyzer': return <Analyzer/>
    case 'find-replace': return <FindReplace/>
    case 'sort-lines': return <SortLines/>
    case 'split-text': return <SplitTextTool/>
    case 'reverse-text': return <ReverseTextTool/>
    case 'slug-generator': return <SlugGenerator/>
    case 'lorem-ipsum': return <Lorem/>
    case 'word-cloud': return <WordCloud/>
    case 'extractive-summarizer': return <Summarizer/>
    case 'grammar-writing': return <GrammarChecker/>
    case 'text-similarity': return <Similarity/>
    default: return <Workspace><p className="text-sm text-slate-600 dark:text-slate-300">This text tool is unavailable.</p></Workspace>
  }
}
