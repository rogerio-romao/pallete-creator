import { mount } from '@vue/test-utils';

import store from '../store';

import PalettePanel from './PalettePanel.vue';

describe('component ColorsPane', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders collapsed message when collapsed', () => {
        const wrapper = mount(PalettePanel, {
            global: { plugins: [store] },
            props: { isColorPaneCollapsed: true },
        });

        expect(wrapper.text()).toContain('Click the arrow to expand panel');
        expect(
            wrapper.find('[data-testid="palette-panel-hide"]').exists(),
        ).toBeFalsy();

        wrapper.unmount();
    });

    it('renders slots when not collapsed', () => {
        const wrapper = mount(PalettePanel, {
            global: { plugins: [store] },
            props: { isColorPaneCollapsed: false },
        });

        expect(wrapper.text()).not.toContain('Click the arrow to expand panel');
        expect(
            wrapper.find('[data-testid="palette-slots"]').exists(),
        ).toBeTruthy();

        wrapper.unmount();
    });

    it('has correct default prop', () => {
        const wrapper = mount(PalettePanel, {
            global: { plugins: [store] },
        });

        expect(wrapper.props('isColorPaneCollapsed')).toBeFalsy();

        wrapper.unmount();
    });
});
