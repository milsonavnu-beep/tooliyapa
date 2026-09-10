'use client'

import { useMemo, useState } from 'react'
import { Actions, CalculatorLayout, Field, ResultPanel, SelectField } from '@/components/tooliyapa/FormPrimitives'
import { convertUnit, formatConverted, TEMPERATURE_UNITS, UNIT_CONVERTERS } from '@/lib/converter-units'

export default function UnitConverter({ tool }) {
  const temperature = tool === 'temperature'
  const config = temperature ? { title:'Temperature Converter', defaults:['c','f'], units:TEMPERATURE_UNITS } : UNIT_CONVERTERS[tool]
  if (!config) throw new Error(`Unknown unit converter: ${tool}`)
  const unitOptions = useMemo(()=>Object.entries(config.units).map(([value,info])=>({value,label:`${info.name} (${info.symbol})`})),[config])
  const [value,setValue]=useState(''); const[from,setFrom]=useState(config.defaults[0]); const[to,setTo]=useState(config.defaults[1]); const[error,setError]=useState(''); const[answer,setAnswer]=useState(null)
  const clear=()=>{setError('');setAnswer(null)}
  const reset=()=>{setValue('');setFrom(config.defaults[0]);setTo(config.defaults[1]);clear()}
  const swap=()=>{setFrom(to);setTo(from);clear()}
  const submit=(e)=>{e.preventDefault();try{setAnswer(convertUnit(tool,value,from,to));setError('')}catch(err){setAnswer(null);setError(err.message)}}
  const fromInfo=config.units[from], toInfo=config.units[to]
  return <CalculatorLayout result={<ResultPanel title="Converted value" primary={answer===null?'':`${formatConverted(answer)} ${toInfo.symbol}`} items={answer!==null?[{label:'Source',value:`${value} ${fromInfo.symbol}`},{label:'Direction',value:`${fromInfo.name} → ${toInfo.name}`}]:[]} note={temperature?'Temperatures below absolute zero are rejected.':'Conversion uses one shared base unit and the stated unit factors.'} />}><form onSubmit={submit} className="space-y-5"><Field id={`${tool}-value`} label="Value" value={value} onChange={(next)=>{setValue(next);clear()}} error={error} /><div className="grid gap-4 sm:grid-cols-2"><SelectField id={`${tool}-from`} label="From" value={from} onChange={(next)=>{setFrom(next);clear()}} options={unitOptions}/><SelectField id={`${tool}-to`} label="To" value={to} onChange={(next)=>{setTo(next);clear()}} options={unitOptions}/></div><button type="button" onClick={swap} className="min-h-11 rounded-xl border border-cyan-300 px-4 text-sm font-semibold text-cyan-800 dark:border-cyan-800 dark:text-cyan-300">Swap units</button><Actions submitLabel="Convert" onReset={reset}/></form></CalculatorLayout>
}
