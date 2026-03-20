import { createToast } from 'mosha-vue-toastify';
import { mount } from '@vue/test-utils';

import store from '../store';

import SavedPalettesPanel from './SavedPalettesPanel.vue';

vi.mock(import('mosha-vue-toastify'), () => ({
    createToast: vi.fn(),
}));

// oxlint-disable-next-line max-lines-per-function
describe('component SavedPalettes', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        vi.clearAllMocks();

        store.state.savedPalettes = [
            {
                id: '1',
                name: 'Sunset',
                scheme: [{ hsl: 'hsl(0, 0%, 7%)' }, { hsl: 'hsl(0, 0%, 13%)' }],
            },
        ];

        vi.spyOn(store, 'dispatch').mockResolvedValue(null);

        wrapper = mount(SavedPalettesPanel, {
            global: { plugins: [store] },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.restoreAllMocks();
    });

    it('renders the saved palettes pane', () => {
        expect(wrapper.find('.saved-palettes').exists()).toBeTruthy();
    });

    it('loads palette when clicked', async () => {
        await wrapper.find('[data-testid="saved-palette-1"]').trigger('click');

        // The first color is the main color and is set elsewhere; only the additional colors are loaded into slots.
        const slotColors = store.state.savedPalettes[0].scheme.slice(1);
        expect(store.dispatch).toHaveBeenCalledWith(
            'SET_PALETTE_FROM_SAVED',
            slotColors,
        );
    });

    it('attaches keydown listener on mount and removes on unmount', () => {
        const addSpy = vi.spyOn(document, 'addEventListener');
        const removeSpy = vi.spyOn(document, 'removeEventListener');

        const test = mount(SavedPalettesPanel, {
            global: { plugins: [store] },
        });

        expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        test.unmount();
        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

        addSpy.mockRestore();
        removeSpy.mockRestore();
    });

    it('opens delete modal when trash icon is clicked', async () => {
        await wrapper
            .find('[data-testid="delete-palette-trigger"]')
            .trigger('click');

        expect(
            wrapper.find('[data-testid="delete-palette-modal"]').exists(),
        ).toBeTruthy();
        expect(wrapper.text()).toContain('Delete Sunset?');
    });

    it('closes delete modal when cancel is clicked', async () => {
        await wrapper
            .find('[data-testid="delete-palette-trigger"]')
            .trigger('click');
        await wrapper
            .find('[data-testid="cancel-delete-button"]')
            .trigger('click');

        expect(
            wrapper.find('[data-testid="delete-palette-modal"]').exists(),
        ).toBeFalsy();
        expect(store.dispatch).not.toHaveBeenCalledWith('DELETE_PALETTE', '1');
    });

    it('closes delete modal when Escape is pressed', async () => {
        await wrapper
            .find('[data-testid="delete-palette-trigger"]')
            .trigger('click');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await wrapper.vm.$nextTick();

        expect(
            wrapper.find('[data-testid="delete-palette-modal"]').exists(),
        ).toBeFalsy();
        expect(store.dispatch).not.toHaveBeenCalledWith('DELETE_PALETTE', '1');
    });

    it('deletes palette when confirm is clicked', async () => {
        store.dispatch.mockResolvedValueOnce(null);

        await wrapper
            .find('[data-testid="delete-palette-trigger"]')
            .trigger('click');
        await wrapper
            .find('[data-testid="confirm-delete-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        expect(store.dispatch).toHaveBeenCalledWith('DELETE_PALETTE', '1');
        expect(
            wrapper.find('[data-testid="delete-palette-modal"]').exists(),
        ).toBeFalsy();
        expect(createToast).toHaveBeenCalledWith('Palette deleted!', {
            hideProgressBar: true,
            position: 'bottom-right',
            type: 'info',
        });
    });

    it('shows error toast when delete fails', async () => {
        store.dispatch.mockRejectedValueOnce(new Error('delete failed'));

        await wrapper
            .find('[data-testid="delete-palette-trigger"]')
            .trigger('click');
        await wrapper
            .find('[data-testid="confirm-delete-button"]')
            .trigger('click');
        await wrapper.vm.$nextTick();

        expect(
            wrapper.find('[data-testid="delete-palette-modal"]').exists(),
        ).toBeFalsy();
        expect(store.dispatch).toHaveBeenCalledWith('DELETE_PALETTE', '1');
        expect(createToast).toHaveBeenCalledWith(
            'Failed to delete palette. Please try again.',
            {
                hideProgressBar: true,
                position: 'bottom-right',
                type: 'danger',
            },
        );
    });
});
