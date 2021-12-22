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
      allColors: {
        hsl: [],
        rgb: [],
        hex: []
      },
      labels: [null, 'Main', 'Secondary', 'Accent', 'Light', 'Dark']
    }
  },
  mutations: {
    SET_MAIN_COLOR(state, color) {
      state.mainHSL = color
    },
    RESET_ALL_COLORS(state, colors) {
      const { hsl, rgb, hex } = colors
      state.allColors = {
        hsl: [hsl],
        rgb: [rgb],
        hex: [hex]
      }
    },
    ADD_COLOR(state, colors) {
      const { hsl, rgb, hex } = colors
      state.allColors.hsl.push(hsl)
      state.allColors.rgb.push(rgb)
      state.allColors.hex.push(hex)
    }
  },
  actions: {
    SET_MAIN_COLOR({ commit, dispatch }) {
      const hsl = generateHsl()
      const rgb = hslToRgb(hsl)
      const hex = rgbToHex(rgb)
      commit('SET_MAIN_COLOR', hsl)
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
    }
  },
  getters: {
    uniqueColors: state => new Set(state.allColors.hsl)
  }
})

export default store
