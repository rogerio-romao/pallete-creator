import { createStore } from 'vuex';
import { mount } from '@vue/test-utils';

import App from './App.vue';

/** @typedef {import('./store/state.js').ColorSlot} ColorSlot */
/** @typedef {import('./store/state.js').SavedPalette} SavedPalette */

/**
 * Creates a Vuex store with the specified state for testing purposes.
 * @param {{ uniqueColors?: string[], labels?: string[], mainHSL?: string | null, mainSlotColor?: ColorSlot, savedPalettes?: SavedPalette[], slotColors?: { slot2: ColorSlot, slot3: ColorSlot, slot4: ColorSlot, slot5: ColorSlot } }} [state] - Optional state overrides for the store
 * @returns {ReturnType<typeof createStore>} A Vuex store instance with the specified state
 */
const createVuexStore = (state = {}) =>
    createStore({
        getters: {
            uniqueColors: () => new Set(state.uniqueColors || []),
        },
        state: {
            // Add labels to prevent errors in ColorSlot component
            labels: state.labels || [
                'Main',
                'Complementary',
                'Light',
                'Accent',
                'Accent Light',
            ],
            mainHSL: state.mainHSL || null,
            // Add mainSlotColor to prevent errors
            mainSlotColor: state.mainSlotColor || {
                hex: '',
                hsl: '',
                rgb: '',
            },
            savedPalettes: state.savedPalettes || [],
            // Add slotColors to prevent errors
            slotColors: state.slotColors || {
                slot2: {
                    hex: '',
                    hsl: '',
                    rgb: '',
                },
                slot3: {
                    hex: '',
                    hsl: '',
                    rgb: '',
                },
                slot4: {
                    hex: '',
                    hsl: '',
                    rgb: '',
                },
                slot5: {
                    hex: '',
                    hsl: '',
                    rgb: '',
                },
            },
        },
    });

// oxlint-disable-next-line max-lines-per-function
describe('component App.vue', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;
    let store;

    beforeEach(() => {
        // Create a fresh store instance for each test
        store = createVuexStore({});
        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });
    });

    it('renders the main navigation', () => {
        expect(
            wrapper.findComponent({ name: 'MainNav' }).exists(),
        ).toBeTruthy();
    });

    it('shows utility buttons when colors are present', () => {
        store = createVuexStore({
            uniqueColors: ['#FF0000'],
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        expect(
            wrapper.findComponent({ name: 'UtilityButtons' }).exists(),
        ).toBeTruthy();
    });

    it('hides utility buttons when no colors are present', () => {
        expect(
            wrapper.findComponent({ name: 'UtilityButtons' }).exists(),
        ).toBeFalsy();
    });

    it('shows saved palettes section when there are saved palettes', () => {
        store = createVuexStore({
            savedPalettes: [{ id: '1', name: 'Test', scheme: [] }],
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        expect(
            wrapper.findComponent({ name: 'SavedPalettes' }).exists(),
        ).toBeTruthy();
    });

    it('toggles isColorPaneCollapsed when collapse icon is clicked', async () => {
        // Setup with mainHSL to make the color pane visible
        store = createVuexStore({
            mainHSL: 'hsl(180, 50%, 50%)',
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        // Find the collapse icon for the color pane
        const collapseIcon = wrapper.find('h2 .collapse');
        expect(collapseIcon.exists()).toBeTruthy();

        // Verify default state is not collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBeFalsy();

        // Click the collapse icon
        await collapseIcon.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBeTruthy();

        // Click again to toggle back
        await wrapper.find('h2 .collapse').trigger('click');

        // Verify it's back to not collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBeFalsy();
    });

    it('toggles isMiniPaneCollapsed when the mini pane collapse icon is clicked', async () => {
        // Setup with uniqueColors to make the mini pane visible
        store = createVuexStore({
            uniqueColors: ['#FF0000'],
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        // Find the collapse icon for the mini pane (second h2 with collapse class)
        const miniPaneHeading = wrapper
            .findAll('h2')
            .find((h2) => h2.text().includes('Pick your variations'));

        const collapseIcon = miniPaneHeading?.find('.collapse');
        expect(collapseIcon?.exists()).toBeTruthy();

        // Verify default state is not collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBeFalsy();

        // Click the collapse icon
        await collapseIcon?.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBeTruthy();

        // Click again to toggle back
        await miniPaneHeading?.find('.collapse').trigger('click');

        // Verify it's back to not collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBeFalsy();
    });

    it('toggles isSavedPaneCollapsed when the saved palettes collapse icon is clicked', async () => {
        // Setup with savedPalettes to make the saved palettes visible
        store = createVuexStore({
            savedPalettes: [{ id: '1', name: 'Test', scheme: [] }],
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        // Find the collapse icon for the saved palettes section
        const savedPaletteHeading = wrapper
            .findAll('h2')
            .find((h2) => h2.text().includes('Saved Palettes'));

        const collapseIcon = savedPaletteHeading?.find('.collapse');
        expect(collapseIcon?.exists()).toBeTruthy();

        // Verify default state is not collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBeFalsy();

        // Click the collapse icon
        await collapseIcon?.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBeTruthy();

        // Click again to toggle back
        await savedPaletteHeading?.find('.collapse').trigger('click');

        // Verify it's back to not collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBeFalsy();
    });
});
