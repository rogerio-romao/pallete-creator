import { mount } from '@vue/test-utils';

import store from '../store';

import SavePaletteModal from './SavePaletteModal.vue';

const { createToastMock } = vi.hoisted(() => ({
    createToastMock: vi.fn(),
}));

vi.mock(import('mosha-vue-toastify'), () => ({
    createToast: createToastMock,
}));

// oxlint-disable-next-line max-lines-per-function, max-statements
describe('component SavePaletteModal', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        createToastMock.mockClear();

        wrapper = mount(SavePaletteModal, {
            global: { plugins: [store] },
        });
    });

    afterEach(() => {
        wrapper.unmount();
        vi.restoreAllMocks();
    });

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the save palette title', () => {
        expect(
            wrapper.find('[data-testid="save-palette-header-title"]').text(),
        ).toBe('Save this palette');
    });

    it('emits close when the Close button is clicked', async () => {
        await wrapper.find('[data-testid="close-button"]').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('emits close when clicking the modal wrapper background', async () => {
        await wrapper.find('.modal-mask').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('emits close when Escape key is pressed', async () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('shows invalid state and warning toast when Save is clicked with no name', async () => {
        await wrapper
            .find('[data-testid="save-palette-form"]')
            .trigger('submit');

        expect(wrapper.find('[data-testid="modal-input"]').classes()).toContain(
            'modal-input-invalid',
        );
        expect(
            wrapper
                .find('[data-testid="name-input"]')
                .attributes('placeholder'),
        ).toBe('Please enter name');
        expect(createToastMock).toHaveBeenCalledWith(
            'Please name the palette first',
            expect.objectContaining({ type: 'warning' }),
        );
    });

    it('dispatches SAVE_PALETTE and emits close on successful save', async () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue(null);

        await wrapper.find('[data-testid="name-input"]').setValue('My Palette');
        await wrapper
            .find('[data-testid="save-palette-form"]')
            .trigger('submit');
        await wrapper.vm.$nextTick();

        expect(dispatchSpy).toHaveBeenCalledWith(
            'SAVE_PALETTE',
            expect.objectContaining({ name: 'My Palette' }),
        );
        expect(createToastMock).toHaveBeenCalledWith(
            'Palette saved!',
            expect.objectContaining({ type: 'success' }),
        );
        expect(wrapper.emitted('close')).toBeTruthy();

        dispatchSpy.mockRestore();
    });

    it('clears the input after a successful save', async () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue(null);

        const input = wrapper.find('[data-testid="name-input"]');
        await input.setValue('My Palette');
        await wrapper
            .find('[data-testid="save-palette-form"]')
            .trigger('submit');
        await wrapper.vm.$nextTick();

        expect(/** @type {HTMLInputElement} */ (input.element).value).toBe('');

        dispatchSpy.mockRestore();
    });

    it('shows danger toast and does not emit close when save fails', async () => {
        const dispatchSpy = vi
            .spyOn(store, 'dispatch')
            .mockRejectedValue(new Error('Storage error'));

        await wrapper.find('[data-testid="name-input"]').setValue('My Palette');
        await wrapper
            .find('[data-testid="save-palette-form"]')
            .trigger('submit');
        await wrapper.vm.$nextTick();

        expect(createToastMock).toHaveBeenCalledWith(
            'Failed to save palette. Please try again.',
            expect.objectContaining({ type: 'danger' }),
        );
        expect(wrapper.emitted('close')).toBeFalsy();

        dispatchSpy.mockRestore();
    });

    it('removes the invalid state when a valid name is submitted', async () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue(null);

        // First trigger invalid state
        await wrapper
            .find('[data-testid="save-palette-form"]')
            .trigger('submit');
        expect(wrapper.find('[data-testid="modal-input"]').classes()).toContain(
            'modal-input-invalid',
        );

        // Then submit with a valid name
        await wrapper.find('[data-testid="name-input"]').setValue('My Palette');
        await wrapper
            .find('[data-testid="save-palette-form"]')
            .trigger('submit');
        await wrapper.vm.$nextTick();

        expect(
            wrapper.find('[data-testid="modal-input"]').classes(),
        ).not.toContain('modal-input-invalid');

        dispatchSpy.mockRestore();
    });
});
