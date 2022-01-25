const mutations = {
  SET_LABEL(state, { label, slotNumber }) {
    state.labels[slotNumber] = label
  },
  SET_MAIN_COLOR(state, colors) {
    const { hsl, rgb, hex } = colors
    state.mainHSL = hsl
    state.mainSlotColor.hsl = hsl
    state.mainSlotColor.rgb = rgb
    state.mainSlotColor.hex = hex
  },
  RESET_ALL_COLORS(state, colors) {
    const { hsl, rgb, hex } = colors
    state.allColors = {
      hsl: [hsl],
      rgb: [rgb],
      hex: [hex]
    }
    state.slotColors = {
      slot2: {
        hsl: '',
        rgb: '',
        hex: ''
      },
      slot3: {
        hsl: '',
        rgb: '',
        hex: ''
      },
      slot4: {
        hsl: '',
        rgb: '',
        hex: ''
      },
      slot5: {
        hsl: '',
        rgb: '',
        hex: ''
      }
    }
  },
  ADD_COLOR(state, colors) {
    const { hsl, rgb, hex } = colors
    state.allColors.hsl.push(hsl)
    state.allColors.rgb.push(rgb)
    state.allColors.hex.push(hex)
  },
  SET_SLOT_COLOR(state, { slot, hsl, rgb, hex }) {
    state.slotColors[slot].hsl = hsl
    state.slotColors[slot].rgb = rgb
    state.slotColors[slot].hex = hex
  },
  SET_COPIED_COLOR(state, color) {
    state.copiedColor = color
  },
  SET_COPIED_COLOR_INDEX(state, index) {
    state.copiedColorIndex = index
  },
  SET_TEXT_COLOR(state, colors) {
    state.textColor = colors
  },
  SET_SAVED_PALETTES(state, palettes) {
    state.savedPalettes = palettes
  }
}

export default mutations
