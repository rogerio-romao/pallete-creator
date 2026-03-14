const mutations = {
  // when variations are generated, this adds them to the state (allColors)
  ADD_COLOR(state, colors) {
    const { hsl, rgb, hex } = colors
    state.allColors.hsl.push(hsl)
    state.allColors.rgb.push(rgb)
    state.allColors.hex.push(hex)
  },
  // called when a main color is created, resetting all slots
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
  // set the copied color from mini slots to state
  SET_COPIED_COLOR(state, color) {
    state.copiedColor = color
  },
  // set the copied color index from mini slots to state
  SET_COPIED_COLOR_INDEX(state, index) {
    state.copiedColorIndex = index
  },
  // set the edited color label from this slot to state
  SET_LABEL(state, { label, slotNumber }) {
    state.labels[slotNumber] = label
  },
  // sets the main color slot
  SET_MAIN_COLOR(state, colors) {
    const { hsl, rgb, hex } = colors
    state.mainHSL = hsl
    state.mainSlotColor.hsl = hsl
    state.mainSlotColor.rgb = rgb
    state.mainSlotColor.hex = hex
  },
  // save the local storage state after operation
  SET_SAVED_PALETTES(state, palettes) {
    state.savedPalettes = palettes
  },
  // set a specific color slot
  SET_SLOT_COLOR(state, { slot, hsl, rgb, hex }) {
    state.slotColors[slot].hsl = hsl
    state.slotColors[slot].rgb = rgb
    state.slotColors[slot].hex = hex
  },
  // set the text color
  SET_TEXT_COLOR(state, colors) {
    state.textColor = colors
  }
}

export default mutations
