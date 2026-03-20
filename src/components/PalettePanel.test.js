import { mount } from '@vue/test-utils';

import store from '../store';

import PalettePanel from './PalettePanel.vue';

describe('component ColorsPane', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders palette slots', () => {
        const wrapper = mount(PalettePanel, {
            global: { plugins: [store] },
        });

        expect(
            wrapper.find('[data-testid="palette-slots"]').exists(),
        ).toBeTruthy();
        expect(
            wrapper.find('[data-testid="palette-panel-hide"]').exists(),
        ).toBeTruthy();

        wrapper.unmount();
    });
});
