import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import MainNav from './MainNav.vue'

// Create a mock store
const createVuexStore = (state = {}) => {
  return createStore({
    state: {
      isUserSignedIn: state.isUserSignedIn || false,
      isFullscreen: state.isFullscreen || false,
    },
  })
}

describe('MainNav', () => {
  let wrapper
  let store

  beforeEach(() => {
    // Create a fresh store instance for each test
    store = createVuexStore({ isUserSignedIn: false, isFullscreen: false })
    wrapper = mount(MainNav, {
      global: {
        plugins: [store],
      }
    })
  })

  it('renders', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the instructions button', () => {
    expect(wrapper.find('[data-test="instructions-link"]').text()).toBe('Instructions')
  })

  it('renders the sign out button when the user is signed in', async () => {
    store.state.isUserSignedIn = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="sign-out-link"]').text()).toBe('Sign Out')
  })

  it('renders the sign in button when the user is not signed in', () => {
    expect(wrapper.find('[data-test="sign-in-link"]').text()).toBe('Sign In')
  })

  it('renders the fullscreen button with the correct icon when minimized', () => {
    expect(wrapper.find('[data-test="fullscreen-link-minimised"]').exists()).toBe(true)
    const fullscreenIcon = wrapper.find('[data-test="fullscreen-link-minimised"] i')
    expect(fullscreenIcon.classes()).toContain('fa-expand-arrows-alt')
  })

  it('toggles fullscreen mode when clicking the button', async () => {
    // Mock the document methods
    const mockRequestFullscreen = vi.fn()
    const mockExitFullscreen = vi.fn()

    document.documentElement.requestFullscreen = mockRequestFullscreen
    document.exitFullscreen = mockExitFullscreen

    // Click to enter fullscreen
    await wrapper.find('[data-test="fullscreen-link-minimised"]').trigger('click')
    expect(mockRequestFullscreen).toHaveBeenCalled()
    expect(wrapper.find('[data-test="fullscreen-link-maximised"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="fullscreen-link-maximised"] i').classes()).toContain('fa-window-minimize')

    // Click to exit fullscreen
    await wrapper.find('[data-test="fullscreen-link-maximised"]').trigger('click')
    expect(mockExitFullscreen).toHaveBeenCalled()
    expect(wrapper.find('[data-test="fullscreen-link-minimised"]').exists()).toBe(true)
  })

})
