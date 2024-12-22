import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';
import UtilityButtons from './UtilityButtons.vue';

// Create a mock store
const createVuexStore = (state = {}) => {
    return createStore({
        state: {
            mainHSL: 'hsl(20, 20%, 20%)',
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
        const spy = vi.spyOn(store, 'dispatch');

        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        expect(spy).toHaveBeenCalledWith('SET_RANDOM_SCHEME');
    });

    it('fills the slots with random colors', async () => {
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');
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

    it('shows the test palette button when the full scheme is set', async () => {
        expect(wrapper.find('[data-test="test-palette-button"]').exists()).toBe(
            false
        );
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for the next tick
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test="test-palette-button"]').exists()).toBe(
            true
        );
    });

    it('shows the reset site colors button when the full scheme is set', async () => {
        expect(
            wrapper.find('[data-test="reset-site-colors-button"]').exists()
        ).toBe(false);
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for the next tick
        await wrapper.vm.$nextTick();

        expect(
            wrapper.find('[data-test="reset-site-colors-button"]').exists()
        ).toBe(true);
    });

    it('shows the set light text button when the full scheme is set', async () => {
        expect(
            wrapper.find('[data-test="set-light-text-button"]').exists()
        ).toBe(false);
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for the next tick
        await wrapper.vm.$nextTick();

        expect(
            wrapper.find('[data-test="set-light-text-button"]').exists()
        ).toBe(true);
    });

    it('shows the set dark text button when the full scheme is set', async () => {
        expect(
            wrapper.find('[data-test="set-dark-text-button"]').exists()
        ).toBe(false);
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for the next tick
        await wrapper.vm.$nextTick();

        expect(
            wrapper.find('[data-test="set-dark-text-button"]').exists()
        ).toBe(true);
    });

    it('shows the export css button when the full scheme is set', async () => {
        expect(wrapper.find('[data-test="export-css-button"]').exists()).toBe(
            false
        );
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for the next tick
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test="export-css-button"]').exists()).toBe(
            true
        );
    });

    it('shows the save palette button when the full scheme is set', async () => {
        expect(wrapper.find('[data-test="save-palette-button"]').exists()).toBe(
            false
        );
        await wrapper
            .find('[data-test="random-scheme-button"]')
            .trigger('click');

        // wait for the next tick
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test="save-palette-button"]').exists()).toBe(
            true
        );
    });
});
