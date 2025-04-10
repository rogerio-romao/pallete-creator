import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import store from '../store';
import ColorSlot from './ColorSlot.vue';

describe('ColorSlot', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(ColorSlot, {
            global: { plugins: [store] },
            props: {
                slotNumber: 2,
            },
        });

        // Mock store dispatch
        store.dispatch = vi.fn();
    });

    it('calls PASTE_COLOR action when pasteColor is triggered', async () => {
        // Find the color slot element
        const colorSlot = wrapper.find('.color-slot');

        // Trigger click event
        await colorSlot.trigger('click');

        // Assert that store dispatch was called with correct action and parameter
        expect(store.dispatch).toHaveBeenCalledWith('PASTE_COLOR', 2);
    });

    it('calls UPDATE_LABEL action when updateLabel is triggered', async () => {
        // Find the label input
        const input = wrapper.find('.label input');

        // Set value and trigger change event
        await input.setValue('New Label');
        await input.trigger('change');

        // Assert that store dispatch was called with correct action and parameters
        expect(store.dispatch).toHaveBeenCalledWith('UPDATE_LABEL', {
            slotNumber: 2,
            label: 'New Label',
        });
    });
});
