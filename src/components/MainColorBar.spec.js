import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import store from '../store/index';
import MainColorBar from './MainColorBar.vue';

describe('MainColorBar', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(MainColorBar, {
            global: { plugins: [store] },
        });
    });

    it('renders', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('sets the main color when the random button is clicked', async () => {
        const randomButton = wrapper.find('[data-test="random-button"]');
        await randomButton.trigger('click');
        expect(store.state.mainHSL).toMatch(/hsl\(\d+,\s*\d+%,\s*\d+%\)/);
    });

    it('sets the main color when the rgb input is submitted', async () => {
        const rgbInput = wrapper.find('[data-test="rgb-input"]');
        const rgbForm = wrapper.find('[data-test="rgb-form"]');

        await rgbInput.setValue('255, 0, 0');
        await rgbForm.trigger('submit');

        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(0, 100%, 50%)');
    });

    it('sets the main color when the hex input is submitted', async () => {
        const hexInput = wrapper.find('[data-test="hex-input"]');
        const hexForm = wrapper.find('[data-test="hex-form"]');

        await hexInput.setValue('ffffff');
        await hexForm.trigger('submit');

        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(0, 0%, 100%)');
    });

    it('sets the main color when the hsl input is submitted', async () => {
        const hslInput = wrapper.find('[data-test="hsl-input"]');
        const hslForm = wrapper.find('[data-test="hsl-form"]');

        await hslInput.setValue('30, 40, 100');
        await hslForm.trigger('submit');

        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(30, 40%, 100%)');
    });

    it('sets the main color when the color input is submitted', async () => {
        const colorInput = wrapper.find('[data-test="color-input"]');
        const colorForm = wrapper.find('[data-test="color-form"]');

        await colorInput.setValue('#00ffff');
        await colorForm.trigger('submit');

        await wrapper.vm.$nextTick();

        expect(store.state.mainHSL).toBe('hsl(180, 100%, 50%)');
    });
});
