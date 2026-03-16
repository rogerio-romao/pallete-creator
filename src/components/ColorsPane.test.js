import { createStore } from 'vuex';
import { mount } from '@vue/test-utils';

import ColorsPane from './ColorsPane.vue';

const createVuexStore = () =>
    createStore({
        state: {
            copiedColor: null,
            copiedColorIndex: -1,
            labels: ['Text', 'Main', 'Secondary', 'Accent', 'Light', 'Dark'],
            mainHSL: 'hsl(180, 50%, 50%)',
            mainSlotColor: { hex: '', hsl: '', rgb: '' },
            slotColors: {
                slot2: { hex: '', hsl: '', rgb: '' },
                slot3: { hex: '', hsl: '', rgb: '' },
                slot4: { hex: '', hsl: '', rgb: '' },
                slot5: { hex: '', hsl: '', rgb: '' },
            },
            textColor: { hex: '', hsl: '', rgb: '' },
        },
    });

describe('component ColorsPane', () => {
    it('renders collapsed message when collapsed', () => {
        const store = createVuexStore();
        const wrapper = mount(ColorsPane, {
            global: { plugins: [store] },
            props: { isColorPaneCollapsed: true },
        });
        expect(wrapper.text()).toContain('Click the arrow to expand panel');
        expect(wrapper.find('.hide').exists()).toBeFalsy();
    });

    it('renders slots when not collapsed', () => {
        const store = createVuexStore();
        const wrapper = mount(ColorsPane, {
            global: { plugins: [store] },
            props: { isColorPaneCollapsed: false },
        });
        expect(wrapper.text()).not.toContain('Click the arrow to expand panel');
        expect(wrapper.find('.palette-slots').exists()).toBeTruthy();
    });

    it('has correct default prop', () => {
        const store = createVuexStore();
        const wrapper = mount(ColorsPane, {
            global: { plugins: [store] },
        });
        expect(wrapper.props('isColorPaneCollapsed')).toBeFalsy();
    });
});
