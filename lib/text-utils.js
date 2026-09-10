const MAX_TEXT_LENGTH = 200000
const MAX_DIFF_LINES = 400
const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','been','but','by','for','from','had','has','have','he','her','hers','him','his',
  'i','if','in','into','is','it','its','me','my','no','not','of','on','or','our','ours','she','so','that','the','their',
  'theirs','them','then','there','these','they','this','those','to','too','us','was','we','were','what','when','where',
  'which','who','will','with','would','you','your','yours'
])

function ensureText(value, label = 'Text') {
  if (typeof value !== 'string') throw new TypeError(`${label} must be text.`)
  if (value.length > MAX_TEXT_LENGTH) throw new RangeError(`${label} is too long for this browser tool.`)
  return value
}

export function getWords(text) {
  ensureText(text)
  return text.match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu) || []
}

export function getSentences(text) {
  ensureText(text)
  return (text.match(/[^.!?\n]+[.!?]?/g) || []).map((value) => value.trim()).filter(Boolean)
}

export function textStats(text) {
  ensureText(text)
  const words = getWords(text)
  const sentences = getSentences(text)
  const trimmed = text.trim()
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n+/).filter((value) => value.trim()).length : 0
  const characters = Array.from(text).length
  const charactersNoSpaces = Array.from(text).filter((character) => !/\s/u.test(character)).length
  const lines = text ? text.split(/\r?\n/).length : 0
  return {
    words: words.length,
    characters,
    charactersNoSpaces,
    sentences: sentences.length,
    paragraphs,
    lines,
    readingMinutes: words.length / 200,
    speakingMinutes: words.length / 130,
  }
}

export function convertCase(text, mode) {
  ensureText(text)
  switch (mode) {
    case 'upper': return text.toLocaleUpperCase()
    case 'lower': return text.toLocaleLowerCase()
    case 'title':
      return text.toLocaleLowerCase().replace(/\p{L}[\p{L}\p{M}'’]*/gu, (word) => {
        const chars = Array.from(word)
        return `${chars[0]?.toLocaleUpperCase() || ''}${chars.slice(1).join('')}`
      })
    case 'sentence': {
      const lowered = text.toLocaleLowerCase()
      return lowered.replace(/(^|[.!?]\s+|\n+)(\p{L})/gu, (_, prefix, letter) => `${prefix}${letter.toLocaleUpperCase()}`)
    }
    case 'toggle':
      return Array.from(text).map((character) => {
        const upper = character.toLocaleUpperCase()
        const lower = character.toLocaleLowerCase()
        if (upper === lower) return character
        return character === upper ? lower : upper
      }).join('')
    default: throw new RangeError('Choose a supported case conversion.')
  }
}

function syllablesInWord(word) {
  const cleaned = word.toLocaleLowerCase().replace(/[^a-z]/g, '')
  if (!cleaned) return 0
  if (cleaned.length <= 3) return 1
  const reduced = cleaned.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/i, '').replace(/^y/i, '')
  const groups = reduced.match(/[aeiouy]{1,2}/g)
  return Math.max(1, groups ? groups.length : 1)
}

export function readabilityAnalysis(text) {
  ensureText(text)
  const words = getWords(text)
  const sentences = getSentences(text)
  if (words.length < 3 || sentences.length === 0) return { available: false, reason: 'Enter at least a few words in one or more sentences.' }
  const latinWords = words.filter((word) => /^[A-Za-z'-]+$/.test(word))
  if (latinWords.length < Math.max(3, Math.ceil(words.length * 0.6))) return { available: false, reason: 'These readability formulas are designed for predominantly English text.' }
  const syllables = latinWords.reduce((sum, word) => sum + syllablesInWord(word), 0)
  const wordCount = latinWords.length
  const sentenceCount = Math.max(1, sentences.length)
  const ease = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount)
  const grade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllables / wordCount) - 15.59
  return { available: true, fleschReadingEase: Math.round(ease * 10) / 10, fleschKincaidGrade: Math.max(0, Math.round(grade * 10) / 10), words: wordCount, sentences: sentenceCount, syllables, averageSentenceWords: Math.round((wordCount / sentenceCount) * 10) / 10 }
}

