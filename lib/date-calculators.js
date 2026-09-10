const DAY_MS = 86400000

function parseDateOnly(value, name) {
  const text = String(value).trim()
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text)
  if (!match) throw new TypeError(`${name} must use a valid YYYY-MM-DD date.`)
  const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError(`${name} is not a valid calendar date.`)
  return date
}

function daysInMonth(year, monthIndex) { return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate() }
function addYearsClamped(date, years) {
  const year = date.getUTCFullYear() + years
  const month = date.getUTCMonth()
  const day = Math.min(date.getUTCDate(), daysInMonth(year, month))
  return new Date(Date.UTC(year, month, day))
}
function addMonthsClamped(date, months) {
  const sourceYear = date.getUTCFullYear(); const sourceMonth = date.getUTCMonth()
  const total = sourceYear * 12 + sourceMonth + months
  const year = Math.floor(total / 12); const month = ((total % 12) + 12) % 12
  const day = Math.min(date.getUTCDate(), daysInMonth(year, month))
  return new Date(Date.UTC(year, month, day))
}

function calendarBreakdown(start, end) {
  let years = 0
  while (years < 500 && addYearsClamped(start, years + 1) <= end) years += 1
  let cursor = addYearsClamped(start, years)
  let months = 0
  while (months < 12 && addMonthsClamped(cursor, months + 1) <= end) months += 1
  cursor = addMonthsClamped(cursor, months)
  const days = Math.round((end - cursor) / DAY_MS)
  return { years, months, days }
}

export function calculateAge(birthDateInput, asOfInput) {
  const birth = parseDateOnly(birthDateInput, 'Birth date')
  const asOf = parseDateOnly(asOfInput, 'As-of date')
  if (birth > asOf) throw new RangeError('Birth date must not be after the as-of date.')
  const totalDays = Math.round((asOf - birth) / DAY_MS)
  return { ...calendarBreakdown(birth, asOf), totalDays, totalWeeks: totalDays / 7, totalHours: totalDays * 24 }
}

export function calculateDateDifference(startInput, endInput) {
  const first = parseDateOnly(startInput, 'Start date')
  const second = parseDateOnly(endInput, 'End date')
  const direction = second >= first ? 1 : -1
  const start = direction === 1 ? first : second
  const end = direction === 1 ? second : first
  const totalDays = Math.round((end - start) / DAY_MS)
  return { ...calendarBreakdown(start, end), totalDays, weeks: Math.floor(totalDays / 7), extraDays: totalDays % 7, direction }
}

function parseDateTime(value, name) {
  const text = String(value).trim()
  if (!text) throw new TypeError(`Enter ${name.toLowerCase()}.`)
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) throw new RangeError(`${name} is not a valid date and time.`)
  return date
}

export function calculateCountdown(targetInput, nowInput = Date.now()) {
  const target = parseDateTime(targetInput, 'Target date and time')
  const now = nowInput instanceof Date ? nowInput : new Date(nowInput)
  if (Number.isNaN(now.getTime())) throw new RangeError('Current time is invalid.')
  const milliseconds = target - now
  if (milliseconds <= 0) throw new RangeError('Target date and time must be in the future.')
  const totalSeconds = Math.floor(milliseconds / 1000)
  return { milliseconds, totalSeconds, days: Math.floor(totalSeconds / 86400), hours: Math.floor((totalSeconds % 86400) / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60 }
}

export function calculateTimeDuration(startInput, endInput) {
  const start = parseDateTime(startInput, 'Start date and time')
  const end = parseDateTime(endInput, 'End date and time')
  const milliseconds = end - start
  if (milliseconds < 0) throw new RangeError('End date and time must not be before the start.')
  const totalMinutes = milliseconds / 60000
  const totalSeconds = milliseconds / 1000
  return { milliseconds, totalMinutes, totalHours: milliseconds / 3600000, days: Math.floor(totalSeconds / 86400), hours: Math.floor((totalSeconds % 86400) / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: Math.floor(totalSeconds % 60) }
}
