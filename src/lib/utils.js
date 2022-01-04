export const generateHsl = () => {
  const h = Math.floor(Math.random() * 360)
  const s = Math.floor(Math.random() * 100)
  const l = Math.floor(Math.random() * 100)
  return `hsl(${h}, ${s}%, ${l}%)`
}

export const hslToRgb = hsl => {
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

export const rgbToHsl = rgb => {
  let [r, g, b] = rgb.match(/\d+/g).map(Number)
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`
}

export const rgbToHex = rgb => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number)
  let hex = [r.toString(16), g.toString(16), b.toString(16)]
  hex.forEach((color, index) => {
    if (color.length === 1) {
      hex[index] = `0${color}`
    }
  })
  return `#${hex.join('')}`
}

export const hexToHsl = hex => {
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const hsl = rgbToHsl(`rgb(${r},${g},${b})`)
  return hsl
}

export const hslToHex = hsl => {
  const rgb = hslToRgb(hsl)
  return rgbToHex(rgb)
}

export const getRandomColor = () => {
  const color = generateHsl()
  return rgbToHex(hslToRgb(color))
}

export const getRandomColors = (num = 1) => {
  const colors = []
  for (let i = 0; i < num; i++) {
    colors.push(getRandomColor())
  }
  return colors
}

export const getRandomColorFromArray = colors => {
  return colors[Math.floor(Math.random() * colors.length)]
}

export const getRandomColorsFromArray = (colors, num = 1) => {
  const newColors = []
  for (let i = 0; i < num; i++) {
    newColors.push(getRandomColorFromArray(colors))
  }
  return newColors
}

export const generateComplement = hsl => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const h2 = (h + 180) % 360
  const h3 = Math.abs((h - 150) % 360)
  const h4 = (h + 150) % 360
  return [
    `hsl(${h2}, ${s}%, ${l}%)`,
    `hsl(${h}, ${s}%, ${l - 30}%)`,
    `hsl(${h}, ${50}%, ${90}%)`,
    `hsl(${h2}, ${s}%, ${l - 30}%)`,
    `hsl(${h2}, ${50}%, ${90}%)`,
    `hsl(${h3}, ${s}%, ${l}%)`,
    `hsl(${h4}, ${s}%, ${l}%)`
  ]
}

export const generateMono = hsl => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  return [
    `hsl(${h}, ${s}%, ${8}%)`,
    `hsl(${h}, ${s}%, ${20}%)`,
    `hsl(${h}, ${s}%, ${32}%)`,
    `hsl(${h}, ${s}%, ${45}%)`,
    `hsl(${h}, ${s}%, ${58}%)`,
    `hsl(${h}, ${s}%, ${72}%)`,
    `hsl(${h}, ${s}%, ${85}%)`,
    `hsl(${h}, ${s}%, ${95}%)`
  ]
}

export const generateTriad = hsl => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const h2 = (h + 120) % 360
  const h3 = (h + 240) % 360
  return [
    `hsl(${h2}, ${s}%, ${l}%)`,
    `hsl(${h3}, ${s}%, ${l}%)`,
    `hsl(${h2}, ${s}%, ${l - 20}%)`,
    `hsl(${h3}, ${s}%, ${l - 20}%)`,
    `hsl(${h2}, ${s}%, ${l + 20}%)`,
    `hsl(${h3}, ${s}%, ${l + 20}%)`
  ]
}

export const generateAnalogous = hsl => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const h2 = (h - 60) % 360
  const h3 = (h - 30) % 360
  const h4 = (h + 30) % 360
  const h5 = (h + 60) % 360
  const h6 = (h - 90) % 360
  const h7 = (h + 90) % 360

  return [
    `hsl(${h2}, ${s}%, ${l}%)`,
    `hsl(${h3}, ${s}%, ${l}%)`,
    `hsl(${h4}, ${s}%, ${l}%)`,
    `hsl(${h5}, ${s}%, ${l}%)`,
    `hsl(${h6}, ${s}%, ${l}%)`,
    `hsl(${h7}, ${s}%, ${l}%)`
  ]
}

export const generateSaturations = hsl => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number)
  const s2 = (s - 10) % 100
  const s3 = (s + 10) % 100
  const s4 = (s - 20) % 100
  const s5 = (s + 20) % 100
  const s6 = (s - 30) % 100
  const s7 = (s + 30) % 100
  const s8 = (s - 40) % 100
  const s9 = (s + 40) % 100
  return [
    `hsl(${h}, ${s2}%, ${l}%)`,
    `hsl(${h}, ${s3}%, ${l}%)`,
    `hsl(${h}, ${s4}%, ${l}%)`,
    `hsl(${h}, ${s5}%, ${l}%)`,
    `hsl(${h}, ${s6}%, ${l}%)`,
    `hsl(${h}, ${s7}%, ${l}%)`,
    `hsl(${h}, ${s8}%, ${l}%)`,
    `hsl(${h}, ${s9}%, ${l}%)`
  ]
}
