// oxlint-disable jest/max-expects
// oxlint-disable max-lines

import { mount } from '@vue/test-utils';

import DEFAULT_HEX_COLORS from '../lib/colors';
import stateFactory from '../store/state';
import store from '../store';

import UtilityButtonsPanel from './UtilityButtonsPanel.vue';

// oxlint-disable-next-line max-lines-per-function
describe('component UtilityButtonsPanel', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        Object.assign(store.state, stateFactory());
        store.state.mainHSL = 'hsl(20, 20%, 20%)';
        store.state.allColors.hsl = [
            'hsl(180, 50%, 50%)',
            'hsl(200, 50%, 50%)',
            'hsl(220, 50%, 50%)',
            'hsl(240, 50%, 50%)',
            'hsl(260, 50%, 50%)',
        ];

        wrapper = mount(UtilityButtonsPanel, {
            global: { plugins: [store] },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.restoreAllMocks();
    });

    it('renders the component', () => {
        expect(
            wrapper.find('[data-test="utility-buttons"]').exists(),
        ).toBeTruthy();
        expect(
            wrapper.find('[data-test="random-scheme-button"]').exists(),
        ).toBeTruthy();
    });

    it('calls SET_RANDOM_SCHEME when random button is clicked', async () => {
        const spy = vi.spyOn(store, 'dispatch').mockResolvedValue(null);

        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        expect(spy).toHaveBeenCalledWith('SET_RANDOM_SCHEME');
    });

    // oxlint-disable-next-line max-statements
    it('fills the slots with random colors', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        const { slotColors } = store.state;
        expect(slotColors.slot2.hsl).not.toBe('');
        expect(slotColors.slot2.hsl).not.toBe(store.state.mainHSL);
        expect(slotColors.slot2.hsl).not.toBe(slotColors.slot3.hsl);
        expect(slotColors.slot2.hsl).not.toBe(slotColors.slot4.hsl);
        expect(slotColors.slot2.hsl).not.toBe(slotColors.slot5.hsl);
        expect(slotColors.slot2.hsl).toContain('hsl');
        expect(slotColors.slot2.rgb).not.toBe('');
        expect(slotColors.slot2.rgb).toContain('rgb');
        expect(slotColors.slot2.hex).not.toBe('');
        expect(slotColors.slot2.hex).toContain('#');
        expect(slotColors.slot3.hsl).not.toBe('');
        expect(slotColors.slot3.hsl).not.toBe(store.state.mainHSL);
        expect(slotColors.slot3.hsl).not.toBe(slotColors.slot2.hsl);
        expect(slotColors.slot3.hsl).not.toBe(slotColors.slot4.hsl);
        expect(slotColors.slot3.hsl).not.toBe(slotColors.slot5.hsl);
        expect(slotColors.slot3.rgb).not.toBe('');
        expect(slotColors.slot3.rgb).toContain('rgb');
        expect(slotColors.slot3.hex).not.toBe('');
        expect(slotColors.slot3.hex).toContain('#');
        expect(slotColors.slot4.hsl).not.toBe('');
        expect(slotColors.slot4.hsl).not.toBe(store.state.mainHSL);
        expect(slotColors.slot4.hsl).not.toBe(slotColors.slot2.hsl);
        expect(slotColors.slot4.hsl).not.toBe(slotColors.slot3.hsl);
        expect(slotColors.slot4.hsl).not.toBe(slotColors.slot5.hsl);
        expect(slotColors.slot4.rgb).not.toBe('');
        expect(slotColors.slot4.rgb).toContain('rgb');
        expect(slotColors.slot4.hex).not.toBe('');
        expect(slotColors.slot4.hex).toContain('#');
        expect(slotColors.slot5.hsl).not.toBe('');
        expect(slotColors.slot5.hsl).not.toBe(store.state.mainHSL);
        expect(slotColors.slot5.hsl).not.toBe(slotColors.slot2.hsl);
        expect(slotColors.slot5.hsl).not.toBe(slotColors.slot3.hsl);
        expect(slotColors.slot5.hsl).not.toBe(slotColors.slot4.hsl);
        expect(slotColors.slot5.rgb).not.toBe('');
        expect(slotColors.slot5.rgb).toContain('rgb');
        expect(slotColors.slot5.hex).not.toBe('');
        expect(slotColors.slot5.hex).toContain('#');
    });

    it('shows all buttons when the full scheme is set', async () => {
        const buttons = [
            'test-palette-button',
            'reset-site-colors-button',
            'set-light-text-button',
            'set-dark-text-button',
            'export-css-button',
            'save-palette-button',
        ];

        for (const button of buttons) {
            expect(
                wrapper.find(`[data-test="${button}"]`).exists(),
            ).toBeFalsy();
        }

        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        for (const button of buttons) {
            expect(
                wrapper.find(`[data-test="${button}"]`).exists(),
            ).toBeTruthy();
        }
    });

    // oxlint-disable-next-line max-statements
    it('sets the theme colors when the test palette button is clicked', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        const mainSlotColor = store.state.mainSlotColor.hex;
        const slot2Color = store.state.slotColors.slot2.hex;
        const slot3Color = store.state.slotColors.slot3.hex;
        const slot4Color = store.state.slotColors.slot4.hex;
        const slot5Color = store.state.slotColors.slot5.hex;

        await wrapper
            .find('[data-test="test-palette-button"]')
            .trigger('click');

        const mainColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-main');
        const complementaryColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-complementary');
        const lightColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-light');
        const accentColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-accent');
        const accentLightColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-accent-light');

        expect(mainColor).toBe(mainSlotColor);
        expect(complementaryColor).toBe(slot2Color);
        expect(lightColor).toBe(slot3Color);
        expect(accentColor).toBe(slot4Color);
        expect(accentLightColor).toBe(slot5Color);
    });

    // oxlint-disable-next-line max-statements
    it('resets the site colors when the reset button is clicked', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="test-palette-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        const mainColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-main');

        expect(mainColor).not.toBe(DEFAULT_HEX_COLORS.MAIN);

        await wrapper
            .find('[data-test="reset-site-colors-button"]')
            .trigger('click');

        const mainColorAfterReset = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-main');
        const complementaryColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-complementary');
        const lightColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-light');
        const accentColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-accent');
        const accentLightColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-accent-light');

        expect(mainColorAfterReset).toBe(DEFAULT_HEX_COLORS.MAIN);
        expect(complementaryColor).toBe(DEFAULT_HEX_COLORS.COMPLEMENTARY);
        expect(lightColor).toBe(DEFAULT_HEX_COLORS.LIGHT);
        expect(accentColor).toBe(DEFAULT_HEX_COLORS.ACCENT);
        expect(accentLightColor).toBe(DEFAULT_HEX_COLORS.ACCENT_LIGHT);
    });

    it('sets the text colors to light when the light button is clicked', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="set-light-text-button"]')
            .trigger('click');

        const mainTextColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--text-color');

        expect(mainTextColor).toBe(store.state.textColor.hex);
        expect(mainTextColor).toBe(DEFAULT_HEX_COLORS.LIGHT_TEXT);
    });

    it('sets the text colors to dark when the dark button is clicked', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="set-dark-text-button"]')
            .trigger('click');

        const mainTextColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--text-color');

        expect(mainTextColor).toBe(store.state.textColor.hex);
        expect(mainTextColor).toBe(DEFAULT_HEX_COLORS.DARK_TEXT);
    });

    it('sends copyPalette event when the export css button is clicked', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper.find('[data-test="export-css-button"]').trigger('click');

        expect(wrapper.emitted('copyPalette')).toBeTruthy();
    });

    it('sends savePalette event when the save palette button is clicked', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="save-palette-button"]')
            .trigger('click');

        expect(wrapper.emitted('savePalette')).toBeTruthy();
    });
});
