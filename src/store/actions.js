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
import { app, db } from '../lib/firebase'
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'

const actions = {
  // trigerred when user clicks on a mini slot for copying
  COPY_COLOR({ commit }, { color, index }) {
    commit('SET_COPIED_COLOR', color)
    commit('SET_COPIED_COLOR_INDEX', index)
  },
  // deletes a scheme from local storage
  async DELETE_PALETTE({ commit, state, dispatch }, id) {
    await deleteDoc(doc(db, 'palettes', id))
    console.log(`deleted ${id}`)
    dispatch('LOAD_PALETTES')
    // const palettes = JSON.parse(localStorage.getItem('palettes'))
    // const newPalettes = palettes.filter(p => p.id !== id)
    // localStorage.setItem('palettes', JSON.stringify(newPalettes))
    // commit('SET_SAVED_PALETTES', newPalettes)
  },
  // trigerred when user generates a main color
  GENERATE_VARIATIONS({ commit }, { color, fn }) {
    const variations = fn(color)
    variations.forEach(hsl => {
      const rgb = hslToRgb(hsl)
      const hex = rgbToHex(rgb)
      commit('ADD_COLOR', { hsl, rgb, hex })
    })
  },
  async LOAD_PALETTES({ commit }) {
    const querySnapshot = await getDocs(collection(db, 'palettes'))
    const palettes = querySnapshot.docs.map(doc => {
      const data = doc.data()
      data.id = doc.id
      return data
    })
    commit('SET_SAVED_PALETTES', palettes)
  },
  // pastes the selected variation on the specific color slot
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
  // saves the palette to local storage
  SAVE_PALETTE({ commit }, { name, scheme }) {
    const palettes = JSON.parse(localStorage.getItem('palettes')) || []
    palettes.push({ name, scheme, id: palettes.length })
    commit('SET_SAVED_PALETTES', palettes)
    localStorage.setItem('palettes', JSON.stringify(palettes))
  },
  // save to firebase
  async SAVE_TO_CLOUD({ commit, state, dispatch }, { name, scheme }) {
    try {
      const docRef = await addDoc(collection(db, 'palettes'), {
        user: state.userEmail,
        name,
        scheme
      })
      console.log('Document written with ID: ', docRef.id)
      dispatch('LOAD_PALETTES')
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  },
  // resets everything, sets the main color and generates variations
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
  // makes the site colors be this scheme
  SET_PALETTE_FROM_SAVED({ commit, dispatch }, palette) {
    const [main, ...others] = palette
    dispatch('SET_MAIN_COLOR', main.hsl)
    others.forEach((slot, index) => {
      dispatch('UPDATE_SLOT_COLOR', { slot: index + 2, hsl: slot.hsl })
    })
  },
  // fills the slots with random unique colors from the variations
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
  // changes the text colors from light to dark
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
  // login user
  SIGNIN_USER({ commit, dispatch }, email) {
    commit('SET_USER', email)
    dispatch('LOAD_PALETTES')
  },
  // logout user
  SIGNOUT_USER({ commit }) {
    commit('SET_USER', null)
  },
  // updates the label of a specific slot
  UPDATE_LABEL({ commit }, { label, slotNumber }) {
    label = label[0].toUpperCase() + label.slice(1)
    commit('SET_LABEL', { label, slotNumber })
  },
  // updates the color of a specific slot
  UPDATE_SLOT_COLOR({ commit }, { slot, hsl }) {
    const rgb = hslToRgb(hsl)
    const hex = rgbToHex(rgb)
    commit('SET_SLOT_COLOR', { slot: `slot${slot}`, hsl, rgb, hex })
  }
}

export default actions