function frequencyEntries(text, { limit = 20, minLength = 2, includeStopWords = false } = {}) {
  ensureText(text)
  const counts = new Map()
  for (const raw of getWords(text)) {
    const word = raw.toLocaleLowerCase()
    if (word.length < minLength || (!includeStopWords && STOP_WORDS.has(word))) continue
    counts.set(word, (counts.get(word) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, Math.max(1, Math.min(100, limit))).map(([word, count]) => ({ word, count }))
}

export function wordFrequency(text, options) { return frequencyEntries(text, options) }

export function analyzeText(text) {
  ensureText(text)
  const stats = textStats(text)
  const words = getWords(text)
  const normalized = words.map((word) => word.toLocaleLowerCase())
  const unique = new Set(normalized)
  const topWords = frequencyEntries(text, { limit: 12, minLength: 2 })
  const longestWords = [...new Set(words)].sort((a, b) => Array.from(b).length - Array.from(a).length || a.localeCompare(b)).slice(0, 8)
  const totalWordCharacters = words.reduce((sum, word) => sum + Array.from(word).length, 0)
  return { ...stats, uniqueWords: unique.size, lexicalDiversity: words.length ? unique.size / words.length : 0, averageWordLength: words.length ? totalWordCharacters / words.length : 0, averageSentenceWords: stats.sentences ? stats.words / stats.sentences : 0, topWords, longestWords }
}

function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

export function findAndReplace(text, find, replacement = '', options = {}) {
  ensureText(text); ensureText(find, 'Find text'); ensureText(replacement, 'Replacement text')
  if (!find) throw new RangeError('Enter text to find.')
  const { caseSensitive = false, wholeWord = false } = options
  const escaped = escapeRegExp(find)
  const source = wholeWord ? `\\b${escaped}\\b` : escaped
  const regex = new RegExp(source, caseSensitive ? 'g' : 'gi')
  let matches = 0
  const output = text.replace(regex, () => { matches += 1; return replacement })
  return { output, matches }
}

export function sortLines(text, options = {}) {
  ensureText(text)
  const { direction = 'asc', numeric = false, caseSensitive = false, unique = false, trim = false, removeEmpty = false } = options
  let lines = text.split(/\r?\n/)
  if (trim) lines = lines.map((line) => line.trim())
  if (removeEmpty) lines = lines.filter((line) => line.length > 0)
  if (unique) {
    const seen = new Set()
    lines = lines.filter((line) => { const key = caseSensitive ? line : line.toLocaleLowerCase(); if (seen.has(key)) return false; seen.add(key); return true })
  }
  lines.sort((a, b) => {
    let result
    if (numeric) {
      const na = Number(a); const nb = Number(b)
      result = Number.isFinite(na) && Number.isFinite(nb) ? na - nb : a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'variant' : 'base', numeric: true })
    } else result = a.localeCompare(b, undefined, { sensitivity: caseSensitive ? 'variant' : 'base', numeric: false })
    return direction === 'desc' ? -result : result
  })
  return lines.join('\n')
}

export function splitText(text, { mode = 'delimiter', delimiter = ',', chunkSize = 100 } = {}) {
  ensureText(text)
  let parts
  if (mode === 'delimiter') { if (!delimiter) throw new RangeError('Enter a delimiter.'); parts = text.split(delimiter) }
  else if (mode === 'lines') parts = text.split(/\r?\n/)
  else if (mode === 'words') { const words = text.trim() ? text.trim().split(/\s+/) : []; const size = Math.max(1, Math.min(1000, Number(chunkSize) || 1)); parts = []; for (let i = 0; i < words.length; i += size) parts.push(words.slice(i, i + size).join(' ')) }
  else if (mode === 'characters') { const characters = Array.from(text); const size = Math.max(1, Math.min(10000, Number(chunkSize) || 1)); parts = []; for (let i = 0; i < characters.length; i += size) parts.push(characters.slice(i, i + size).join('')) }
  else throw new RangeError('Choose a supported split mode.')
  if (parts.length > 5000) throw new RangeError('This split would create too many parts. Use a larger chunk or a less frequent delimiter.')
  return parts
}

