import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';
// import store from '../store/index';
import UtilityButtons from './UtilityButtons.vue';

// Create a mock store
const createVuexStore = (state = {}) => {
    return createStore({
        state: {
            isUserSignedIn: false,
            mainHSL: 'hsl(20, 20%, 20%)',
            mainSlotColor: {
                hsl: '',
                rgb: '',
                hex: '',
            },
            slotColors: {
                slot2: {
                    hsl: '',
                    rgb: '',
                    hex: '',
                },
                slot3: {
                    hsl: '',
                    rgb: '',
                    hex: '',
                },
                slot4: {
                    hsl: '',
                    rgb: '',
                    hex: '',
                },
                slot5: {
                    hsl: '',
                    rgb: '',
                    hex: '',
                },
            },
            siteColors: {
                main: '#1d1702',
                complementary: '#f2edd9',
                light: '#d9def2',
                accent: '#087d65',
                dark: '#404f4c',
            },
        },
        getters: {
            // Mock the uniqueColors getter
            uniqueColors: () => [
                'hsl(180, 50%, 50%)',
                'hsl(200, 50%, 50%)',
                'hsl(220, 50%, 50%)',
                'hsl(240, 50%, 50%)',
                'hsl(260, 50%, 50%)',
            ],
            fullSchemeSet: (state) =>
                Object.values(state.slotColors).every(
                    (color) => color.hsl !== ''
                ),
        },
        mutations: {
            SET_SLOT_COLOR: (state, { slot, hsl, rgb, hex }) => {
                state.slotColors[slot] = { hsl, rgb, hex };
            },
            SET_TEXT_COLOR(state, colors) {
                state.textColor = colors;
            },
            SET_USER_SIGN_IN(state, value) {
                state.isUserSignedIn = value;
            },
        },
        actions: {
            SET_RANDOM_SCHEME({ commit, state, getters }) {
                const unique = [...getters.uniqueColors];
                const randomScheme = new Set();
                while (randomScheme.size < 4) {
                    const hsl =
                        unique[Math.floor(Math.random() * unique.length)];
                    if (!randomScheme.has(hsl) && hsl !== state.mainHSL) {
                        randomScheme.add(hsl);
                    }
                }
                let slot = 2;
                randomScheme.forEach((hsl) => {
                    const rgb = `rgb(0, 0, 0)`; // Simplified for testing
                    const hex = '#000000'; // Simplified for testing
                    commit('SET_SLOT_COLOR', {
                        slot: `slot${slot}`,
                        hsl,
                        rgb,
                        hex,
                    });
                    slot++;
                });
            },
            SET_TEXT_COLOR({ commit }, type) {
                if (type === 'light') {
                    commit('SET_TEXT_COLOR', {
                        hsl: 'hsl(34, 78%, 91%)',
                        rgb: 'rgb(250, 235, 215)',
                        hex: '#faebd7',
                    });
                } else if (type === 'dark') {
                    commit('SET_TEXT_COLOR', {
                        hsl: 'hsl(218, 27%, 8%)',
                        rgb: 'rgb(15, 19, 26)',
                        hex: '#0f131a',
                    });
                }
            },
        },
    });
};

describe('UtilityButtons', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        store = createVuexStore();
        wrapper = mount(UtilityButtons, {
            global: { plugins: [store] },
        });
    });

    it('renders the component', () => {
        expect(wrapper.find('[data-test="utility-buttons"]').exists()).toBe(
            true
        );
        expect(
            wrapper.find('[data-test="random-scheme-button"]').exists()
        ).toBe(true);
    });

    it('calls SET_RANDOM_SCHEME when random button is clicked', async () => {
        const spy = vi.spyOn(store, 'dispatch').mockResolvedValue();

        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        expect(spy).toHaveBeenCalledWith('SET_RANDOM_SCHEME');
        spy.mockRestore();
    });

    it('fills the slots with random colors', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for all promises to resolve
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();

        const slotColors = store.state.slotColors;
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

        buttons.forEach((button) => {
            expect(wrapper.find(`[data-test="${button}"]`).exists()).toBe(
                false
            );
        });

        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for the next tick
        await wrapper.vm.$nextTick();

        buttons.forEach((button) => {
            expect(wrapper.find(`[data-test="${button}"]`).exists()).toBe(true);
        });
    });

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
            document.documentElement
        ).getPropertyValue('--clr-main');
        const complementaryColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-complementary');
        const lightColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-light');
        const accentColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-accent');
        const accentLightColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-accent-light');

        expect(mainColor).toBe(mainSlotColor);
        expect(complementaryColor).toBe(slot2Color);
        expect(lightColor).toBe(slot3Color);
        expect(accentColor).toBe(slot4Color);
        expect(accentLightColor).toBe(slot5Color);
    });

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
            document.documentElement
        ).getPropertyValue('--clr-main');
        expect(mainColor).not.toBe(store.state.siteColors.main);

        await wrapper
            .find('[data-test="reset-site-colors-button"]')
            .trigger('click');

        const mainColorAfterReset = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-main');
        const complementaryColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-complementary');
        const lightColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-light');
        const accentColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-accent');
        const accentLightColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--clr-accent-light');

        expect(mainColorAfterReset).toBe(store.state.siteColors.main);
        expect(complementaryColor).toBe(store.state.siteColors.complementary);
        expect(lightColor).toBe(store.state.siteColors.light);
        expect(accentColor).toBe(store.state.siteColors.accent);
        expect(accentLightColor).toBe(store.state.siteColors.dark);
    });

    it('sets the text colors to light when the light button is clicked', async () => {
        const LIGHT_TEXT_COLOR = '#faebd7';
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="set-light-text-button"]')
            .trigger('click');

        const mainTextColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--text-color');

        expect(mainTextColor).toBe(store.state.textColor.hex);
        expect(mainTextColor).toBe(LIGHT_TEXT_COLOR);
    });

    it('sets the text colors to dark when the dark button is clicked', async () => {
        const DARK_TEXT_COLOR = '#0f131a';
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="set-dark-text-button"]')
            .trigger('click');

        const mainTextColor = getComputedStyle(
            document.documentElement
        ).getPropertyValue('--text-color');

        expect(mainTextColor).toBe(store.state.textColor.hex);
        expect(mainTextColor).toBe(DARK_TEXT_COLOR);
    });

    it('sends copyPalette event when the export css button is clicked', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper.find('[data-test="export-css-button"]').trigger('click');

        // expect to emit copyPallete event
        expect(wrapper.emitted('copyPalette')).toBeTruthy();
    });

    it('sends openSignInModal event when the save palette button is clicked by logged out user', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="save-palette-button"]')
            .trigger('click');

        // expect to emit savePallete event
        expect(wrapper.emitted('openSignInModal')).toBeTruthy();
    });

    it('sends savePalette event when the save palette button is clicked by logged in user', async () => {
        store.commit('SET_USER_SIGN_IN', true); // Update the state correctly

        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        await wrapper.vm.$nextTick();

        await wrapper
            .find('[data-test="save-palette-button"]')
            .trigger('click');

        // expect to emit savePalette event
        expect(wrapper.emitted('savePalette')).toBeTruthy();
    });
});
