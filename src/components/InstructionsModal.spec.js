import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InstructionsModal from './InstructionsModal.vue'

describe('InstructionsModal', () => {
    it('renders the modal', () => {
        const wrapper = mount(InstructionsModal)
        expect(wrapper.find('h3').text()).toBe('Instructions')
    })

    it('contains instruction text', () => {
        const wrapper = mount(InstructionsModal)
        expect(wrapper.text()).toContain('generate a main color')
    })

    it('emits close event when close button clicked', async () => {
        const wrapper = mount(InstructionsModal)
        
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('close')).toBeTruthy()
    })
})
