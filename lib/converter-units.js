function unit(name, symbol, factor) { return { name, symbol, factor } }

export const UNIT_CONVERTERS = {
  length: {
    title: 'Length Converter', base: 'm', defaults: ['cm','in'],
    units: {
      nm: unit('Nanometre','nm',1e-9), um: unit('Micrometre','µm',1e-6), mm: unit('Millimetre','mm',0.001), cm: unit('Centimetre','cm',0.01), m: unit('Metre','m',1), km: unit('Kilometre','km',1000),
      in: unit('Inch','in',0.0254), ft: unit('Foot','ft',0.3048), yd: unit('Yard','yd',0.9144), mi: unit('Mile','mi',1609.344), nmi: unit('Nautical mile','nmi',1852), au: unit('Astronomical unit','AU',1.495978707e11), ly: unit('Light year','ly',9.4607304725808e15),
    },
  },
  mass: {
    title: 'Weight / Mass Converter', base: 'kg', defaults: ['kg','lb'],
    units: {
      mcg: unit('Microgram','µg',1e-9), mg: unit('Milligram','mg',1e-6), g: unit('Gram','g',0.001), kg: unit('Kilogram','kg',1), t: unit('Tonne','t',1000), ct: unit('Carat','ct',0.0002),
      oz: unit('Ounce','oz',0.028349523125), lb: unit('Pound','lb',0.45359237), st: unit('Stone','st',6.35029318), ton_us: unit('US short ton','ton',907.18474), ton_uk: unit('UK long ton','long ton',1016.0469088), ozt: unit('Troy ounce','oz t',0.0311034768),
    },
  },
  volume: {
    title: 'Volume Converter', base: 'L', defaults: ['L','gal_us'],
    units: {
      ml: unit('Millilitre','mL',0.001), cl: unit('Centilitre','cL',0.01), dl: unit('Decilitre','dL',0.1), l: unit('Litre','L',1), m3: unit('Cubic metre','m³',1000),
      tsp_us: unit('US teaspoon','tsp',0.00492892159375), tbsp_us: unit('US tablespoon','tbsp',0.01478676478125), cup_us: unit('US cup','cup',0.2365882365), floz_us: unit('US fluid ounce','fl oz',0.0295735295625), pt_us: unit('US pint','pt',0.473176473), qt_us: unit('US quart','qt',0.946352946), gal_us: unit('US gallon','gal',3.785411784), gal_uk: unit('Imperial gallon','imp gal',4.54609),
    },
  },
  area: {
    title: 'Area Converter', base: 'm²', defaults: ['m2','ft2'],
    units: {
      mm2: unit('Square millimetre','mm²',1e-6), cm2: unit('Square centimetre','cm²',1e-4), m2: unit('Square metre','m²',1), km2: unit('Square kilometre','km²',1e6), in2: unit('Square inch','in²',0.00064516), ft2: unit('Square foot','ft²',0.09290304), yd2: unit('Square yard','yd²',0.83612736), acre: unit('Acre','acre',4046.8564224), ha: unit('Hectare','ha',10000), mi2: unit('Square mile','mi²',2589988.110336),
    },
  },
  speed: {
    title: 'Speed Converter', base: 'm/s', defaults: ['kmh','mph'],
    units: {
      ms: unit('Metres per second','m/s',1), kmh: unit('Kilometres per hour','km/h',1/3.6), mph: unit('Miles per hour','mph',0.44704), fts: unit('Feet per second','ft/s',0.3048), knot: unit('Knot','kn',1852/3600),
    },
  },
  'data-storage': {
    title: 'Data Storage Converter', base: 'byte', defaults: ['MB','MiB'],
    units: {
      bit: unit('Bit','bit',0.125), B: unit('Byte','B',1), KB: unit('Kilobyte (decimal)','KB',1000), MB: unit('Megabyte (decimal)','MB',1e6), GB: unit('Gigabyte (decimal)','GB',1e9), TB: unit('Terabyte (decimal)','TB',1e12), PB: unit('Petabyte (decimal)','PB',1e15),
      KiB: unit('Kibibyte (binary)','KiB',1024), MiB: unit('Mebibyte (binary)','MiB',1048576), GiB: unit('Gibibyte (binary)','GiB',1073741824), TiB: unit('Tebibyte (binary)','TiB',1099511627776),
    },
  },
  'power-converter': {
    title: 'Power Converter', base: 'W', defaults: ['W','hp'],
    units: { mW: unit('Milliwatt','mW',0.001), W: unit('Watt','W',1), kW: unit('Kilowatt','kW',1000), MW: unit('Megawatt','MW',1e6), hp: unit('Mechanical horsepower','hp',745.6998715822702), btuh: unit('BTU per hour','BTU/h',0.2930710701722222) },
  },
  'voltage-converter': {
    title: 'Voltage Converter', base: 'V', defaults: ['V','mV'],
    units: { uV: unit('Microvolt','µV',1e-6), mV: unit('Millivolt','mV',0.001), V: unit('Volt','V',1), kV: unit('Kilovolt','kV',1000), MV: unit('Megavolt','MV',1e6) },
  },
  'frequency-converter': {
    title: 'Frequency Converter', base: 'Hz', defaults: ['Hz','kHz'],
    units: { mHz: unit('Millihertz','mHz',0.001), Hz: unit('Hertz','Hz',1), kHz: unit('Kilohertz','kHz',1000), MHz: unit('Megahertz','MHz',1e6), GHz: unit('Gigahertz','GHz',1e9), rpm: unit('Revolutions per minute','rpm',1/60) },
  },
  'energy-converter': {
    title: 'Energy Converter', base: 'J', defaults: ['J','kWh'],
    units: { mJ: unit('Millijoule','mJ',0.001), J: unit('Joule','J',1), kJ: unit('Kilojoule','kJ',1000), MJ: unit('Megajoule','MJ',1e6), Wh: unit('Watt-hour','Wh',3600), kWh: unit('Kilowatt-hour','kWh',3.6e6), cal: unit('Thermochemical calorie','cal',4.184), kcal: unit('Kilocalorie','kcal',4184), BTU: unit('International Table BTU','BTU',1055.05585262), eV: unit('Electronvolt','eV',1.602176634e-19) },
  },
}

