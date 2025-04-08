import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from 'vuex';
import App from './App.vue';

// Create a mock store
const createVuexStore = (state = {}) => {
    return createStore({
        state: {
            mainHSL: state.mainHSL || null,
            isUserSignedIn: state.isUserSignedIn || false,
            // Add labels to prevent errors in ColorSlot component
            labels: state.labels || [
                'Main',
                'Complementary',
                'Light',
                'Accent',
                'Accent Light',
            ],
            // Add mainSlotColor to prevent errors
            mainSlotColor: state.mainSlotColor || {
                hsl: '',
                rgb: '',
                hex: '',
            },
            // Add slotColors to prevent errors
            slotColors: state.slotColors || {
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
            uniqueColors: () => new Set(state.uniqueColors || []),
        },
    });
};

describe('App.vue', () => {
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
        expect(wrapper.findComponent({ name: 'MainNav' }).exists()).toBe(true);
    });

    it('shows utility buttons when colors are present', async () => {
        const store = createVuexStore({
            uniqueColors: ['#FF0000'],
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        expect(wrapper.findComponent({ name: 'UtilityButtons' }).exists()).toBe(
            true
        );
    });

    it('hides utility buttons when no colors are present', () => {
        expect(wrapper.findComponent({ name: 'UtilityButtons' }).exists()).toBe(
            false
        );
    });

    it('shows saved palettes section when user is logged in', async () => {
        const store = createVuexStore({
            isUserSignedIn: true,
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        expect(wrapper.findComponent({ name: 'SavedPalettes' }).exists()).toBe(
            true
        );
    });

    it('toggles isColorPaneCollapsed when collapse icon is clicked', async () => {
        // Setup with mainHSL to make the color pane visible
        const store = createVuexStore({
            mainHSL: 'hsl(180, 50%, 50%)',
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        // Find the collapse icon for the color pane
        const collapseIcon = wrapper.find('h2 .collapse');
        expect(collapseIcon.exists()).toBe(true);

        // Verify default state is not collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBe(false);

        // Click the collapse icon
        await collapseIcon.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBe(true);

        // Click again to toggle back
        await wrapper.find('h2 .collapse').trigger('click');

        // Verify it's back to not collapsed
        expect(wrapper.vm.isColorPaneCollapsed).toBe(false);
    });

    it('toggles isMiniPaneCollapsed when the mini pane collapse icon is clicked', async () => {
        // Setup with uniqueColors to make the mini pane visible
        const store = createVuexStore({
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
            .filter((h2) => h2.text().includes('Pick your variations'))[0];

        const collapseIcon = miniPaneHeading.find('.collapse');
        expect(collapseIcon.exists()).toBe(true);

        // Verify default state is not collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBe(false);

        // Click the collapse icon
        await collapseIcon.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBe(true);

        // Click again to toggle back
        await miniPaneHeading.find('.collapse').trigger('click');

        // Verify it's back to not collapsed
        expect(wrapper.vm.isMiniPaneCollapsed).toBe(false);
    });

    it('toggles isSavedPaneCollapsed when the saved palettes collapse icon is clicked', async () => {
        // Setup with isUserSignedIn to make the saved palettes visible
        const store = createVuexStore({
            isUserSignedIn: true,
        });

        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });

        // Find the collapse icon for the saved palettes section
        const savedPaletteHeading = wrapper
            .findAll('h2')
            .filter((h2) => h2.text().includes('Saved Palettes'))[0];

        const collapseIcon = savedPaletteHeading.find('.collapse');
        expect(collapseIcon.exists()).toBe(true);

        // Verify default state is not collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBe(false);

        // Click the collapse icon
        await collapseIcon.trigger('click');

        // Verify it's now collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBe(true);

        // Click again to toggle back
        await savedPaletteHeading.find('.collapse').trigger('click');

        // Verify it's back to not collapsed
        expect(wrapper.vm.isSavedPaneCollapsed).toBe(false);
    });
});
