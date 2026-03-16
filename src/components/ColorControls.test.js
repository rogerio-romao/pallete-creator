import { mount } from '@vue/test-utils';

import store from '../store';

import ColorControls from './ColorControls.vue';

const NUMBER_OF_SLOTS = 5;

// oxlint-disable-next-line max-lines-per-function
describe('component ColorControls', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        wrapper = mount(ColorControls, {
            global: { plugins: [store] },
        });
    });

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('sets the main color hue when the hue input is adjusted', async () => {
        wrapper.vm.$props = { slotNumber: 1 };
        const hueButton = wrapper.find('[data-test="hue-input"]');
        await hueButton.setValue('100');
        expect(store.state.mainHSL).toMatch(/hsl\(100,\s*\d+%,\s*\d+%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(100,\s*\d+%,\s*\d+%\)/,
        );
    });

    it('sets the main color saturation when the saturation input is adjusted', async () => {
        wrapper.vm.$props = { slotNumber: 1 };
        const saturationButton = wrapper.find('[data-test="sat-input"]');
        await saturationButton.setValue('50');
        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*50%,\s*\d+%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(\d+,\s*50%,\s*\d+%\)/,
        );
    });

    it('sets the main color lightness when the lightness input is adjusted', async () => {
        wrapper.vm.$props = { slotNumber: 1 };
        const lightnessButton = wrapper.find('[data-test="lum-input"]');
        await lightnessButton.setValue('25');
        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*\d+%,\s*25%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(\d+,\s*\d+%,\s*25%\)/,
        );
    });

    it('sets the main color to the values from hue, saturation, and lightness inputs', async () => {
        wrapper.vm.$props = { slotNumber: 1 };
        const hueButton = wrapper.find('[data-test="hue-input"]');
        const saturationButton = wrapper.find('[data-test="sat-input"]');
        const lightnessButton = wrapper.find('[data-test="lum-input"]');
        await hueButton.setValue('100');
        await saturationButton.setValue('50');
        await lightnessButton.setValue('25');

        expect(store.state.mainHSL).toMatch(/hsl\(100,\s*50%,\s*25%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(100,\s*50%,\s*25%\)/,
        );
    });

    it('sets the other slots to the values from hue, saturation, and lightness inputs', async () => {
        const hueButton = wrapper.find('[data-test="hue-input"]');
        const saturationButton = wrapper.find('[data-test="sat-input"]');
        const lightnessButton = wrapper.find('[data-test="lum-input"]');
        await hueButton.setValue('100');
        await saturationButton.setValue('50');
        await lightnessButton.setValue('25');

        for (let i = 2; i <= NUMBER_OF_SLOTS; i++) {
            wrapper.vm.$props = { slotNumber: i };
            store.dispatch('UPDATE_SLOT_COLOR', {
                hsl: `hsl(100, 50%, 25%)`,
                slot: wrapper.vm.$props.slotNumber,
            });
            expect(store.state.slotColors[`slot${i}`].hsl).toMatch(
                /hsl\(100,\s*50%,\s*25%\)/,
            );
            expect(store.state.slotColors[`slot${i}`].rgb).toMatch(
                /rgb\(53,\s*96,\s*32\)/,
            );
            expect(store.state.slotColors[`slot${i}`].hex).toMatch(/#356020/);
        }
    });

    it('dispatches UPDATE_SLOT_COLOR action when updating non-main slot colors', async () => {
        // Create a spy on the store.dispatch method
        const dispatchSpy = vi.spyOn(store, 'dispatch');

        // Set the component to use a non-main slot
        wrapper = mount(ColorControls, {
            global: { plugins: [store] },
            props: {
                slotNumber: 3,
            },
        });

        // Set the HSL values
        const hueButton = wrapper.find('[data-test="hue-input"]');
        const saturationButton = wrapper.find('[data-test="sat-input"]');
        const lightnessButton = wrapper.find('[data-test="lum-input"]');

        await hueButton.setValue('180');
        await saturationButton.setValue('60');
        await lightnessButton.setValue('45');

        // Check if the UPDATE_SLOT_COLOR action was dispatched with correct parameters
        expect(dispatchSpy).toHaveBeenCalledWith('UPDATE_SLOT_COLOR', {
            hsl: 'hsl(180, 60%, 45%)',
            slot: 3,
        });

        // Restore the spy
        dispatchSpy.mockRestore();
    });
});
