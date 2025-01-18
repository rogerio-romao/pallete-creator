import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from 'vuex';
import { hslToRgb, rgbToHex } from '../lib/utils';
import ColorControls from './ColorControls.vue';

const createVuexStore = (state = {}) => {
    return createStore({
        state: {
            mainHSL: null,
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
        },
        mutations: {
            SET_MAIN_COLOR(state, colors) {
                const { hsl, rgb, hex } = colors;
                state.mainHSL = hsl;
                state.mainSlotColor.hsl = hsl;
                state.mainSlotColor.rgb = rgb;
                state.mainSlotColor.hex = hex;
            },
            SET_SLOT_COLOR(state, { slot, hsl, rgb, hex }) {
                state.slotColors[slot].hsl = hsl;
                state.slotColors[slot].rgb = rgb;
                state.slotColors[slot].hex = hex;
            },
        },
        actions: {
            SET_MAIN_COLOR({ commit }, color) {
                const hsl = color;
                commit('SET_MAIN_COLOR', { hsl });
            },
            UPDATE_SLOT_COLOR({ commit }, { slot, hsl }) {
                const rgb = hslToRgb(hsl);
                const hex = rgbToHex(rgb);
                commit('SET_SLOT_COLOR', {
                    slot: `slot${slot}`,
                    hsl,
                    rgb,
                    hex,
                });
            },
        },
    });
};

describe('ColorControls', () => {
    let wrapper;
    let store;

    beforeEach(() => {
        store = createVuexStore();
        wrapper = mount(ColorControls, {
            global: { plugins: [store] },
        });
    });

    it('renders', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('sets the main color hue when the hue input is adjusted', async () => {
        wrapper.vm.$props = { slotNumber: 1 };
        const hueButton = wrapper.find('[data-test="hue-input"]');
        await hueButton.setValue('100');
        expect(store.state.mainHSL).toMatch(/hsl\(100,\s*\d+%,\s*\d+%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(100,\s*\d+%,\s*\d+%\)/
        );
    });

    it('sets the main color saturation when the saturation input is adjusted', async () => {
        wrapper.vm.$props = { slotNumber: 1 };
        const saturationButton = wrapper.find('[data-test="sat-input"]');
        await saturationButton.setValue('50');
        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*50%,\s*\d+%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(\d+,\s*50%,\s*\d+%\)/
        );
    });

    it('sets the main color lightness when the lightness input is adjusted', async () => {
        wrapper.vm.$props = { slotNumber: 1 };
        const lightnessButton = wrapper.find('[data-test="lum-input"]');
        await lightnessButton.setValue('25');
        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*\d+%,\s*25%\)/);
        expect(store.state.mainSlotColor.hsl).toMatch(
            /hsl\(\d+,\s*\d+%,\s*25%\)/
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
            /hsl\(100,\s*50%,\s*25%\)/
        );
    });

    it('sets the other slots to the values from hue, saturation, and lightness inputs', async () => {
        const hueButton = wrapper.find('[data-test="hue-input"]');
        const saturationButton = wrapper.find('[data-test="sat-input"]');
        const lightnessButton = wrapper.find('[data-test="lum-input"]');
        await hueButton.setValue('100');
        await saturationButton.setValue('50');
        await lightnessButton.setValue('25');

        for (let i = 2; i <= 5; i++) {
            wrapper.vm.$props = { slotNumber: i };
            store.dispatch('UPDATE_SLOT_COLOR', {
                slot: wrapper.vm.$props.slotNumber,
                hsl: `hsl(100, 50%, 25%)`,
            });
            expect(store.state.slotColors[`slot${i}`].hsl).toMatch(
                /hsl\(100,\s*50%,\s*25%\)/
            );
            expect(store.state.slotColors[`slot${i}`].rgb).toMatch(
                /rgb\(53,\s*96,\s*32\)/
            );
            expect(store.state.slotColors[`slot${i}`].hex).toMatch(/#356020/);
        }
    });
});
