// oxlint-disable max-lines

import { createStore } from 'vuex';
import { mount } from '@vue/test-utils';

import App from './App.vue';

/** @typedef {import('./store/state.js').ColorSlot} ColorSlot */
/** @typedef {import('./store/state.js').SavedPalette} SavedPalette */

const DEFAULT_SCHEME_LENGTH = 5;

/**
 * Creates a Vuex store with the specified state for testing purposes.
 * @param {{ uniqueColors?: string[], labels?: string[], mainHSL?: string | null, mainSlotColor?: ColorSlot, currentScheme?: ColorSlot[], savedPalettes?: SavedPalette[], slotColors?: { slot2: ColorSlot, slot3: ColorSlot, slot4: ColorSlot, slot5: ColorSlot } }} [state] - Optional state overrides for the store
 * @returns {ReturnType<typeof createStore>} A Vuex store instance with the specified state
 */
// oxlint-disable-next-line max-lines-per-function
const createVuexStore = (state = {}) =>
    createStore({
        getters: {
            currentScheme: () =>
                state.currentScheme ||
                Array.from({ length: DEFAULT_SCHEME_LENGTH }, () => ({
                    hex: '',
                    hsl: '',
                    rgb: '',
                })),
            uniqueColors: () => new Set(state.uniqueColors || []),
        },
        state: {
            labels: state.labels || [
                'Main',
                'Complementary',
                'Light',
                'Accent',
                'Accent Light',
            ],
            mainHSL: state.mainHSL || null,
            mainSlotColor: state.mainSlotColor || {
                hex: '',
                hsl: '',
                rgb: '',
            },
            savedPalettes: state.savedPalettes || [],
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
    /** @type {ReturnType<typeof createVuexStore>} */
    let store;

    beforeEach(() => {
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

        const collapseIcon = wrapper.find(
            '[data-testid="color-pane-collapse"]',
        );
        expect(collapseIcon.exists()).toBeTruthy();

        // Verify default state is not collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBeFalsy();

        await collapseIcon.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBeTruthy();

        await collapseIcon.trigger('click');

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

        const collapseIcon = wrapper.find('[data-testid="mini-pane-collapse"]');

        expect(collapseIcon.exists()).toBeTruthy();

        // Verify default state is not collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBeFalsy();

        await collapseIcon.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBeTruthy();

        await collapseIcon.trigger('click');

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

        const collapseIcon = wrapper.find(
            '[data-testid="saved-pane-collapse"]',
        );
        expect(collapseIcon.exists()).toBeTruthy();

        // Verify default state is not collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBeFalsy();

        await collapseIcon.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBeTruthy();

        await collapseIcon.trigger('click');

        // Verify it's back to not collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBeFalsy();
    });

    it('opens and closes Instructions modal', async () => {
        // Open modal via MainNav event
        await wrapper
            .findComponent({ name: 'MainNav' })
            .vm.$emit('openInstructionsModal');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showInstructionsModal).toBeTruthy();

        // Close modal via @close event
        const instructionsModal = wrapper.findComponent({
            name: 'InstructionsModal',
        });

        expect(instructionsModal.exists()).toBeTruthy();

        await instructionsModal.vm.$emit('close');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showInstructionsModal).toBeFalsy();
    });

    // oxlint-disable-next-line max-lines-per-function
    it('opens and closes Copy modal', async () => {
        // Open modal via UtilityButtons event
        store = createVuexStore({
            savedPalettes: [
                {
                    id: '1',
                    name: 'Test',
                    scheme: [
                        {
                            hex: '#FF0000',
                            hsl: 'hsl(0,100%,50%)',
                            rgb: 'rgb(255,0,0)',
                        },
                        {
                            hex: '#FF0000',
                            hsl: 'hsl(0,100%,50%)',
                            rgb: 'rgb(255,0,0)',
                        },
                        {
                            hex: '#00FF00',
                            hsl: 'hsl(120,100%,50%)',
                            rgb: 'rgb(0,255,0)',
                        },
                        {
                            hex: '#0000FF',
                            hsl: 'hsl(240,100%,50%)',
                            rgb: 'rgb(0,0,255)',
                        },
                    ],
                },
            ],
            uniqueColors: ['#FF0000', '#00FF00', '#0000FF'],
        });

        wrapper = mount(App, { global: { plugins: [store] } });
        await wrapper
            .findComponent({ name: 'UtilityButtons' })
            .vm.$emit('copyPalette');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showCopyModal).toBeTruthy();

        // Close modal via @close event
        const copyModal = wrapper.findComponent({ name: 'ExportCssModal' });

        expect(copyModal.exists()).toBeTruthy();

        await copyModal.vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showCopyModal).toBeFalsy();
    });

    it('opens and closes Save modal', async () => {
        // Open modal via UtilityButtons event
        store = createVuexStore({ uniqueColors: ['#FF0000'] });
        wrapper = mount(App, { global: { plugins: [store] } });

        await wrapper
            .findComponent({ name: 'UtilityButtons' })
            .vm.$emit('savePalette');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showSaveModal).toBeTruthy();

        // Close modal via @close event
        const saveModal = wrapper.findComponent({ name: 'SaveModal' });

        expect(saveModal.exists()).toBeTruthy();

        await saveModal.vm.$emit('close');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showSaveModal).toBeFalsy();
    });
});
