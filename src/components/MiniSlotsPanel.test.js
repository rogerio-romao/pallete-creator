import { mount } from '@vue/test-utils';

import store from '../store';

import MiniSlotsPanel from './MiniSlotsPanel.vue';

// oxlint-disable-next-line max-lines-per-function
describe('component MiniSlotsPanel', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        store.state.allColors = [
            { hex: '#40a0bf', hsl: 'hsl(200, 50%, 50%)', rgb: 'rgb(64, 160, 191)', type: 'complement' },
            { hex: '#4095bf', hsl: 'hsl(210, 50%, 50%)', rgb: 'rgb(64, 149, 191)', type: 'complement' },
            { hex: '#408abf', hsl: 'hsl(220, 50%, 50%)', rgb: 'rgb(64, 138, 191)', type: 'mono' },
        ];
        store.state.copiedColor = '';
        store.state.copiedColorIndex = null;

        wrapper = mount(MiniSlotsPanel, {
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

    it('shows the expanded panel content', () => {
        expect(
            wrapper.find('[data-testid="expanded-panel"]').exists(),
        ).toBeTruthy();
    });

    it('renders a slot for each unique color from the store', () => {
        const slots = wrapper.findAll('.mini-slot');

        expect(slots).toHaveLength(store.getters.uniqueColors.length);
    });

    it('applies background color to each slot', () => {
        const slots = wrapper.findAll('.mini-slot');

        for (const slot of slots) {
            expect(slot.attributes('style')).toContain('background-color');
        }
    });

    it('renders the listbox with correct aria attributes', () => {
        const listbox = wrapper.find('[role="listbox"]');

        expect(listbox.exists()).toBeTruthy();
        expect(listbox.attributes('aria-label')).toBe('Color variations');
    });

    it('dispatches COPY_COLOR when a slot is clicked', async () => {
        const dispatchSpy = vi.spyOn(store, 'dispatch');
        const firstSlot = wrapper.find('[data-testid="mini-slot-0"]');
        await firstSlot.trigger('click');

        expect(dispatchSpy).toHaveBeenCalledWith(
            'COPY_COLOR',
            expect.objectContaining({
                color: expect.any(String),
                index: 0,
            }),
        );

        dispatchSpy.mockRestore();
    });

    it('dispatches CLEAR_COPIED_COLOR when an already-selected slot is clicked', async () => {
        store.state.copiedColor = 'hsl(200, 50%, 50%)';
        store.state.copiedColorIndex = 0;
        await wrapper.vm.$nextTick();

        const dispatchSpy = vi.spyOn(store, 'dispatch');
        await wrapper.find('[data-testid="mini-slot-0"]').trigger('click');

        expect(dispatchSpy).toHaveBeenCalledWith('CLEAR_COPIED_COLOR');
        dispatchSpy.mockRestore();
    });

    it('marks copied slot with mini-slot-copied class', async () => {
        store.state.copiedColor = 'hsl(200, 50%, 50%)';
        store.state.copiedColorIndex = 0;
        await wrapper.vm.$nextTick();
        const slot1 = wrapper.find('[data-testid="mini-slot-0"]');
        const slot2 = wrapper.find('[data-testid="mini-slot-1"]');

        expect(slot1.classes()).toContain('mini-slot-copied');
        expect(slot2.classes()).not.toContain('mini-slot-copied');
    });

    it('sets aria-selected true on the copied slot', async () => {
        store.state.copiedColor = 'hsl(200, 50%, 50%)';
        store.state.copiedColorIndex = 1;
        await wrapper.vm.$nextTick();
        const slot1 = wrapper.find('[data-testid="mini-slot-0"]');
        const slot2 = wrapper.find('[data-testid="mini-slot-1"]');

        expect(slot2.attributes('aria-selected')).toBe('true');
        expect(slot1.attributes('aria-selected')).toBe('false');
    });
});
