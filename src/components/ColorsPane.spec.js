import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createStore } from 'vuex'
import ColorsPane from './ColorsPane.vue'

const createVuexStore = () => {
    return createStore({
        state: {
            copiedColor: null,
            copiedColorIndex: -1,
            mainHSL: 'hsl(180, 50%, 50%)',
            mainSlotColor: { hsl: '', rgb: '', hex: '' },
            slotColors: {
                slot2: { hsl: '', rgb: '', hex: '' },
                slot3: { hsl: '', rgb: '', hex: '' },
                slot4: { hsl: '', rgb: '', hex: '' },
                slot5: { hsl: '', rgb: '', hex: '' },
            },
            labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
            textColor: { hsl: '', rgb: '', hex: '' },
        },
    })
}

describe('ColorsPane', () => {
    it('renders collapsed message when collapsed', () => {
        const store = createVuexStore()
        const wrapper = mount(ColorsPane, {
            props: { isColorPaneCollapsed: true },
            global: { plugins: [store] }
        })
        expect(wrapper.text()).toContain('Click the arrow to expand panel')
        expect(wrapper.find('.hide').exists()).toBe(false)
    })

    it('renders slots when not collapsed', () => {
        const store = createVuexStore()
        const wrapper = mount(ColorsPane, {
            props: { isColorPaneCollapsed: false },
            global: { plugins: [store] }
        })
        expect(wrapper.text()).not.toContain('Click the arrow to expand panel')
        expect(wrapper.find('.palette-pane-slots').exists()).toBe(true)
    })

    it('has correct default prop', () => {
        const store = createVuexStore()
        const wrapper = mount(ColorsPane, {
            global: { plugins: [store] }
        })
        expect(wrapper.props('isColorPaneCollapsed')).toBe(false)
    })
})
