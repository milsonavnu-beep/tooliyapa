function finite(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`)
}

function safe(value) {
  if (!Number.isFinite(value)) throw new RangeError('The calculation produced a non-finite result.')
  return value
}

export function calculateProfitMargin(costPerUnit, sellingPricePerUnit, quantity = 1) {
  finite(costPerUnit, 'Cost'); finite(sellingPricePerUnit, 'Selling price'); finite(quantity, 'Quantity')
  if (costPerUnit < 0) throw new RangeError('Cost must be zero or greater.')
  if (sellingPricePerUnit <= 0) throw new RangeError('Selling price must be greater than zero.')
  if (quantity <= 0) throw new RangeError('Quantity must be greater than zero.')

  const profitPerUnit = safe(sellingPricePerUnit - costPerUnit)
  const marginPercent = safe((profitPerUnit / sellingPricePerUnit) * 100)
  const markupPercent = costPerUnit === 0 ? null : safe((profitPerUnit / costPerUnit) * 100)
  const revenue = safe(sellingPricePerUnit * quantity)
  const totalCost = safe(costPerUnit * quantity)
  const totalProfit = safe(profitPerUnit * quantity)

  return { profitPerUnit, marginPercent, markupPercent, revenue, totalCost, totalProfit, quantity }
}

export function formatBusinessNumber(value) {
  if (value === null) return 'Not defined'
  finite(value, 'Result')
  if (Object.is(value, -0)) value = 0
  const abs = Math.abs(value)
  if ((abs > 0 && abs < 1e-9) || abs >= 1e15) return Number(value.toPrecision(10)).toExponential().replace('e+', 'e')
  return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 12, maximumFractionDigits: 8 }).format(value)
}
