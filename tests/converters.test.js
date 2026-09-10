import { describe, expect, it } from 'vitest'
import { convertUnit } from '../lib/converter-units.js'
import { convertBaseNumber, decimalToScientific, decodeText, encodeText, integerToRoman, morseToText, romanToInteger, scientificToDecimal, textToMorse } from '../lib/encoding-converters.js'
import { convertColor, parseHexColor } from '../lib/color-converter.js'

describe('converter engines',()=>{
  it('converts common linear units with explicit factors',()=>{expect(convertUnit('length',1,'m','cm')).toBeCloseTo(100,12);expect(convertUnit('mass',1,'lb','kg')).toBeCloseTo(0.45359237,12);expect(convertUnit('volume',1,'gal_us','l')).toBeCloseTo(3.785411784,12);expect(convertUnit('area',1,'acre','m2')).toBeCloseTo(4046.8564224,8);expect(convertUnit('speed',60,'mph','ms')).toBeCloseTo(26.8224,8)})
  it('distinguishes binary storage and electrical unit conversions',()=>{expect(convertUnit('data-storage',1,'MiB','MB')).toBeCloseTo(1.048576,12);expect(convertUnit('power-converter',1,'hp','W')).toBeCloseTo(745.6998715822702,8);expect(convertUnit('frequency-converter',60,'rpm','Hz')).toBeCloseTo(1,12);expect(convertUnit('energy-converter',1,'kWh','J')).toBeCloseTo(3600000,8);expect(convertUnit('voltage-converter',1000,'mV','V')).toBeCloseTo(1,12)})
  it('converts temperature and rejects below absolute zero',()=>{expect(convertUnit('temperature',0,'c','f')).toBeCloseTo(32,12);expect(convertUnit('temperature',0,'k','c')).toBeCloseTo(-273.15,12);expect(()=>convertUnit('temperature',-1,'k','c')).toThrow(/absolute zero/)})
  it('converts number bases exactly',()=>{expect(convertBaseNumber('FF',16,10)).toBe('255');expect(convertBaseNumber('255',10,2)).toBe('11111111');expect(()=>convertBaseNumber('2',2,10)).toThrow(/not valid/)})
  it('encodes and decodes UTF-8 byte formats',()=>{expect(encodeText('A','hex')).toBe('41');expect(encodeText('A','binary')).toBe('01000001');expect(decodeText('41','hex')).toBe('A');expect(decodeText('65','decimal')).toBe('A')})
  it('enforces canonical Roman numerals',()=>{expect(integerToRoman(1994)).toBe('MCMXCIV');expect(romanToInteger('MCMXCIV')).toBe(1994);expect(()=>romanToInteger('IIII')).toThrow(/canonical/)})
  it('converts scientific notation without ordinary floating-point expansion',()=>{expect(decimalToScientific('0.00123')).toMatchObject({coefficient:'1.23',exponent:-3});expect(scientificToDecimal('1.23',-3)).toBe('0.00123');expect(scientificToDecimal('1.23',3)).toBe('1230')})
  it('converts Morse code in both directions',()=>{expect(textToMorse('SOS')).toBe('... --- ...');expect(morseToText('... --- ...')).toBe('SOS')})
  it('converts color formats and normalizes short HEX',()=>{expect(parseHexColor('#0F766E')).toEqual({r:15,g:118,b:110});expect(parseHexColor('#ABC')).toEqual({r:170,g:187,b:204});const color=convertColor(15,118,110);expect(color.hex).toBe('#0F766E');expect(color.hsl.h).toBeGreaterThan(170);expect(color.hsl.h).toBeLessThan(180)})
})
