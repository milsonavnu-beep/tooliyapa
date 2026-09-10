export const MORE_CALCULATOR_PAGES = {
  scientific: {
    title: 'Scientific Calculator', pathname: '/calculators/scientific', eyebrow: 'Math calculator',
    description: 'Use trigonometry, logarithms, roots, powers, factorials, and other scientific operations with clear angle-unit controls.',
    intro: 'Run common scientific operations without entering code or an unsafe free-form expression.',
    sections: [
      ['Scientific operations supported', 'Use trigonometric and inverse-trigonometric functions, square and cube roots, logarithms, powers, exponentials, factorials, reciprocals, and absolute values.'],
      ['Degrees and radians', 'Trigonometric functions depend on the selected angle unit. Degrees are often convenient for geometry, while radians are standard in higher mathematics and many scientific formulas.'],
      ['Numeric limits', 'The calculator rejects non-finite input and results outside JavaScript’s finite numeric range. Factorials are limited to 170 so the result remains finite.'],
    ],
  },
  'lcm-gcf': {
    title: 'LCM & GCF Calculator', pathname: '/calculators/lcm-gcf', eyebrow: 'Math calculator',
    description: 'Find the greatest common factor and least common multiple of multiple whole integers using exact integer arithmetic.',
    intro: 'Enter several whole numbers to find their GCF/GCD and LCM exactly.',
    sections: [
      ['What GCF means', 'The greatest common factor, also called the greatest common divisor, is the largest non-negative whole number that divides every input without a remainder.'],
      ['What LCM means', 'The least common multiple is the smallest non-negative number that is a multiple of every input. If any input is zero, the LCM is zero.'],
      ['Exact arithmetic', 'Tooliyapa uses BigInt integer arithmetic here, so large whole-number results are not rounded through ordinary floating-point math.'],
    ],
  },
  quadratic: {
    title: 'Quadratic Equation Solver', pathname: '/calculators/quadratic', eyebrow: 'Math calculator',
    description: 'Solve ax² + bx + c = 0, inspect the discriminant, and find the vertex for real or complex roots.',
    intro: 'Solve a quadratic equation and inspect its roots, discriminant, axis, and vertex.',
    sections: [
      ['Quadratic formula', 'For ax² + bx + c = 0 with a non-zero a, the roots are (-b ± √(b² - 4ac)) / (2a).'],
      ['The discriminant', 'A positive discriminant gives two real roots, zero gives one repeated real root, and a negative discriminant gives a complex-conjugate pair.'],
      ['Vertex information', 'The axis of symmetry is x = -b/(2a). Substituting that value back into the equation gives the vertex y-coordinate.'],
    ],
  },
  'base-arithmetic': {
    title: 'Binary / Octal / Decimal / Hex Calculator', pathname: '/calculators/base-arithmetic', eyebrow: 'Math calculator',
    description: 'Add, subtract, multiply, and divide whole integers in base 2, 8, 10, or 16 using exact integer arithmetic.',
    intro: 'Perform exact whole-number arithmetic directly in binary, octal, decimal, or hexadecimal.',
    sections: [
      ['Supported bases', 'Choose binary (2), octal (8), decimal (10), or hexadecimal (16). Input digits are validated against the selected base before calculation.'],
      ['Division behavior', 'Division uses whole-integer quotient and remainder, which avoids pretending that a repeating fractional value is an exact integer-base result.'],
      ['Exact integer math', 'Calculations use BigInt rather than floating-point Number arithmetic, so long integer inputs are not rounded within the stated input limit.'],
    ],
  },
  'random-number': {
    title: 'Random Number Generator', pathname: '/calculators/random-number', eyebrow: 'Math utility',
    description: 'Generate one or many random integers or decimal values within a chosen range, with an optional uniqueness rule.',
    intro: 'Generate random values inside a range for everyday simulations, selections, or practice tasks.',
    sections: [
      ['Integer and decimal modes', 'Integer mode includes both endpoints of the selected range. Decimal mode generates values from the minimum up to, but not including, the maximum.'],
      ['Unique results', 'When integer uniqueness is enabled, Tooliyapa checks that the range contains enough distinct values before generating the requested count.'],
      ['Not for cryptography', 'This tool is intended for ordinary randomization and is not presented as a cryptographic key, password, lottery, gambling, or security-number generator.'],
    ],
  },
  discount: {
    title: 'Discount Calculator', pathname: '/calculators/discount', eyebrow: 'Finance calculator',
    description: 'Calculate sale price and savings from an original price and percentage discount.',
    intro: 'See exactly how much a percentage discount removes from an original price.',
    sections: [
      ['Discount formula', 'Savings equal original price × discount rate ÷ 100. Sale price equals original price minus those savings.'],
      ['Stacked discounts', 'This calculator applies one percentage discount. Two successive discounts should be calculated sequentially because percentages do not simply add.'],
      ['Price estimates', 'Displayed results are mathematical estimates. Store rounding, coupons, taxes, fees, and eligibility rules can change the final amount charged.'],
    ],
  },
  tax: {
    title: 'VAT / Tax Calculator', pathname: '/calculators/tax', eyebrow: 'Finance calculator',
    description: 'Add a percentage tax to a net amount or extract the included tax from a tax-inclusive gross amount.',
    intro: 'Move between net, tax, and gross amounts using a percentage tax or VAT rate.',
    sections: [
      ['Adding tax', 'When starting from a net amount, tax equals net × rate ÷ 100 and gross equals net plus tax.'],
      ['Extracting included tax', 'When the entered amount already includes tax, net equals gross ÷ (1 + rate/100). The included tax is gross minus net.'],
      ['Jurisdiction rules', 'This tool performs arithmetic only. It does not determine whether a tax applies, which rate is legally correct, or how a tax return should be prepared.'],
    ],
  },
  bmi: {
    title: 'BMI Calculator', pathname: '/calculators/bmi', eyebrow: 'Health calculator',
    description: 'Calculate adult body mass index from weight and height and see the standard screening range label.',
    intro: 'Calculate BMI as a general adult screening measure, with clear limits on what the number can tell you.',
    sections: [
      ['BMI formula', 'BMI equals weight in kilograms divided by height in metres squared.'],
      ['Screening, not diagnosis', 'BMI is a population-level screening measure and does not directly measure body fat, muscle mass, fitness, or health.'],
      ['When context matters', 'Pregnancy, childhood, older age, athletic builds, some disabilities, and individual clinical circumstances can make BMI categories less informative. Discuss health decisions with a qualified clinician.'],
    ],
  },
  bmr: {
    title: 'BMR & Daily Calorie Needs Calculator', pathname: '/calculators/bmr', eyebrow: 'Health calculator',
    description: 'Estimate adult basal metabolic rate with the Mifflin–St Jeor equation and a rough activity-adjusted daily energy estimate.',
    intro: 'Estimate adult BMR and an activity-adjusted daily energy need for general informational use.',
    sections: [
      ['Mifflin–St Jeor equation', 'The estimate uses weight, height, age, and the sex-specific constants in the Mifflin–St Jeor equation.'],
      ['Activity multiplier', 'Estimated daily energy expenditure multiplies BMR by a broad activity factor. Real energy needs vary with body composition, occupation, training, health, climate, and many other factors.'],
      ['Informational use only', 'This adult estimate is not a prescription for weight loss, weight gain, pregnancy, illness, eating disorders, childhood nutrition, or medical treatment.'],
    ],
  },
  'ideal-weight': {
    title: 'Ideal Weight Formula Comparison', pathname: '/calculators/ideal-weight', eyebrow: 'Health reference',
    description: 'Compare several historical adult height-based reference-weight formulas and see their average and spread.',
    intro: 'Compare historical height-based formulas without presenting any one result as a medically ideal target.',
    sections: [
      ['Why several formulas are shown', 'Devine, Robinson, Miller, and Hamwi use different constants, so they can return noticeably different values for the same height.'],
      ['Not a health target', 'These equations are historical reference formulas, not a diagnosis or personalized recommendation. They ignore body composition, health conditions, age-related changes, ethnicity, pregnancy, and individual goals.'],
      ['How to interpret the output', 'Treat the range as a comparison of formulas only. A qualified healthcare professional can evaluate weight and health using much broader information.'],
    ],
  },
  age: {
    title: 'Age Calculator', pathname: '/calculators/age', eyebrow: 'Date & time calculator',
    description: 'Calculate calendar age in years, months, and days plus total days, weeks, and hours between a birth date and an as-of date.',
    intro: 'Calculate calendar age and useful total-time equivalents without relying on average month or year lengths.',
    sections: [
      ['Calendar age', 'Years and months are advanced on the calendar before leftover days are counted, so the result does not assume every month has the same number of days.'],
      ['Leap dates', 'When a month or year does not contain the original day, the intermediate anniversary is clamped to the last valid day of that month.'],
      ['Total days and weeks', 'Total days are calculated from UTC calendar midnights, avoiding daylight-saving-hour shifts for date-only input. Weeks are total days divided by seven.'],
    ],
  },
  'date-difference': {
    title: 'Date Difference Calculator', pathname: '/calculators/date-difference', eyebrow: 'Date & time calculator',
    description: 'Measure the calendar and total-day difference between two dates in either order.',
    intro: 'Compare two dates as calendar years/months/days and as total days and weeks.',
    sections: [
      ['Calendar versus total difference', 'Calendar years, months, and days describe how the dates align on a calendar; total days counts the exact number of date boundaries between them.'],
      ['Either date order', 'If the end date is earlier than the start date, Tooliyapa reports the magnitude and indicates that the direction is backward.'],
      ['Date-only calculation', 'The tool uses date-only values rather than local clock times, which helps avoid daylight-saving changes affecting the day count.'],
    ],
  },
  countdown: {
    title: 'Countdown Calculator', pathname: '/calculators/countdown', eyebrow: 'Date & time calculator',
    description: 'Count down from the current browser time to a future local date and time in days, hours, minutes, and seconds.',
    intro: 'Enter a future date and time to see the remaining time update from your browser clock.',
    sections: [
      ['Local browser time', 'The target uses the local date and time entered in your browser. The countdown is based on your device clock.'],
      ['Days, hours, minutes, seconds', 'The duration is decomposed from total seconds into whole days and the remaining hours, minutes, and seconds.'],
      ['Clock accuracy', 'A device with an incorrect clock, timezone, or daylight-saving setting can produce an incorrect countdown.'],
    ],
  },
  'time-duration': {
    title: 'Time Duration Calculator', pathname: '/calculators/time-duration', eyebrow: 'Date & time calculator',
    description: 'Find the elapsed time between two local date-time values in days, hours, minutes, and total hours.',
    intro: 'Measure elapsed time between two date-and-time values, including durations that cross midnight or span multiple days.',
    sections: [
      ['Elapsed duration', 'The end date and time must not be before the start. The difference is calculated in milliseconds and then broken into larger time units.'],
      ['Crossing midnight', 'Because both inputs include a date, overnight and multi-day durations do not require a special next-day toggle.'],
      ['Timezone note', 'Both values are interpreted using the browser’s local timezone. For cross-timezone scheduling, convert both moments to the same timezone first.'],
    ],
  },
  gpa: {
    title: 'GPA Calculator', pathname: '/calculators/gpa', eyebrow: 'Education calculator',
    description: 'Calculate a credit-weighted GPA from grade points and course credits on a configurable GPA scale.',
    intro: 'Calculate GPA from the grade points your school actually uses instead of assuming one universal letter-grade table.',
    sections: [
      ['Weighted GPA formula', 'For each course, grade points are multiplied by course credits. Those weighted points are added and divided by total credits.'],
      ['Configurable scale', 'Enter the GPA scale used by your institution, such as 4.0, 5.0, or 10.0, then enter course grade points on that same scale.'],
      ['Institution rules differ', 'Schools can differ on repeated courses, pass/fail classes, honors weighting, transfer credits, and rounding. Always compare the result with your institution’s official policy.'],
    ],
  },
}
