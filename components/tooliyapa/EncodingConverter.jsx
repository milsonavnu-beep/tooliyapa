'use client'

import { useState } from 'react'
import { Actions, CalculatorLayout, Field, ResultPanel, Segmented, SelectField } from '@/components/tooliyapa/FormPrimitives'
import { convertBaseNumber, decimalToScientific, decodeText, encodeText, integerToRoman, morseToText, romanToInteger, scientificToDecimal, textToMorse } from '@/lib/encoding-converters'

export default function EncodingConverter({ tool }) {
  if(tool==='base-converter')return <BaseConverter/>
  if(tool==='text-encoding')return <TextEncoding/>
  if(tool==='roman-numeral')return <Roman/>
  if(tool==='scientific-notation')return <ScientificNotation/>
  return <Morse/>
}

function BaseConverter(){
  const initial={input:'',from:'10',to:'2'};const[v,setV]=useState(initial);const[error,setError]=useState('');const[answer,setAnswer]=useState('')
  const update=(key,value)=>{setV((c)=>({...c,[key]:value}));setError('');setAnswer('')};const reset=()=>{setV(initial);setError('');setAnswer('')}
  const submit=(e)=>{e.preventDefault();try{setAnswer(convertBaseNumber(v.input,Number(v.from),Number(v.to)));setError('')}catch(err){setAnswer('');setError(err.message)}}
  const bases=[2,8,10,16].map((base)=>({value:String(base),label:`Base ${base}${base===2?' (binary)':base===8?' (octal)':base===16?' (hexadecimal)':' (decimal)'}`}))
  return <CalculatorLayout result={<ResultPanel title="Base conversion" primary={answer} note="Whole integers are converted exactly with BigInt arithmetic within the input length limit."/>}><form onSubmit={submit} className="space-y-5"><Field id="base-converter-input" label="Integer" value={v.input} onChange={(value)=>update('input',value)} inputMode="text" error={error}/><div className="grid gap-4 sm:grid-cols-2"><SelectField id="base-converter-from" label="From base" value={v.from} onChange={(value)=>update('from',value)} options={bases}/><SelectField id="base-converter-to" label="To base" value={v.to} onChange={(value)=>update('to',value)} options={bases}/></div><Actions submitLabel="Convert" onReset={reset}/></form></CalculatorLayout>
}

