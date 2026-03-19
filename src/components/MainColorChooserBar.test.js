import { mount } from '@vue/test-utils';

import store from '../store/index';

import MainColorChooserBar from './MainColorChooserBar.vue';

// oxlint-disable-next-line max-lines-per-function
describe('component MainColorChooserBar', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        store.state.mainHSL = null; // reset mainHSL before each test
        wrapper = mount(MainColorChooserBar, {
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

    it('sets the main color when the random button is clicked', async () => {
        const randomButton = wrapper.find('[data-testid="random-button"]');
        await randomButton.trigger('click');

        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*\d+%,\s*\d+%\)/);
    });

    it('sets the main color when the rgb input is submitted', async () => {
        const rgbInput = wrapper.find('[data-testid="rgb-input"]');
        const rgbForm = wrapper.find('[data-testid="rgb-form"]');
        await rgbInput.setValue('255, 0, 0');
        await rgbForm.trigger('submit');
        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(0, 100%, 50%)');
    });

    it('sets the main color when the hex input is submitted', async () => {
        const hexInput = wrapper.find('[data-testid="hex-input"]');
        const hexForm = wrapper.find('[data-testid="hex-form"]');
        await hexInput.setValue('ffffff');
        await hexForm.trigger('submit');
        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(0, 0%, 100%)');
    });

    it('sets the main color when the hsl input is submitted', async () => {
        const hslInput = wrapper.find('[data-testid="hsl-input"]');
        const hslForm = wrapper.find('[data-testid="hsl-form"]');
        await hslInput.setValue('30, 40, 100');
        await hslForm.trigger('submit');
        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(30, 40%, 100%)');
    });

    it('sets the main color when the color input is submitted', async () => {
        const colorInput = wrapper.find('[data-testid="color-input"]');
        const colorForm = wrapper.find('[data-testid="color-form"]');
        await colorInput.setValue('#00ffff');
        await colorForm.trigger('submit');
        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(180, 100%, 50%)');
    });

    it('does not set main color when rgb input is empty', async () => {
        const rgbInput = wrapper.find('[data-testid="rgb-input"]');
        const rgbForm = wrapper.find('[data-testid="rgb-form"]');
        await rgbInput.setValue('');
        await rgbForm.trigger('submit');
        await wrapper.vm.$nextTick();
        // Should not change mainHSL
        expect(store.state.mainHSL).toBe(null);
    });

    it('does not set main color when hex input is empty', async () => {
        const hexInput = wrapper.find('[data-testid="hex-input"]');
        const hexForm = wrapper.find('[data-testid="hex-form"]');
        await hexInput.setValue('');
        await hexForm.trigger('submit');
        await wrapper.vm.$nextTick();
        // Should not change mainHSL
        expect(store.state.mainHSL).toBe(null);
    });

    it('does not set main color when hsl input is empty', async () => {
        const hslInput = wrapper.find('[data-testid="hsl-input"]');
        const hslForm = wrapper.find('[data-testid="hsl-form"]');
        await hslInput.setValue('');
        await hslForm.trigger('submit');
        await wrapper.vm.$nextTick();
        // Should not change mainHSL
        expect(store.state.mainHSL).toBe(null);
    });

    it('sets main color to black if you press submit on color input without selecting a color', async () => {
        const colorInput = wrapper.find('[data-testid="color-input"]');
        const colorForm = wrapper.find('[data-testid="color-form"]');
        await colorInput.setValue('');
        await colorForm.trigger('submit');
        await wrapper.vm.$nextTick();
        // Should not change mainHSL
        expect(store.state.mainHSL).toBe('hsl(0, 0%, 0%)');
    });
});
