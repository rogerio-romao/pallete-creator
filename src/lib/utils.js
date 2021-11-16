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

const generateColor = (slot) => {
  const r = randomInt()
  const g = randomInt()
  const b = randomInt()

  const rgb = `rgb(${r}, ${g}, ${b})`
  const hex = rgbToHex(r, g, b)
  const hsl = rgbToHsl(r, g, b)

  slot.style.backgroundColor = rgb

  slot.querySelector('.rgbValue').innerHTML = rgb
  slot.querySelector('.hexValue').innerHTML = hex
  slot.querySelector('.hslValue').innerHTML = `hsl(${Math.round(
    hsl[0]
  )}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`
}

const rgbToHex = (r, g, b) => {
  let hex = [r.toString(16), g.toString(16), b.toString(16)]
  hex.forEach((color, index) => {
    if (color.length === 1) {
      hex[index] = `0${color}`
    }
  })
  return `#${hex.join('')}`
}

const rgbToHsl = (r, g, b) => {
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
  return [h, s, l]
}
