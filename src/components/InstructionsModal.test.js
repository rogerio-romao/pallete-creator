import { mount } from '@vue/test-utils';

import InstructionsModal from './InstructionsModal.vue';

describe('component InstructionsModal', () => {
    it('renders the modal', () => {
        const wrapper = mount(InstructionsModal);

        expect(wrapper.find('[data-testid="instructions-title"]').text()).toBe(
            'Instructions',
        );
    });

    it('contains instruction text', () => {
        const wrapper = mount(InstructionsModal);

        expect(wrapper.text()).toContain('random palette is generated on load');
    });

    it('emits close event when close button clicked', async () => {
        const wrapper = mount(InstructionsModal);
        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('emits close event when Escape key is pressed', async () => {
        const wrapper = mount(InstructionsModal, {
            attachTo: document.body,
        });

        await wrapper.trigger('keydown', { key: 'Escape' });

        expect(wrapper.emitted('close')).toBeTruthy();

        wrapper.unmount();
    });
});
