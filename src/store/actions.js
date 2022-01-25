import {
  generateHsl,
  hslToRgb,
  rgbToHex,
  generateComplement,
  generateMono,
  generateTriad,
  generateAnalogous,
  generateSaturations
} from '../lib/utils'

const actions = {
  UPDATE_LABEL({ commit }, { label, slotNumber }) {
    label = label[0].toUpperCase() + label.slice(1)
    commit('SET_LABEL', { label, slotNumber })
  },
  SET_MAIN_COLOR({ commit, dispatch }, color) {
    const hsl = color || generateHsl()
    const rgb = hslToRgb(hsl)
    const hex = rgbToHex(rgb)
    commit('SET_MAIN_COLOR', { hsl, rgb, hex })
    commit('RESET_ALL_COLORS', { hsl, rgb, hex })
    dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateComplement })
    dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateMono })
    dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateTriad })
    dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateAnalogous })
    dispatch('GENERATE_VARIATIONS', { color: hsl, fn: generateSaturations })
  },
  GENERATE_VARIATIONS({ commit }, { color, fn }) {
    const variations = fn(color)
    variations.forEach(hsl => {
      const rgb = hslToRgb(hsl)
      const hex = rgbToHex(rgb)
      commit('ADD_COLOR', { hsl, rgb, hex })
    })
  },
  COPY_COLOR({ commit }, { color, index }) {
    commit('SET_COPIED_COLOR', color)
    commit('SET_COPIED_COLOR_INDEX', index)
  },
  PASTE_COLOR({ commit, state, dispatch }, slot) {
    if (!state.copiedColor) return
    const hsl = state.copiedColor
    const rgb = hslToRgb(hsl)
    const hex = rgbToHex(rgb)
    if (slot === 1) {
      dispatch('SET_MAIN_COLOR', hsl)
    } else {
      commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex })
    }
  },
  SET_RANDOM_SCHEME({ commit, state, getters }) {
    const unique = [...getters.uniqueColors]
    const randomScheme = new Set()
    while (randomScheme.size < 4) {
      const hsl = unique[Math.floor(Math.random() * unique.length)]
      if (!randomScheme.has(hsl) && hsl !== state.mainHSL) {
        randomScheme.add(hsl)
      }
    }
    let slot = 2
    randomScheme.forEach(hsl => {
      const rgb = hslToRgb(hsl)
      const hex = rgbToHex(rgb)
      commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex })
      slot++
    })
  },
  SAVE_PALETTE({ commit }, { name, scheme }) {
    const palettes = JSON.parse(localStorage.getItem('palettes')) || []
    palettes.push({ name, scheme, id: palettes.length })
    commit('SET_SAVED_PALETTES', palettes)
    localStorage.setItem('palettes', JSON.stringify(palettes))
  },
  UPDATE_SLOT_COLOR({ commit }, { slot, hsl }) {
    const rgb = hslToRgb(hsl)
    const hex = rgbToHex(rgb)
    commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex })
  },
  SET_TEXT_COLOR({ commit }, type) {
    if (type === 'light') {
      commit('SET_TEXT_COLOR', {
        hsl: 'hsl(34, 78%, 91%)',
        rgb: 'rgb(250, 235, 215)',
        hex: '#faebd7'
      })
    } else if (type === 'dark') {
      commit('SET_TEXT_COLOR', {
        hsl: 'hsl(218, 27%, 8%)',
        rgb: 'rgb(15, 19, 26)',
        hex: '#0f131a'
      })
    }
  },
  SET_PALETTE_FROM_SAVED({ commit, dispatch }, palette) {
    const [main, ...others] = palette
    dispatch('SET_MAIN_COLOR', main.hsl)
    others.forEach((slot, index) => {
      dispatch('UPDATE_SLOT_COLOR', { slot: index + 2, hsl: slot.hsl })
    })
  },
  DELETE_PALETTE({ commit, state, dispatch }, id) {
    const palettes = JSON.parse(localStorage.getItem('palettes'))
    const newPalettes = palettes.filter(p => p.id !== id)
    localStorage.setItem('palettes', JSON.stringify(newPalettes))
    commit('SET_SAVED_PALETTES', newPalettes)
  }
}

export default actions
