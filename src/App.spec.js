import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore } from 'vuex'
import App from './App.vue'

// Create a mock store
const createVuexStore = (state = {}) => {
  return createStore({
    state: {
      mainHSL: state.mainHSL || null,
      isUserSignedIn: state.isUserSignedIn || false,
    },
    getters: {
      uniqueColors: () => new Set(state.uniqueColors || []),
    }
  })
}

describe('App.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    // Create a fresh store instance for each test
    store = createVuexStore({})
    wrapper = mount(App, {
      global: {
        plugins: [store],
      }
    })
  })

  it('renders the main navigation', () => {
    expect(wrapper.findComponent({ name: 'MainNav' }).exists()).toBe(true)
  })

  it('shows utility buttons when colors are present', async () => {
    const store = createVuexStore({
      uniqueColors: ['#FF0000']
    })

    wrapper = mount(App, {
      global: {
        plugins: [store],
      }
    })

    expect(wrapper.findComponent({ name: 'UtilityButtons' }).exists()).toBe(true)
  })

  it('hides utility buttons when no colors are present', () => {
    expect(wrapper.findComponent({ name: 'UtilityButtons' }).exists()).toBe(false)
  })

  it('shows saved palettes section when user is logged in', async () => {
    const store = createVuexStore({
      isUserSignedIn: true
    })

    wrapper = mount(App, {
      global: {
        plugins: [store],
      }
    })

    expect(wrapper.findComponent({ name: 'SavedPalettes' }).exists()).toBe(true)
  })

})