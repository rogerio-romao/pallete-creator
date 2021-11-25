const randomInt = () => {
  return Math.floor(Math.random() * 256)
}

export const generateRgb = () => {
  const r = randomInt()
  const g = randomInt()
  const b = randomInt()

  const rgb = `rgb(${r}, ${g}, ${b})`
  return rgb
}

export const rgbToHex = (rgb) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number)
  let hex = [r.toString(16), g.toString(16), b.toString(16)]
  hex.forEach((color, index) => {
    if (color.length === 1) {
      hex[index] = `0${color}`
    }
  })
  return `#${hex.join('')}`
}

export const rgbToHsl = (rgb) => {
  let [r, g, b] = rgb.match(/\d+/g).map(Number)
  r /= 255
  g /= 255
  b /= 255
  let h, s, l
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  if (max === min) {
    h = 0
  } else if (max === r) {
    h = (60 * (g - b)) / (max - min)
  } else if (max === g) {
    h = (60 * (b - r)) / (max - min) + 120
  } else if (max === b) {
    h = (60 * (r - g)) / (max - min) + 240
  }
  if (h < 0) {
    h += 360
  }
  l = (min + max) / 2
  if (max === 0 || min === 1) {
    s = 0
  } else {
    s = (max - l) / Math.min(l, 1 - l)
  }
  return `${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`
}