export const TEMPERATURE_UNITS = {
  c: { name: 'Celsius', symbol: '°C', toKelvin: (c) => c + 273.15, fromKelvin: (k) => k - 273.15 },
  f: { name: 'Fahrenheit', symbol: '°F', toKelvin: (f) => (f - 32) * 5/9 + 273.15, fromKelvin: (k) => (k - 273.15) * 9/5 + 32 },
  k: { name: 'Kelvin', symbol: 'K', toKelvin: (k) => k, fromKelvin: (k) => k },
  r: { name: 'Rankine', symbol: '°R', toKelvin: (r) => r * 5/9, fromKelvin: (k) => k * 9/5 },
  re: { name: 'Réaumur', symbol: '°Ré', toKelvin: (re) => re * 1.25 + 273.15, fromKelvin: (k) => (k - 273.15) * 0.8 },
  de: { name: 'Delisle', symbol: '°De', toKelvin: (de) => 373.15 - de * 2/3, fromKelvin: (k) => (373.15 - k) * 1.5 },
}

function finite(value, name='Value') {
  const number = Number(String(value).trim())
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be a finite number.`)
  return number
}

export function formatConverted(value) {
  if (!Number.isFinite(value)) throw new RangeError('Converted result is outside the supported numeric range.')
  if (Object.is(value,-0) || value === 0) return '0'
  const abs = Math.abs(value)
  if (abs >= 1e12 || abs < 1e-9) return value.toExponential(10).replace(/\.0+e/,'e').replace(/(\.\d*?[1-9])0+e/,'$1e')
  return Number(value.toPrecision(12)).toString()
}

export function convertUnit(tool, valueInput, fromKey, toKey) {
  if (tool === 'temperature') return convertTemperature(valueInput, fromKey, toKey)
  const config = UNIT_CONVERTERS[tool]
  if (!config) throw new RangeError('Unknown unit converter.')
  const from = config.units[fromKey]; const to = config.units[toKey]
  if (!from || !to) throw new RangeError('Choose valid source and target units.')
  const value = finite(valueInput)
  const baseValue = value * from.factor
  const result = baseValue / to.factor
  if (!Number.isFinite(result)) throw new RangeError('Converted result is outside the supported numeric range.')
  return result
}

export function convertTemperature(valueInput, fromKey, toKey) {
  const from = TEMPERATURE_UNITS[fromKey]; const to = TEMPERATURE_UNITS[toKey]
  if (!from || !to) throw new RangeError('Choose valid temperature scales.')
  const value = finite(valueInput)
  const kelvin = from.toKelvin(value)
  if (!Number.isFinite(kelvin) || kelvin < -1e-10) throw new RangeError('Temperature cannot be below absolute zero.')
  const safeKelvin = kelvin < 0 ? 0 : kelvin
  const result = to.fromKelvin(safeKelvin)
  if (!Number.isFinite(result)) throw new RangeError('Converted result is outside the supported numeric range.')
  return result
}
