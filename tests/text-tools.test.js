import { describe, expect, it } from 'vitest'
import fs from 'fs'
import { AVAILABLE_TEXT_TOOLS, TEXT_PAGES } from '../lib/text-tools.js'
import {
  analyzeText, convertCase, diffText, findAndReplace, generateLorem, grammarWritingIssues,
  readabilityAnalysis, reverseText, slugify, sortLines, splitText, summarizeExtractively,
  textSimilarity, textStats, wordFrequency,
} from '../lib/text-utils.js'
import { PUBLIC_ROUTES } from '../lib/site.js'

describe('text tool catalog',()=>{
  it('publishes exactly the approved 15 browser text tools',()=>{expect(AVAILABLE_TEXT_TOOLS).toHaveLength(15);expect(Object.keys(TEXT_PAGES)).toHaveLength(15);for(const tool of AVAILABLE_TEXT_TOOLS){expect(PUBLIC_ROUTES).toContain(tool.href);expect(fs.existsSync(`app${tool.href}/page.js`)).toBe(true);expect(tool.about.length).toBeGreaterThan(80);expect(tool.limitations.length).toBeGreaterThan(60)}})
  it('keeps sensitive claims narrowly framed',()=>{const all=AVAILABLE_TEXT_TOOLS.map(({title,description,about,limitations})=>`${title} ${description} ${about} ${limitations}`).join('\n');expect(all).toMatch(/extractive/i);expect(all).toMatch(/not generative AI/i);expect(all).toMatch(/not a plagiarism detector/i);expect(all).toMatch(/not a comprehensive grammar engine/i);expect(all).not.toMatch(/searches the web|detects plagiarism|AI grammar checker/i)})
})

describe('text utility calculations',()=>{
  it('counts and transforms text predictably',()=>{expect(textStats('Hello world.\n\nAgain!')).toMatchObject({words:3,sentences:2,paragraphs:2,lines:3});expect(convertCase('Hello WORLD','lower')).toBe('hello world');expect(convertCase('Hello WORLD','toggle')).toBe('hELLO world')})
  it('finds, replaces, sorts, splits, reverses, and slugifies',()=>{expect(findAndReplace('Cat cat scatter','cat','dog',{caseSensitive:false,wholeWord:true})).toEqual({output:'dog dog scatter',matches:2});expect(sortLines('10\n2\n2\n',{numeric:true,unique:true,removeEmpty:true})).toBe('2\n10');expect(splitText('one two three four',{mode:'words',chunkSize:2})).toEqual(['one two','three four']);expect(reverseText('one two three','words')).toBe('three two one');expect(slugify('Café & Tools')).toBe('cafe-and-tools')})
  it('produces bounded analysis, readability, frequencies, and lorem text',()=>{const analysis=analyzeText('Tools help people. Tools save time.');expect(analysis.words).toBe(6);expect(analysis.topWords[0]).toEqual({word:'tools',count:2});expect(wordFrequency('red red blue',{limit:5})[0]).toEqual({word:'red',count:2});expect(readabilityAnalysis('This is a simple sentence. This is another simple sentence.').available).toBe(true);expect(generateLorem({unit:'paragraphs',count:2}).split('\n\n')).toHaveLength(2)})
  it('uses extractive sentences rather than inventing summary text',()=>{const source='Apples are red. Bananas are yellow. Apples grow on trees. Apples can be sweet.';const summary=summarizeExtractively(source,2);expect(summary).toHaveLength(2);for(const sentence of summary)expect(source).toContain(sentence)})
  it('returns transparent writing issues and local similarity only',()=>{const issues=grammarWritingIssues('this is is very very very text');expect(issues.some(({type})=>type==='Repeated word')).toBe(true);expect(issues.some(({type})=>type==='Capitalization')).toBe(true);const similarity=textSimilarity('one two three four','zero two three four',3);expect(similarity.similarity).toBeGreaterThan(0);expect(similarity.commonPhrases).toContain('two three four')})
  it('diffs lines and rejects excessive diff matrices',()=>{expect(diffText('a\nb','a\nc')).toEqual([{type:'same',text:'a'},{type:'remove',text:'b'},{type:'add',text:'c'}]);const tooMany=Array.from({length:401},(_,i)=>String(i)).join('\n');expect(()=>diffText(tooMany,'x')).toThrow(/400 lines/)})
  it('rejects oversized text before processing',()=>{expect(()=>textStats('x'.repeat(200001))).toThrow(/too long/)})
})
