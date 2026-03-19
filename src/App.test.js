// oxlint-disable max-lines

import { mount } from '@vue/test-utils';

import App from './App.vue';
import stateFactory from './store/state';
import store from './store';

vi.mock(import('mosha-vue-toastify'), () => ({
    createToast: vi.fn(),
}));

// oxlint-disable-next-line max-lines-per-function
describe('component App.vue', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        Object.assign(store.state, stateFactory());
        wrapper = mount(App, {
            global: {
                plugins: [store],
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.restoreAllMocks();
    });

    it('renders the main navigation', () => {
        expect(
            wrapper.findComponent({ name: 'SiteHeader' }).exists(),
        ).toBeTruthy();
    });

    it('shows utility buttons panel when colors are present', async () => {
        store.state.allColors.hsl = ['hsl(0, 100%, 50%)'];
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent({ name: 'UtilityButtonsPanel' }).exists(),
        ).toBeTruthy();
    });

    it('hides utility buttons panel when no colors are present', () => {
        expect(
            wrapper.findComponent({ name: 'UtilityButtonsPanel' }).exists(),
        ).toBeFalsy();
    });

    it('shows saved palettes section when there are saved palettes', async () => {
        store.state.savedPalettes = [
            {
                createdAt: new Date().toISOString(),
                id: '1',
                name: 'Test',
                scheme: [],
            },
        ];
        await wrapper.vm.$nextTick();

        expect(
            wrapper.findComponent({ name: 'SavedPalettesPanel' }).exists(),
        ).toBeTruthy();
    });

    it('toggles isColorPaneCollapsed when collapse icon is clicked', async () => {
        store.state.mainHSL = 'hsl(180, 50%, 50%)';
        await wrapper.vm.$nextTick();

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
        store.state.allColors.hsl = ['hsl(0, 100%, 50%)'];
        await wrapper.vm.$nextTick();

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
        store.state.savedPalettes = [
            {
                createdAt: new Date().toISOString(),
                id: '1',
                name: 'Test',
                scheme: [],
            },
        ];
        await wrapper.vm.$nextTick();

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
        // Open modal via SiteHeader event
        await wrapper
            .findComponent({ name: 'SiteHeader' })
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
        store.state.allColors.hsl = [
            'hsl(0, 100%, 50%)',
            'hsl(120, 100%, 50%)',
            'hsl(240, 100%, 50%)',
        ];
        await wrapper.vm.$nextTick();

        await wrapper
            .findComponent({ name: 'UtilityButtonsPanel' })
            .vm.$emit('copyPalette');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showCopyModal).toBeTruthy();

        // Close modal via @close event
        const exportCssModal = wrapper.findComponent({
            name: 'ExportCssModal',
        });

        expect(exportCssModal.exists()).toBeTruthy();

        await exportCssModal.vm.$emit('close');
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.showCopyModal).toBeFalsy();
    });

    it('opens and closes SavePalette modal', async () => {
        store.state.allColors.hsl = ['hsl(0, 100%, 50%)'];
        await wrapper.vm.$nextTick();

        await wrapper
            .findComponent({ name: 'UtilityButtonsPanel' })
            .vm.$emit('savePalette');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showSaveModal).toBeTruthy();

        // Close modal via @close event
        const savePaletteModal = wrapper.findComponent({
            name: 'SavePaletteModal',
        });

        expect(savePaletteModal.exists()).toBeTruthy();

        await savePaletteModal.vm.$emit('close');
        await wrapper.vm.$nextTick();

        expect(wrapper.vm.showSaveModal).toBeFalsy();
    });
});
