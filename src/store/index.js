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
    PASTE_COLOR({ commit, state }, slot) {
      if (!state.copiedColor || slot === 1) return
      const hsl = state.copiedColor
      const rgb = hslToRgb(hsl)
      const hex = rgbToHex(rgb)
      commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex })
    },
    SET_RANDOM_SCHEME({ commit, getters }) {
      const unique = [...getters.uniqueColors]
      for (let i = 2; i <= 5; i++) {
        const hsl = unique[Math.floor(Math.random() * unique.length)]
        const rgb = hslToRgb(hsl)
        const hex = rgbToHex(rgb)
        commit('SET_SLOT_COLOR', { slot: `slot${i}`, hsl, rgb, hex })
      }
    }
  },
  getters: {
    uniqueColors: state => new Set(state.allColors.hsl)
  }
})

export default store
