'use client'

import { useState } from 'react'
import { Actions, CalculatorLayout, Field, ResultPanel } from '@/components/tooliyapa/FormPrimitives'
import { calculateGpa } from '@/lib/gpa'
import { formatNumber } from '@/lib/math-extra'

const blankCourse = () => ({ points: '', credits: '' })

export default function GpaCalculator() {
  const [scale,setScale]=useState('4'); const [courses,setCourses]=useState([blankCourse(),blankCourse(),blankCourse()]); const[error,setError]=useState('');const[answer,setAnswer]=useState(null)
  const clear=()=>{setError('');setAnswer(null)}
  const updateCourse=(index,key,value)=>{setCourses((current)=>current.map((course,i)=>i===index?{...course,[key]:value}:course));clear()}
  const addCourse=()=>{if(courses.length<50){setCourses((current)=>[...current,blankCourse()]);clear()}}
  const removeCourse=(index)=>{if(courses.length>1){setCourses((current)=>current.filter((_,i)=>i!==index));clear()}}
  const reset=()=>{setScale('4');setCourses([blankCourse(),blankCourse(),blankCourse()]);clear()}
  const submit=(e)=>{e.preventDefault();try{const active=courses.filter((course)=>String(course.points).trim()||String(course.credits).trim());setAnswer(calculateGpa(active,scale));setError('')}catch(err){setAnswer(null);setError(err.message)}}
  return <CalculatorLayout result={<ResultPanel title="GPA result" primary={answer ? `${formatNumber(answer.gpa,6)} / ${formatNumber(answer.scale,6)}` : ''} items={answer ? [{label:'Total credits',value:formatNumber(answer.totalCredits,8)},{label:'Weighted grade points',value:formatNumber(answer.weightedPoints,8)}] : []} note="Enter grade points on the scale your institution actually uses. Policies for repeated, weighted, transfer, or pass/fail courses can differ." />}><form onSubmit={submit} className="space-y-5"><Field id="gpa-scale" label="GPA scale" value={scale} onChange={(value)=>{setScale(value);clear()}} hint="Examples: 4, 5, or 10" /><div className="space-y-3">{courses.map((course,index)=><div key={index} className="grid gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><Field id={`points-${index}`} label={`Course ${index+1} grade points`} value={course.points} onChange={(value)=>updateCourse(index,'points',value)} /><Field id={`credits-${index}`} label="Credits / weight" value={course.credits} onChange={(value)=>updateCourse(index,'credits',value)} /><button type="button" onClick={()=>removeCourse(index)} disabled={courses.length===1} className="min-h-12 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300">Remove</button></div>)}</div><button type="button" onClick={addCourse} disabled={courses.length>=50} className="min-h-11 rounded-xl border border-teal-300 px-4 text-sm font-semibold text-teal-800 disabled:opacity-40 dark:border-teal-800 dark:text-teal-300">Add course</button>{error&&<p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>}<Actions onReset={reset}/></form></CalculatorLayout>
}
