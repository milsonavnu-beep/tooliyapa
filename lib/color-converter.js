function channel(value, name) {
  const number = Number(String(value).trim())
  if (!Number.isInteger(number) || number < 0 || number > 255) throw new RangeError(`${name} must be a whole number from 0 to 255.`)
  return number
}

export function parseHexColor(input) {
  let hex = String(input).trim().replace(/^#/,'')
  if (/^[0-9a-f]{3}$/i.test(hex)) hex = hex.split('').map((char)=>char+char).join('')
  if (!/^[0-9a-f]{6}$/i.test(hex)) throw new TypeError('Enter a 3- or 6-digit HEX color.')
  return { r: parseInt(hex.slice(0,2),16), g: parseInt(hex.slice(2,4),16), b: parseInt(hex.slice(4,6),16) }
}

export function rgbToHex(rInput,gInput,bInput) {
  const r=channel(rInput,'Red'), g=channel(gInput,'Green'), b=channel(bInput,'Blue')
  return `#${[r,g,b].map((value)=>value.toString(16).padStart(2,'0')).join('').toUpperCase()}`
}

export function convertColor(rInput,gInput,bInput) {
  const r=channel(rInput,'Red'), g=channel(gInput,'Green'), b=channel(bInput,'Blue')
  const rn=r/255, gn=g/255, bn=b/255
  const max=Math.max(rn,gn,bn), min=Math.min(rn,gn,bn), delta=max-min
  let h=0
  if (delta !== 0) {
    if (max===rn) h=60*(((gn-bn)/delta)%6)
    else if (max===gn) h=60*((bn-rn)/delta+2)
    else h=60*((rn-gn)/delta+4)
  }
  if (h<0) h+=360
  const l=(max+min)/2
  const sHsl=delta===0?0:delta/(1-Math.abs(2*l-1))
  const sHsv=max===0?0:delta/max
  const v=max
  const k=1-max
  const c=k===1?0:(1-rn-k)/(1-k)
  const m=k===1?0:(1-gn-k)/(1-k)
  const y=k===1?0:(1-bn-k)/(1-k)
  return {
    rgb:{r,g,b}, hex:rgbToHex(r,g,b),
    hsl:{h,s:sHsl*100,l:l*100}, hsv:{h,s:sHsv*100,v:v*100},
    cmyk:{c:c*100,m:m*100,y:y*100,k:k*100},
  }
}
