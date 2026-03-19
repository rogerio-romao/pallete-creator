import { mount } from '@vue/test-utils';

import store from '../store';

import PaletteColorSlot from './PaletteColorSlot.vue';

describe('componentColorSlot', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        wrapper = mount(PaletteColorSlot, {
            global: { plugins: [store] },
            props: {
                slotNumber: 2,
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.restoreAllMocks();
    });

    it('calls PASTE_COLOR action when pasteColor is triggered', async () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        const colorSlot = wrapper.find('[data-testid="palette-color-slot"]');

        await colorSlot.trigger('click');

        // Assert that store dispatch was called with correct action and parameter
        // oxlint-disable-next-line no-magic-numbers -- its the slot number from the wrapper props for this test
        expect(dispatchSpy).toHaveBeenCalledWith('PASTE_COLOR', 2);
    });

    it('calls UPDATE_LABEL action when updateLabel is triggered', async () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        const input = wrapper.find(
            '[data-testid="palette-color-slot-label-input"]',
        );

        await input.setValue('New Label');
        await input.trigger('change');

        // Assert that store dispatch was called with correct action and parameters
        expect(dispatchSpy).toHaveBeenCalledWith('UPDATE_LABEL', {
            label: 'New Label',
            slotNumber: 2,
        });
    });
});
