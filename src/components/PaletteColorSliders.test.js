import { mount } from '@vue/test-utils';

import stateFactory from '../store/state';
import store from '../store';

import PaletteColorSliders from './PaletteColorSliders.vue';

const NUMBER_OF_SLOTS = 5;

// oxlint-disable-next-line max-lines-per-function
describe('component PaletteColorSliders', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        Object.assign(store.state, stateFactory());

        wrapper = mount(PaletteColorSliders, {
            global: { plugins: [store] },
            props: { slotNumber: 1 },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.restoreAllMocks();
    });

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('sets the main color hue when the hue input is adjusted', async () => {
        const hueButton = wrapper.find('[data-testid="hue-input"]');
        await hueButton.setValue('100');

        expect(store.state.mainHSL).toMatch(/hsl\(100,\s*\d+%,\s*\d+%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(100,\s*\d+%,\s*\d+%\)/,
        );
    });

    it('sets the main color saturation when the saturation input is adjusted', async () => {
        const saturationButton = wrapper.find('[data-testid="sat-input"]');
        await saturationButton.setValue('50');

        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*50%,\s*\d+%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(\d+,\s*50%,\s*\d+%\)/,
        );
    });

    it('sets the main color lightness when the lightness input is adjusted', async () => {
        const lightnessButton = wrapper.find('[data-testid="lum-input"]');
        await lightnessButton.setValue('25');

        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*\d+%,\s*25%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(\d+,\s*\d+%,\s*25%\)/,
        );
    });

    it('sets the main color to the values from hue, saturation, and lightness inputs', async () => {
        const hueButton = wrapper.find('[data-testid="hue-input"]');
        const saturationButton = wrapper.find('[data-testid="sat-input"]');
        const lightnessButton = wrapper.find('[data-testid="lum-input"]');
        await hueButton.setValue('100');
        await saturationButton.setValue('50');
        await lightnessButton.setValue('25');

        expect(store.state.mainHSL).toMatch(/hsl\(100,\s*50%,\s*25%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(100,\s*50%,\s*25%\)/,
        );
    });

    it('sets the other slots to the values from hue, saturation, and lightness inputs', async () => {
        for (let i = 2; i <= NUMBER_OF_SLOTS; i++) {
            // oxlint-disable-next-line no-await-in-loop
            await store.dispatch('UPDATE_SLOT_COLOR', {
                hsl: 'hsl(100, 50%, 25%)',
                slot: i,
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
        const dispatchSpy = vi.spyOn(store, 'dispatch');

        const localWrapper = mount(PaletteColorSliders, {
            global: { plugins: [store] },
            props: { slotNumber: 3 },
        });

        const hueButton = localWrapper.find('[data-testid="hue-input"]');
        const saturationButton = localWrapper.find('[data-testid="sat-input"]');
        const lightnessButton = localWrapper.find('[data-testid="lum-input"]');

        await hueButton.setValue('180');
        await saturationButton.setValue('60');
        await lightnessButton.setValue('45');

        expect(dispatchSpy).toHaveBeenCalledWith('UPDATE_SLOT_COLOR', {
            hsl: 'hsl(180, 60%, 45%)',
            slot: 3,
        });

        localWrapper.unmount();
    });
});
