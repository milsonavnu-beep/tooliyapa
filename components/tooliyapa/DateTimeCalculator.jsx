'use client'

import { useEffect, useState } from 'react'
import { Actions, CalculatorLayout, Field, ResultPanel } from '@/components/tooliyapa/FormPrimitives'
import { calculateAge, calculateCountdown, calculateDateDifference, calculateTimeDuration } from '@/lib/date-calculators'
import { formatNumber } from '@/lib/math-extra'

function todayString() { const now = new Date(); const offset = now.getTimezoneOffset() * 60000; return new Date(now - offset).toISOString().slice(0,10) }

export default function DateTimeCalculator({ tool }) {
  if (tool === 'age') return <Age />
  if (tool === 'date-difference') return <DateDifference />
  if (tool === 'countdown') return <Countdown />
  return <Duration />
}

function Age() {
  const [birth, setBirth] = useState(''); const [asOf, setAsOf] = useState(todayString()); const [error, setError] = useState(''); const [answer, setAnswer] = useState(null)
  const clear = () => { setError(''); setAnswer(null) }
  const reset = () => { setBirth(''); setAsOf(todayString()); clear() }
  const submit = (e) => { e.preventDefault(); try { setAnswer(calculateAge(birth, asOf)); setError('') } catch (err) { setAnswer(null); setError(err.message) } }
  return <CalculatorLayout result={<ResultPanel title="Age result" primary={answer ? `${answer.years} years, ${answer.months} months, ${answer.days} days` : ''} items={answer ? [{label:'Total days',value:answer.totalDays.toLocaleString('en-US')},{label:'Total weeks',value:formatNumber(answer.totalWeeks,6)},{label:'Total hours',value:answer.totalHours.toLocaleString('en-US')}] : []} note="Calendar years and months are counted first; total days use date-only UTC midnights so daylight-saving changes do not alter the day count." />}><form onSubmit={submit} className="space-y-5"><Field id="birth-date" type="date" inputMode="none" label="Birth date" value={birth} onChange={(value) => { setBirth(value); clear() }} /><Field id="as-of-date" type="date" inputMode="none" label="Calculate age on" value={asOf} onChange={(value) => { setAsOf(value); clear() }} />{error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset} /></form></CalculatorLayout>
}

function DateDifference() {
  const initial = { start: '', end: '' }; const [v,setV] = useState(initial); const [error,setError] = useState(''); const [answer,setAnswer] = useState(null)
  const update = (key,value) => { setV((c)=>({...c,[key]:value})); setError(''); setAnswer(null) }; const reset=()=>{setV(initial);setError('');setAnswer(null)}
  const submit=(e)=>{e.preventDefault();try{setAnswer(calculateDateDifference(v.start,v.end));setError('')}catch(err){setAnswer(null);setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title="Date difference" primary={answer ? `${answer.years} years, ${answer.months} months, ${answer.days} days` : ''} items={answer ? [{label:'Total days',value:answer.totalDays.toLocaleString('en-US')},{label:'Weeks + days',value:`${answer.weeks} weeks, ${answer.extraDays} days`},{label:'Direction',value:answer.direction === 1 ? 'End is on/after start' : 'End is before start'}] : []} />}><form onSubmit={submit} className="space-y-5"><Field id="difference-start" type="date" inputMode="none" label="Start date" value={v.start} onChange={(value)=>update('start',value)} /><Field id="difference-end" type="date" inputMode="none" label="End date" value={v.end} onChange={(value)=>update('end',value)} />{error&&<p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset}/></form></CalculatorLayout>
}

function Countdown() {
  const [target,setTarget]=useState(''); const [error,setError]=useState(''); const [answer,setAnswer]=useState(null)
  useEffect(()=>{ if(!target||error)return undefined; const tick=()=>{try{setAnswer(calculateCountdown(target))}catch(err){setAnswer(null);setError(err.message)}}; tick(); const id=setInterval(tick,1000); return()=>clearInterval(id)},[target,error])
  const reset=()=>{setTarget('');setError('');setAnswer(null)}
  const submit=(e)=>{e.preventDefault();try{setAnswer(calculateCountdown(target));setError('')}catch(err){setAnswer(null);setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title="Live countdown" primary={answer ? `${answer.days}d ${answer.hours}h ${answer.minutes}m ${answer.seconds}s` : ''} items={answer ? [{label:'Total seconds',value:answer.totalSeconds.toLocaleString('en-US')}] : []} note="The countdown uses your device clock and local browser timezone." />}><form onSubmit={submit} className="space-y-5"><Field id="countdown-target" type="datetime-local" inputMode="none" label="Future date and time" value={target} onChange={(value)=>{setTarget(value);setError('');setAnswer(null)}} />{error&&<p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions submitLabel="Start countdown" onReset={reset}/></form></CalculatorLayout>
}

function Duration() {
  const initial={start:'',end:''}; const [v,setV]=useState(initial);const[error,setError]=useState('');const[answer,setAnswer]=useState(null)
  const update=(key,value)=>{setV((c)=>({...c,[key]:value}));setError('');setAnswer(null)}; const reset=()=>{setV(initial);setError('');setAnswer(null)}
  const submit=(e)=>{e.preventDefault();try{setAnswer(calculateTimeDuration(v.start,v.end));setError('')}catch(err){setAnswer(null);setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title="Elapsed duration" primary={answer ? `${answer.days}d ${answer.hours}h ${answer.minutes}m ${answer.seconds}s` : ''} items={answer ? [{label:'Total hours',value:formatNumber(answer.totalHours,8)},{label:'Total minutes',value:formatNumber(answer.totalMinutes,8)}] : []} note="Both date-time values are interpreted in the browser’s local timezone." />}><form onSubmit={submit} className="space-y-5"><Field id="duration-start" type="datetime-local" inputMode="none" label="Start date and time" value={v.start} onChange={(value)=>update('start',value)} /><Field id="duration-end" type="datetime-local" inputMode="none" label="End date and time" value={v.end} onChange={(value)=>update('end',value)} />{error&&<p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset}/></form></CalculatorLayout>
}
