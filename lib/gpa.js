function finite(value, name) {
  const number = Number(String(value).trim())
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be a finite number.`)
  return number
}

export function calculateGpa(courses, scaleInput = 4) {
  const scale = finite(scaleInput, 'GPA scale')
  if (scale <= 0 || scale > 20) throw new RangeError('GPA scale must be greater than 0 and no more than 20.')
  if (!Array.isArray(courses) || !courses.length) throw new TypeError('Enter at least one course.')
  if (courses.length > 50) throw new RangeError('Use at most 50 courses at a time.')
  let weighted = 0
  let totalCredits = 0
  courses.forEach((course, index) => {
    const points = finite(course.points, `Course ${index + 1} grade points`)
    const credits = finite(course.credits, `Course ${index + 1} credits`)
    if (points < 0 || points > scale) throw new RangeError(`Course ${index + 1} grade points must be from 0 to ${scale}.`)
    if (credits <= 0 || credits > 100) throw new RangeError(`Course ${index + 1} credits must be greater than 0 and no more than 100.`)
    weighted += points * credits
    totalCredits += credits
  })
  const gpa = weighted / totalCredits
  return { gpa, totalCredits, weightedPoints: weighted, scale }
}
