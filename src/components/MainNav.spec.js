import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import store from '../store/index';
import MainNav from './MainNav.vue';

// oxlint-disable-next-line max-lines-per-function
describe('MainNav', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(MainNav, {
            global: {
                plugins: [store],
            },
        });
    });

    it('renders', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('renders the instructions button', () => {
        expect(wrapper.find('[data-test="instructions-link"]').text()).toBe(
            'Instructions',
        );
    });

    it('renders the fullscreen button with the correct icon when minimized', () => {
        expect(
            wrapper.find('[data-test="fullscreen-link-minimised"]').exists(),
        ).toBe(true);
        const fullscreenIcon = wrapper.find(
            '[data-test="fullscreen-link-minimised"] i',
        );
        expect(fullscreenIcon.classes()).toContain('fa-expand-arrows-alt');
    });

    it('toggles fullscreen mode when clicking the button', async () => {
        const mockRequestFullscreen = vi.fn();
        const mockExitFullscreen = vi.fn();

        document.documentElement.requestFullscreen = mockRequestFullscreen;
        document.exitFullscreen = mockExitFullscreen;

        await wrapper
            .find('[data-test="fullscreen-link-minimised"]')
            .trigger('click');
        expect(mockRequestFullscreen).toHaveBeenCalled();
        expect(
            wrapper.find('[data-test="fullscreen-link-maximised"]').exists(),
        ).toBe(true);
        expect(
            wrapper.find('[data-test="fullscreen-link-maximised"] i').classes(),
        ).toContain('fa-window-minimize');

        await wrapper
            .find('[data-test="fullscreen-link-maximised"]')
            .trigger('click');
        expect(mockExitFullscreen).toHaveBeenCalled();
        expect(
            wrapper.find('[data-test="fullscreen-link-minimised"]').exists(),
        ).toBe(true);
    });
});
