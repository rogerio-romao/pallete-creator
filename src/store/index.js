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
      mainsSlotColor: {
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
      allColors: {
        hsl: [],
        rgb: [],
        hex: []
      },
      copiedColor: '',
      copiedColorIndex: null,
      labels: [null, 'Main', 'Secondary', 'Accent', 'Light', 'Dark']
    }
  },
  mutations: {
    SET_MAIN_COLOR(state, hsl, rgb, hex) {
      state.mainHSL = hsl
      state.mainsSlotColor.hsl = hsl
      state.mainsSlotColor.rgb = rgb
      state.mainsSlotColor.hex = hex
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
    },
    SET_SLOT_COLOR(state, slot, colors) {
      const { hsl, rgb, hex } = colors
      state.slotColors[slot].hsl = hsl
      state.slotColors[slot].rgb = rgb
      state.slotColors[slot].hex = hex
    },
    SET_COPIED_COLOR(state, color) {
      state.copiedColor = color
    },
    SET_COPIED_COLOR_INDEX(state, index) {
      state.copiedColorIndex = index
    }
  },
  actions: {
    SET_MAIN_COLOR({ commit, dispatch }) {
      const hsl = generateHsl()
      const rgb = hslToRgb(hsl)
      const hex = rgbToHex(rgb)
      commit('SET_MAIN_COLOR', hsl, rgb, hex)
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
    PASTE_COLOR({ commit, state }, slot) {
      if (!state.copiedColor) return
      const hsl = state.copiedColor
      const rgb = hslToRgb(hsl)
      const hex = rgbToHex(rgb)
      commit('SET_SLOT_COLOR', `slot${slot}`, { hsl, rgb, hex })
    }
  },
  getters: {
    uniqueColors: state => new Set(state.allColors.hsl),
    randomScheme: state => {
      const randomColors = []
      for (let i = 0; i < 4; i++) {
        randomColors.push(
          [...uniqueColors][Math.floor(Math.random() * uniqueColors.size)]
        )
      }
      return randomColors
    }
  }
})

export default store
