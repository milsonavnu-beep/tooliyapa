function finite(value, name) {
  const number = Number(String(value).trim())
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be a finite number.`)
  return number
}

export function calculateDiscount(priceInput, percentInput) {
  const price = finite(priceInput, 'Original price')
  const percent = finite(percentInput, 'Discount')
  if (price < 0) throw new RangeError('Original price must be 0 or greater.')
  if (percent < 0 || percent > 100) throw new RangeError('Discount must be from 0% to 100%.')
  const savings = price * percent / 100
  const salePrice = price - savings
  return { price, percent, savings, salePrice }
}

export function calculateTax(amountInput, rateInput, mode = 'add') {
  const amount = finite(amountInput, mode === 'extract' ? 'Gross amount' : 'Net amount')
  const rate = finite(rateInput, 'Tax rate')
  if (amount < 0) throw new RangeError('Amount must be 0 or greater.')
  if (rate < 0 || rate > 1000) throw new RangeError('Tax rate must be from 0% to 1000%.')
  if (mode === 'add') {
    const tax = amount * rate / 100
    return { net: amount, tax, gross: amount + tax, rate, mode }
  }
  if (mode === 'extract') {
    const gross = amount
    const net = rate === 0 ? gross : gross / (1 + rate / 100)
    return { net, tax: gross - net, gross, rate, mode }
  }
  throw new RangeError('Choose whether to add or extract tax.')
}
