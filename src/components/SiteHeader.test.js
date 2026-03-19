import { mount } from '@vue/test-utils';

import store from '../store/index';

import SiteHeader from './SiteHeader.vue';

// oxlint-disable-next-line max-lines-per-function
describe('componentSiteHeader', () => {
    /** @type {import('@vue/test-utils').VueWrapper} */
    let wrapper;

    beforeEach(() => {
        wrapper = mount(SiteHeader, {
            global: {
                plugins: [store],
            },
        });
    });

    it('renders', () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('renders the instructions button', () => {
        expect(wrapper.find('[data-testid="instructions-link"]').text()).toBe(
            'Instructions',
        );
    });

    it('renders the fullscreen button with the correct icon when minimized', () => {
        expect(
            wrapper.find('[data-testid="fullscreen-link-minimised"]').exists(),
        ).toBeTruthy();
        const fullscreenIcon = wrapper.find(
            '[data-testid="fullscreen-link-minimised"] i',
        );
        expect(fullscreenIcon.classes()).toContain('fa-expand-arrows-alt');
    });

    it('toggles fullscreen mode when clicking the button', async () => {
        const mockRequestFullscreen = vi.fn();
        const mockExitFullscreen = vi.fn();
        document.documentElement.requestFullscreen = mockRequestFullscreen;
        document.exitFullscreen = mockExitFullscreen;
        await wrapper
            .find('[data-testid="fullscreen-link-minimised"]')
            .trigger('click');

        expect(mockRequestFullscreen).toHaveBeenCalledWith();
        expect(
            wrapper.find('[data-testid="fullscreen-link-maximised"]').exists(),
        ).toBeTruthy();
        expect(
            wrapper
                .find('[data-testid="fullscreen-link-maximised"] i')
                .classes(),
        ).toContain('fa-window-minimize');

        await wrapper
            .find('[data-testid="fullscreen-link-maximised"]')
            .trigger('click');
        expect(mockExitFullscreen).toHaveBeenCalledWith();
        expect(
            wrapper.find('[data-testid="fullscreen-link-minimised"]').exists(),
        ).toBeTruthy();
    });

    it('emits openInstructionsModal when instructions button is clicked', async () => {
        await wrapper
            .find('[data-testid="instructions-link"]')
            .trigger('click');
        expect(wrapper.emitted('openInstructionsModal')).toBeTruthy();
    });
});
