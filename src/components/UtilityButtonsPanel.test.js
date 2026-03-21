// oxlint-disable max-lines

import { mount } from '@vue/test-utils';

import { DEFAULT_HEX_COLORS } from '../lib/colors';
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
        store.state.allColors = [
            {
                hex: '#40BFBF',
                hsl: 'hsl(180, 50%, 50%)',
                rgb: 'rgb(64,191,191)',
                type: 'analogous',
            },
            {
                hex: '#4080BF',
                hsl: 'hsl(200, 50%, 50%)',
                rgb: 'rgb(64,128,191)',
                type: 'complement',
            },
            {
                hex: '#B3C4D6',
                hsl: 'hsl(220, 50%, 85%)',
                rgb: 'rgb(179,196,214)',
                type: 'triad',
            },
            {
                hex: '#13133D',
                hsl: 'hsl(240, 50%, 15%)',
                rgb: 'rgb(19,19,61)',
                type: 'mono',
            },
            {
                hex: '#8040BF',
                hsl: 'hsl(260, 50%, 50%)',
                rgb: 'rgb(128,64,191)',
                type: 'saturation',
            },
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
            wrapper.find('[data-testid="utility-buttons"]').exists(),
        ).toBeTruthy();
        expect(
            wrapper.find('[data-testid="random-scheme-button"]').exists(),
        ).toBeTruthy();
        expect(
            wrapper.find('[data-testid="one-shot-button"]').exists(),
        ).toBeTruthy();
    });

    it('calls SET_RANDOM_SCHEME when random button is clicked', async () => {
        const spy = vi.spyOn(store, 'dispatch').mockResolvedValue(null);

        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');

        expect(spy).toHaveBeenCalledWith('SET_RANDOM_SCHEME');
    });

    it('fills the slots with random colors', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        const { slotColors, mainHSL } = store.state;
        const slots = ['slot2', 'slot3', 'slot4', 'slot5'];

        for (const slotId of slots) {
            const color = slotColors[slotId];

            expect(color.hsl).toContain('hsl');
            expect(color.rgb).toContain('rgb');
            expect(color.hex).toContain('#');

            // Check uniqueness against main color
            expect(color.hsl).not.toBe(mainHSL);

            // Check uniqueness against other slots
            const otherSlots = slots.filter((s) => s !== slotId);
            for (const otherId of otherSlots) {
                expect(color.hsl).not.toBe(slotColors[otherId].hsl);
            }
        }
    });

    it('show the one-shot button always, even when the full scheme is not set', () => {
        store.state.allColors = [];
        expect(
            wrapper.find('[data-testid="one-shot-button"]').exists(),
        ).toBeTruthy();
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
                wrapper.find(`[data-testid="${button}"]`).exists(),
            ).toBeFalsy();
        }

        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        for (const button of buttons) {
            expect(
                wrapper.find(`[data-testid="${button}"]`).exists(),
            ).toBeTruthy();
        }
    });

    it('sets the theme colors when the test palette button is clicked', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        const { mainSlotColor, slotColors } = store.state;

        await wrapper
            .find('[data-testid="test-palette-button"]')
            .trigger('click');

        const expectedColors = {
            '--clr-accent': slotColors.slot3.hex,
            '--clr-dark': slotColors.slot5.hex,
            '--clr-light': slotColors.slot4.hex,
            '--clr-main': mainSlotColor.hex,
            '--clr-secondary': slotColors.slot2.hex,
        };

        for (const [variable, expectedHex] of Object.entries(expectedColors)) {
            const actualHex = getComputedStyle(
                document.documentElement,
            ).getPropertyValue(variable);
            expect(actualHex).toBe(expectedHex);
        }
    });

    it('resets the site colors when the reset button is clicked', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-testid="test-palette-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        const mainColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--clr-main');

        expect(mainColor).not.toBe(DEFAULT_HEX_COLORS.MAIN);

        await wrapper
            .find('[data-testid="reset-site-colors-button"]')
            .trigger('click');

        const variables = [
            '--clr-main',
            '--clr-secondary',
            '--clr-accent',
            '--clr-light',
            '--clr-dark',
        ];

        for (const variable of variables) {
            expect(
                document.documentElement.style.getPropertyValue(variable),
            ).toBe('');
        }
    });

    it('sets the text color to the default light color when the light button is clicked', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-testid="set-light-text-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        const textColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--text-color');

        expect(textColor).toBe(DEFAULT_HEX_COLORS.LIGHT);
        expect(store.state.textColor.hex).toBe(DEFAULT_HEX_COLORS.LIGHT);
    });

    it('sets the text color to the default dark color when the dark button is clicked', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-testid="set-dark-text-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        const textColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue('--text-color');

        expect(textColor).toBe(DEFAULT_HEX_COLORS.DARK);
        expect(store.state.textColor.hex).toBe(DEFAULT_HEX_COLORS.DARK);
    });

    it('sends copyPalette event when the export css button is clicked', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-testid="export-css-button"]')
            .trigger('click');

        expect(wrapper.emitted('copyPalette')).toBeTruthy();
    });

    it('sends savePalette event when the save palette button is clicked', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-testid="save-palette-button"]')
            .trigger('click');

        expect(wrapper.emitted('savePalette')).toBeTruthy();
    });

    it('one-shot button dispatches SET_MAIN_COLOR and SET_RANDOM_SCHEME', async () => {
        const spy = vi.spyOn(store, 'dispatch').mockResolvedValue(null);

        await wrapper.find('[data-testid="one-shot-button"]').trigger('click');

        expect(spy).toHaveBeenCalledWith('SET_MAIN_COLOR');
        expect(spy).toHaveBeenCalledWith('SET_RANDOM_SCHEME');
    });

    it('one-shot button sets a full random palette and applies CSS vars', async () => {
        await wrapper.find('[data-testid="one-shot-button"]').trigger('click');

        await wrapper.vm.$nextTick();

        const { slotColors, mainSlotColor } = store.state;

        expect(mainSlotColor.hex).not.toBe('');

        const slots = ['slot2', 'slot3', 'slot4', 'slot5'];
        for (const slotId of slots) {
            expect(slotColors[slotId].hsl).not.toBe('');
        }

        const expectedColors = {
            '--clr-accent': slotColors.slot3.hex,
            '--clr-dark': slotColors.slot5.hex,
            '--clr-light': slotColors.slot4.hex,
            '--clr-main': mainSlotColor.hex,
            '--clr-secondary': slotColors.slot2.hex,
        };

        for (const [variable, expectedHex] of Object.entries(expectedColors)) {
            expect(
                document.documentElement.style.getPropertyValue(variable),
            ).toBe(expectedHex);
        }
    });

    it('one-shot button sets isTestingColorScheme to true', async () => {
        await wrapper.find('[data-testid="one-shot-button"]').trigger('click');

        await wrapper.vm.$nextTick();

        expect(store.state.isTestingColorScheme).toBeTruthy();
    });

    it('Test this palette applies text color from palette (dark theme uses slot4)', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        // default theme is dark → text should use slot4
        const { slot4 } = store.state.slotColors;

        await wrapper
            .find('[data-testid="test-palette-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        expect(store.state.textColor.hex).toBe(slot4.hex);
        expect(
            document.documentElement.style.getPropertyValue('--text-color'),
        ).toBe(slot4.hex);
    });

    it('Light Text uses slot4 color when testing', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        store.commit('SET_IS_TESTING', true);

        const { slot4 } = store.state.slotColors;

        await wrapper
            .find('[data-testid="set-light-text-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        expect(store.state.textColor.hex).toBe(slot4.hex);
    });

    it('Dark Text uses slot5 color when testing', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        store.commit('SET_IS_TESTING', true);

        const { slot5 } = store.state.slotColors;

        await wrapper
            .find('[data-testid="set-dark-text-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        expect(store.state.textColor.hex).toBe(slot5.hex);
    });

    it('Light Text uses theme default when not testing', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        store.commit('SET_IS_TESTING', false);

        await wrapper
            .find('[data-testid="set-light-text-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        expect(store.state.textColor.hex).toBe(DEFAULT_HEX_COLORS.LIGHT);
    });

    // oxlint-disable-next-line max-statements
    it('Reset restores text color to theme default', async () => {
        await wrapper
            .find('[data-testid="random-scheme-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        store.commit('SET_IS_TESTING', true);
        await store.dispatch('SET_TEXT_COLOR', 'dark');

        await wrapper
            .find('[data-testid="reset-site-colors-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        expect(store.state.isTestingColorScheme).toBeFalsy();
        // default theme is dark → textType becomes 'light'
        expect(store.state.textColor.hex).toBe(DEFAULT_HEX_COLORS.LIGHT);
    });
});
