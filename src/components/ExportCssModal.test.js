import { mount } from '@vue/test-utils';

import store from '../store';

import ExportCssModal from './ExportCssModal.vue';

vi.mock(import('mosha-vue-toastify'), () => ({
    createToast: vi.fn(),
}));

// oxlint-disable-next-line max-lines-per-function, max-statements
describe('component ExportCssModal', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        store.state.textColor = {
            hex: '#b8a886',
            hsl: 'hsl(38, 35%, 62%)',
            rgb: 'rgb(184, 168, 134)',
        };
        store.state.mainHSL = 'hsl(200, 50%, 50%)';
        store.state.mainSlotColor = {
            hex: '#40a0bf',
            hsl: 'hsl(200, 50%, 50%)',
            rgb: 'rgb(64, 160, 191)',
        };
        store.state.slotColors.slot2 = {
            hex: '#4095bf',
            hsl: 'hsl(210, 50%, 50%)',
            rgb: 'rgb(64, 149, 191)',
        };
        store.state.slotColors.slot3 = {
            hex: '#408abf',
            hsl: 'hsl(220, 50%, 50%)',
            rgb: 'rgb(64, 138, 191)',
        };
        store.state.slotColors.slot4 = {
            hex: '#407fbf',
            hsl: 'hsl(230, 50%, 50%)',
            rgb: 'rgb(64, 128, 191)',
        };
        store.state.slotColors.slot5 = {
            hex: '#4075bf',
            hsl: 'hsl(240, 50%, 50%)',
            rgb: 'rgb(64, 117, 191)',
        };

        wrapper = mount(ExportCssModal, {
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

    it('displays hsl mode by default', () => {
        expect(wrapper.find('[data-testid="code-wrapper"]').text()).toContain(
            'hsl(200, 50%, 50%)',
        );
    });

    it('uses --clr- syntax and shows SCSS label by default', () => {
        const syntaxButton = wrapper.find('[data-testid="syntax-toggle"]');

        expect(wrapper.find('[data-testid="code-wrapper"]').text()).toContain(
            '--clr-',
        );
        expect(syntaxButton.text()).toBe('SCSS');
    });

    it('switches to rgb mode when RGB button is clicked', async () => {
        await wrapper.find('[data-testid="rgb-button"]').trigger('click');

        expect(wrapper.find('[data-testid="code-wrapper"]').text()).toContain(
            'rgb(',
        );
    });

    it('switches to hex mode when HEX button is clicked', async () => {
        await wrapper.find('[data-testid="hex-button"]').trigger('click');

        expect(wrapper.find('[data-testid="code-wrapper"]').text()).toContain(
            '#',
        );
    });

    it('switches back to hsl mode when HSL button is clicked', async () => {
        await wrapper.find('[data-testid="hsl-button"]').trigger('click');

        expect(wrapper.find('[data-testid="code-wrapper"]').text()).toContain(
            'hsl(',
        );
    });

    it('toggles syntax from --clr- to $clr- when syntax button is clicked', async () => {
        const syntaxButton = wrapper.find('[data-testid="syntax-toggle"]');
        await syntaxButton.trigger('click');

        expect(wrapper.find('[data-testid="code-wrapper"]').text()).toContain(
            '$clr-',
        );
        expect(syntaxButton.text()).toBe('CSS');
    });

    it('toggles syntax back to --clr- when syntax button is clicked again', async () => {
        const syntaxButton = wrapper.find('[data-testid="syntax-toggle"]');
        await syntaxButton.trigger('click');
        await syntaxButton.trigger('click');

        expect(wrapper.find('[data-testid="code-wrapper"]').text()).toContain(
            '--clr-',
        );
        expect(syntaxButton.text()).toBe('SCSS');
    });

    it('renders all labels from the store', () => {
        const codeText = wrapper.find('[data-testid="code-wrapper"]').text();

        for (const label of store.state.labels) {
            expect(codeText).toContain(label.toLowerCase());
        }
    });

    it('emits close when the Close button is clicked', async () => {
        await wrapper.find('[data-testid="close-button"]').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('emits close when clicking the modal wrapper background', async () => {
        await wrapper.find('[data-testid="modal-wrapper"]').trigger('click');

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('emits close when Escape key is pressed', async () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('does not emit close for non-Escape key presses', async () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('close')).toBeFalsy();
    });

    it('copies code to clipboard when the code area is clicked', async () => {
        const writeText = vi.fn().mockResolvedValue(null);
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: { writeText },
        });

        await wrapper.find('[data-testid="modal-code"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(writeText).toHaveBeenCalled();
    });
});