export function reverseText(text, mode = 'characters') {
  ensureText(text)
  if (mode === 'characters') return Array.from(text).reverse().join('')
  if (mode === 'words') return text.trim() ? text.trim().split(/\s+/).reverse().join(' ') : ''
  if (mode === 'lines') return text.split(/\r?\n/).reverse().join('\n')
  throw new RangeError('Choose characters, words, or lines.')
}

export function slugify(text, separator = '-') {
  ensureText(text)
  if (!['-', '_'].includes(separator)) throw new RangeError('Choose "-" or "_" as the separator.')
  const escapedSeparator = separator === '-' ? '\\-' : '_'
  return text.normalize('NFKD').replace(/\p{M}+/gu, '').toLocaleLowerCase().replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, separator).replace(new RegExp(`^[${escapedSeparator}]+|[${escapedSeparator}]+$`, 'g'), '').replace(new RegExp(`[${escapedSeparator}]{2,}`, 'g'), separator)
}

const LOREM_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
  'Donec sed odio dui, et commodo luctus, nisi erat porttitor ligula.', 'Maecenas faucibus mollis interdum, sed posuere consectetur est at lobortis.',
  'Cras mattis consectetur purus sit amet fermentum.', 'Aenean lacinia bibendum nulla sed consectetur.',
  'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', 'Nullam quis risus eget urna mollis ornare vel eu leo.'
]

export function generateLorem({ unit = 'paragraphs', count = 3 } = {}) {
  const amount = Math.max(1, Math.min(1000, Math.floor(Number(count) || 1)))
  if (unit === 'sentences') return Array.from({ length: amount }, (_, i) => LOREM_SENTENCES[i % LOREM_SENTENCES.length]).join(' ')
  if (unit === 'paragraphs') return Array.from({ length: Math.min(50, amount) }, (_, p) => Array.from({ length: 4 }, (_, i) => LOREM_SENTENCES[(p * 4 + i) % LOREM_SENTENCES.length]).join(' ')).join('\n\n')
  if (unit === 'words') { const source = LOREM_SENTENCES.join(' ').replace(/[.,]/g, '').split(/\s+/); return Array.from({ length: amount }, (_, i) => source[i % source.length]).join(' ') }
  throw new RangeError('Choose words, sentences, or paragraphs.')
}

export function summarizeExtractively(text, sentenceCount = 5) {
  ensureText(text)
  const sentences = getSentences(text)
  if (!sentences.length) return []
  const take = Math.max(1, Math.min(sentences.length, Math.floor(Number(sentenceCount) || 1)))
  const frequencies = new Map()
  sentences.forEach((sentence) => { for (const raw of getWords(sentence)) { const word = raw.toLocaleLowerCase(); if (word.length < 2 || STOP_WORDS.has(word)) continue; frequencies.set(word, (frequencies.get(word) || 0) + 1) } })
  const scored = sentences.map((sentence, index) => { const words = getWords(sentence).map((word) => word.toLocaleLowerCase()).filter((word) => !STOP_WORDS.has(word)); const score = words.length ? words.reduce((sum, word) => sum + (frequencies.get(word) || 0), 0) / words.length : 0; return { sentence, index, score } })
  return scored.slice().sort((a, b) => b.score - a.score || a.index - b.index).slice(0, take).sort((a, b) => a.index - b.index).map(({ sentence }) => sentence)
}

const COMMON_MISSPELLINGS = new Map([
  ['definatly','definitely'],['definately','definitely'],['seperate','separate'],['recieve','receive'],['acheive','achieve'],['accomodate','accommodate'],['embarass','embarrass'],['occured','occurred'],['tommorow','tomorrow'],['calender','calendar'],['goverment','government'],['neccessary','necessary'],['publically','publicly'],['reccommend','recommend'],['wierd','weird'],['writting','writing']
])
const OVERUSED = new Set(['very','really','literally','actually','basically','amazing','incredible','awesome'])

