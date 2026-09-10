function finite(value, name) {
  const number = Number(String(value).trim())
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be a finite number.`)
  return number
}

export function calculateBmi(weightKgInput, heightCmInput) {
  const weightKg = finite(weightKgInput, 'Weight')
  const heightCm = finite(heightCmInput, 'Height')
  if (weightKg <= 0 || weightKg > 500) throw new RangeError('Weight must be greater than 0 and no more than 500 kg.')
  if (heightCm < 80 || heightCm > 250) throw new RangeError('Height must be from 80 cm to 250 cm.')
  const metres = heightCm / 100
  const bmi = weightKg / (metres * metres)
  let category = 'Obesity range'
  if (bmi < 18.5) category = 'Underweight range'
  else if (bmi < 25) category = 'Healthy-weight range'
  else if (bmi < 30) category = 'Overweight range'
  return { bmi, category }
}

export const ACTIVITY_LEVELS = {
  sedentary: { label: 'Sedentary', factor: 1.2 },
  light: { label: 'Lightly active', factor: 1.375 },
  moderate: { label: 'Moderately active', factor: 1.55 },
  very: { label: 'Very active', factor: 1.725 },
  extra: { label: 'Extra active', factor: 1.9 },
}

export function calculateBmr({ sex, age: ageInput, weightKg: weightInput, heightCm: heightInput, activity = 'sedentary' }) {
  const age = finite(ageInput, 'Age')
  const weightKg = finite(weightInput, 'Weight')
  const heightCm = finite(heightInput, 'Height')
  if (!['male', 'female'].includes(sex)) throw new RangeError('Choose male or female for the Mifflin–St Jeor equation.')
  if (!Number.isInteger(age) || age < 18 || age > 120) throw new RangeError('This adult estimate supports whole-number ages from 18 to 120.')
  if (weightKg <= 0 || weightKg > 500) throw new RangeError('Weight must be greater than 0 and no more than 500 kg.')
  if (heightCm < 120 || heightCm > 250) throw new RangeError('Height must be from 120 cm to 250 cm.')
  const activityInfo = ACTIVITY_LEVELS[activity]
  if (!activityInfo) throw new RangeError('Choose a supported activity level.')
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161)
  const tdee = bmr * activityInfo.factor
  return { bmr, tdee, activity: activityInfo.label, factor: activityInfo.factor }
}

export function calculateIdealWeight(heightCmInput, sex) {
  const heightCm = finite(heightCmInput, 'Height')
  if (!['male', 'female'].includes(sex)) throw new RangeError('Choose male or female for these historical equations.')
  if (heightCm < 152.4 || heightCm > 230) throw new RangeError('These formulas are intended for adult heights from 152.4 cm (5 ft) to 230 cm.')
  const inchesOverFiveFeet = heightCm / 2.54 - 60
  const formulas = sex === 'male'
    ? {
        Devine: 50 + 2.3 * inchesOverFiveFeet,
        Robinson: 52 + 1.9 * inchesOverFiveFeet,
        Miller: 56.2 + 1.41 * inchesOverFiveFeet,
        Hamwi: 48 + 2.7 * inchesOverFiveFeet,
      }
    : {
        Devine: 45.5 + 2.3 * inchesOverFiveFeet,
        Robinson: 49 + 1.7 * inchesOverFiveFeet,
        Miller: 53.1 + 1.36 * inchesOverFiveFeet,
        Hamwi: 45.5 + 2.2 * inchesOverFiveFeet,
      }
  const values = Object.values(formulas)
  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  return { formulas, average, min: Math.min(...values), max: Math.max(...values) }
}