function TextEncoding(){
  const initial={mode:'encode',format:'hex',input:''};const[v,setV]=useState(initial);const[error,setError]=useState('');const[answer,setAnswer]=useState('')
  const update=(key,value)=>{setV((c)=>({...c,[key]:value}));setError('');setAnswer('')};const reset=()=>{setV(initial);setError('');setAnswer('')}
  const submit=(e)=>{e.preventDefault();try{setAnswer(v.mode==='encode'?encodeText(v.input,v.format):decodeText(v.input,v.format));setError('')}catch(err){setAnswer('');setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title={v.mode==='encode'?'Encoded bytes':'Decoded text'} primary={answer||''} note="Text encoding uses UTF-8 rather than assuming every character is one ASCII byte."/>}><form onSubmit={submit} className="space-y-5"><Segmented label="Direction" value={v.mode} onChange={(value)=>update('mode',value)} options={[{value:'encode',label:'Text → bytes'},{value:'decode',label:'Bytes → text'}]}/><SelectField id="encoding-format" label="Byte format" value={v.format} onChange={(value)=>update('format',value)} options={[{value:'hex',label:'Hexadecimal'},{value:'binary',label:'Binary'},{value:'decimal',label:'Decimal bytes'}]}/><div><label htmlFor="encoding-input" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{v.mode==='encode'?'Text':'Byte values'}</label><textarea id="encoding-input" rows={6} value={v.input} onChange={(e)=>update('input',e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"/></div>{error&&<p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions submitLabel="Convert" onReset={reset}/></form></CalculatorLayout>
}

function Roman(){
  const initial={mode:'number',input:''};const[v,setV]=useState(initial);const[error,setError]=useState('');const[answer,setAnswer]=useState('')
  const update=(key,value)=>{setV((c)=>({...c,[key]:value}));setError('');setAnswer('')};const reset=()=>{setV(initial);setError('');setAnswer('')}
  const submit=(e)=>{e.preventDefault();try{setAnswer(v.mode==='number'?integerToRoman(v.input):String(romanToInteger(v.input)));setError('')}catch(err){setAnswer('');setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title="Roman numeral conversion" primary={answer}/>}><form onSubmit={submit} className="space-y-5"><Segmented label="Direction" value={v.mode} onChange={(value)=>update('mode',value)} options={[{value:'number',label:'Number → Roman'},{value:'roman',label:'Roman → number'}]}/><Field id="roman-input" label={v.mode==='number'?'Whole number (1–3999)':'Roman numeral'} value={v.input} onChange={(value)=>update('input',value)} inputMode={v.mode==='number'?'numeric':'text'} error={error}/><Actions submitLabel="Convert" onReset={reset}/></form></CalculatorLayout>
}

function ScientificNotation(){
  const initial={mode:'to-scientific',decimal:'',coefficient:'',exponent:''};const[v,setV]=useState(initial);const[error,setError]=useState('');const[answer,setAnswer]=useState(null)
  const update=(key,value)=>{setV((c)=>({...c,[key]:value}));setError('');setAnswer(null)};const reset=()=>{setV(initial);setError('');setAnswer(null)}
  const submit=(e)=>{e.preventDefault();try{if(v.mode==='to-scientific'){const result=decimalToScientific(v.decimal);setAnswer({primary:result.scientific,items:[{label:'Coefficient',value:result.coefficient},{label:'Exponent',value:String(result.exponent)}]})}else setAnswer({primary:scientificToDecimal(v.coefficient,v.exponent),items:[]});setError('')}catch(err){setAnswer(null);setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title="Scientific notation conversion" primary={answer?.primary||''} items={answer?.items||[]}/>}><form onSubmit={submit} className="space-y-5"><Segmented label="Direction" value={v.mode} onChange={(value)=>update('mode',value)} options={[{value:'to-scientific',label:'Decimal → scientific'},{value:'to-decimal',label:'Scientific → decimal'}]}/>{v.mode==='to-scientific'?<Field id="scientific-decimal" label="Plain decimal" value={v.decimal} onChange={(value)=>update('decimal',value)} inputMode="text" error={error}/>:<div className="grid gap-4 sm:grid-cols-2"><Field id="scientific-coefficient" label="Coefficient" value={v.coefficient} onChange={(value)=>update('coefficient',value)} inputMode="text"/><Field id="scientific-exponent" label="Exponent of 10" value={v.exponent} onChange={(value)=>update('exponent',value)} inputMode="numeric"/></div>}{error&&v.mode==='to-decimal'&&<p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions submitLabel="Convert" onReset={reset}/></form></CalculatorLayout>
}

function Morse(){
  const initial={mode:'encode',input:''};const[v,setV]=useState(initial);const[error,setError]=useState('');const[answer,setAnswer]=useState('')
  const update=(key,value)=>{setV((c)=>({...c,[key]:value}));setError('');setAnswer('')};const reset=()=>{setV(initial);setError('');setAnswer('')}
  const submit=(e)=>{e.preventDefault();try{setAnswer(v.mode==='encode'?textToMorse(v.input):morseToText(v.input));setError('')}catch(err){setAnswer('');setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title={v.mode==='encode'?'Morse code':'Decoded text'} primary={answer}/>}><form onSubmit={submit} className="space-y-5"><Segmented label="Direction" value={v.mode} onChange={(value)=>update('mode',value)} options={[{value:'encode',label:'Text → Morse'},{value:'decode',label:'Morse → text'}]}/><div><label htmlFor="morse-input" className="block text-sm font-semibold text-slate-800 dark:text-slate-200">{v.mode==='encode'?'Text':'Morse tokens'}</label><textarea id="morse-input" rows={6} value={v.input} onChange={(e)=>update('input',e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm text-slate-900 outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"/></div>{error&&<p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions submitLabel="Convert" onReset={reset}/></form></CalculatorLayout>
}
