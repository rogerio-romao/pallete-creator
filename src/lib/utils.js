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

export const generateHsl = () => {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 100)
  const l = Math.floor(Math.random() * 100)
  return `hsl(${h}, ${s}%, ${l}%)`
}

export const generateComplement = (hsl) => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const h2 = (h + 180) % 360
  return `hsl(${h2}, ${s}%, ${l}%)`
}

export const hslToRgb = (hsl) => {
  let [h, s, l] = hsl.match(/\d+/g).map(Number)
  h /= 360
  s /= 100
  l /= 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
    b * 255
  )})`
}

export const generateMono = (hsl) => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const l2 = Math.floor((s + Math.random() * 100) % 100)
  const l3 = Math.floor((s + Math.random() * 100) % 100)
  const l4 = Math.floor((s + Math.random() * 100) % 100)
  return [
    `hsl(${h}, ${s}%, ${l2}%)`,
    `hsl(${h}, ${s}%, ${l3}%)`,
    `hsl(${h}, ${s}%, ${l4}%)`
  ]
}

export const generateTriad = (hsl) => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const h2 = (h + 120) % 360
  const h3 = (h + 240) % 360
  return [`hsl(${h2}, ${s}%, ${l}%)`, `hsl(${h3}, ${s}%, ${l}%)`]
}

export const generateAnalogous = (hsl) => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const h2 = (h + 30) % 360
  const h3 = (h + 60) % 360
  const h4 = (h + 90) % 360
  const h5 = (h + 120) % 360
  const h6 = (h + 150) % 360
  const h7 = (h + 180) % 360
  const h8 = (h + 210) % 360
  const h9 = (h + 240) % 360
  const h10 = (h + 270) % 360
  const h11 = (h + 300) % 360
  const h12 = (h + 330) % 360
  return [
    `hsl(${h}, ${s}%, ${l}%)`,
    `hsl(${h2}, ${s}%, ${l}%)`,
    `hsl(${h3}, ${s}%, ${l}%)`,
    `hsl(${h4}, ${s}%, ${l}%)`,
    `hsl(${h5}, ${s}%, ${l}%)`,
    `hsl(${h6}, ${s}%, ${l}%)`,
    `hsl(${h7}, ${s}%, ${l}%)`,
    `hsl(${h8}, ${s}%, ${l}%)`,
    `hsl(${h9}, ${s}%, ${l}%)`,
    `hsl(${h10}, ${s}%, ${l}%)`,
    `hsl(${h11}, ${s}%, ${l}%)`,
    `hsl(${h12}, ${s}%, ${l}%)`
  ]
}
