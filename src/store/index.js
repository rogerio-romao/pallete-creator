import { createStore } from 'vuex'

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

const store = createStore({
  state() {
    return {
      mainHSL: null,
      mainSlotColor: {
        hsl: '',
        rgb: '',
        hex: ''
      },
      slotColors: {
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
      },
      textColor: {
        hsl: 'hsl(34, 78%, 91%)',
        rgb: 'rgb(250, 235, 215)',
        hex: '#faebd7'
      },
      allColors: {
        hsl: [],
        rgb: [],
        hex: []
      },
      copiedColor: '',
      copiedColorIndex: null,
      labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
      savedPallettes: JSON.parse(localStorage.getItem('pallettes')) || []
    }
  },
  mutations: {
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
    SET_SAVED_PALLETES(state, pallettes) {
      state.savedPallettes = pallettes
    }
  },
  actions: {
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
    SAVE_PALLETE({ commit }, { name, scheme }) {
      const pallettes = JSON.parse(localStorage.getItem('pallettes')) || []
      pallettes.push({ name, scheme, id: pallettes.length })
      commit('SET_SAVED_PALLETES', pallettes)
      localStorage.setItem('pallettes', JSON.stringify(pallettes))
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
    }
  },
  getters: {
    uniqueColors: state => new Set(state.allColors.hsl),
    fullSchemeSet: state =>
      Object.values(state.slotColors).every(color => color.hsl !== ''),
    currentScheme: state => {
      return [
        {
          hsl: state.textColor.hsl,
          rgb: state.textColor.rgb,
          hex: state.textColor.hex
        },
        {
          hsl: state.mainHSL,
          rgb: state.mainSlotColor.rgb,
          hex: state.mainSlotColor.hex
        },
        {
          hsl: state.slotColors.slot2.hsl,
          rgb: state.slotColors.slot2.rgb,
          hex: state.slotColors.slot2.hex
        },
        {
          hsl: state.slotColors.slot3.hsl,
          rgb: state.slotColors.slot3.rgb,
          hex: state.slotColors.slot3.hex
        },
        {
          hsl: state.slotColors.slot4.hsl,
          rgb: state.slotColors.slot4.rgb,
          hex: state.slotColors.slot4.hex
        },
        {
          hsl: state.slotColors.slot5.hsl,
          rgb: state.slotColors.slot5.rgb,
          hex: state.slotColors.slot5.hex
        }
      ]
    }
  }
})

export default store