export function grammarWritingIssues(text) {
  ensureText(text)
  const issues = []
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    const lineNumber = index + 1; const trimmed = line.trim(); if (!trimmed) return
    const repeated = [...trimmed.matchAll(/\b([A-Za-z]+)\s+\1\b/gi)]
    repeated.forEach((match) => issues.push({ type: 'Repeated word', line: lineNumber, message: `Possible repeated word: "${match[1]}".`, excerpt: trimmed.slice(0, 120) }))
    if (/ {2,}/.test(line)) issues.push({ type: 'Spacing', line: lineNumber, message: 'Multiple consecutive spaces found.', excerpt: trimmed.slice(0, 120) })
    if (/^[a-z]/.test(trimmed)) issues.push({ type: 'Capitalization', line: lineNumber, message: 'This line starts with a lowercase letter.', excerpt: trimmed.slice(0, 120) })
    if (trimmed.length >= 12 && /[A-Za-z0-9'")\]]$/.test(trimmed)) issues.push({ type: 'Punctuation', line: lineNumber, message: 'This line may be missing terminal punctuation.', excerpt: trimmed.slice(0, 120) })
  })
  for (const match of text.matchAll(/\b[A-Za-z]+\b/g)) {
    const lower = match[0].toLocaleLowerCase()
    if (COMMON_MISSPELLINGS.has(lower)) issues.push({ type: 'Spelling', line: text.slice(0, match.index).split(/\r?\n/).length, message: `Possible misspelling: "${match[0]}" → "${COMMON_MISSPELLINGS.get(lower)}".`, excerpt: text.slice(Math.max(0, match.index - 25), match.index + match[0].length + 25).replace(/\s+/g, ' ').trim() })
  }
  const counts = new Map()
  for (const raw of getWords(text)) { const word = raw.toLocaleLowerCase(); if (OVERUSED.has(word)) counts.set(word, (counts.get(word) || 0) + 1) }
  for (const [word, count] of counts) if (count >= 3) issues.push({ type: 'Style', line: null, message: `"${word}" appears ${count} times. Consider whether every use adds meaning.`, excerpt: '' })
  return issues.slice(0, 300)
}

function normalizedTokens(text) { return getWords(text).map((word) => word.toLocaleLowerCase()) }
function ngramSet(tokens, size) { if (!tokens.length) return new Set(); const n = Math.min(Math.max(1, size), tokens.length); const set = new Set(); for (let i = 0; i <= tokens.length - n; i += 1) set.add(tokens.slice(i, i + n).join(' ')); return set }

export function textSimilarity(textA, textB, gramSize = 3) {
  ensureText(textA, 'First text'); ensureText(textB, 'Second text')
  const a = normalizedTokens(textA); const b = normalizedTokens(textB)
  if (!a.length || !b.length) return { similarity: 0, commonPhrases: [], comparedGramSize: gramSize }
  const size = Math.min(Math.max(1, Math.floor(Number(gramSize) || 3)), a.length, b.length)
  const setA = ngramSet(a, size); const setB = ngramSet(b, size); const common = [...setA].filter((phrase) => setB.has(phrase)); const union = new Set([...setA, ...setB])
  return { similarity: union.size ? Math.round((common.length / union.size) * 1000) / 10 : 0, commonPhrases: common.slice(0, 30), comparedGramSize: size }
}

export function diffText(textA, textB) {
  ensureText(textA, 'Original text'); ensureText(textB, 'Changed text')
  const a = textA.split(/\r?\n/); const b = textB.split(/\r?\n/)
  if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES) throw new RangeError(`Text Diff supports up to ${MAX_DIFF_LINES} lines per side to keep browser memory bounded.`)
  const matrix = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1))
  for (let i = a.length - 1; i >= 0; i -= 1) for (let j = b.length - 1; j >= 0; j -= 1) matrix[i][j] = a[i] === b[j] ? matrix[i + 1][j + 1] + 1 : Math.max(matrix[i + 1][j], matrix[i][j + 1])
  const operations = []; let i = 0; let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { operations.push({ type: 'same', text: a[i] }); i += 1; j += 1 }
    else if (matrix[i + 1][j] >= matrix[i][j + 1]) { operations.push({ type: 'remove', text: a[i] }); i += 1 }
    else { operations.push({ type: 'add', text: b[j] }); j += 1 }
  }
  while (i < a.length) operations.push({ type: 'remove', text: a[i++] })
  while (j < b.length) operations.push({ type: 'add', text: b[j++] })
  return operations
}
