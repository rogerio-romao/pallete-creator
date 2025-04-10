import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import store from '../store/index';
import MainNav from './MainNav.vue';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    signOut: vi.fn(() => Promise.resolve()),
}));

// Mock the firebase app
vi.mock('../lib/firebase', () => ({
    app: {},
}));

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
            'Instructions'
        );
    });

    it('renders the sign out button when the user is signed in', async () => {
        store.state.isUserSignedIn = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="sign-out-link"]').text()).toBe(
            'Sign Out'
        );
    });

    it('renders the sign in button when the user is not signed in', async () => {
        store.state.isUserSignedIn = false;
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="sign-in-link"]').text()).toBe(
            'Sign In'
        );
    });

    it('logs out the user when the sign out button is clicked', async () => {
        store.state.isUserSignedIn = true;
        await wrapper.vm.$nextTick();

        // Setup the mock dispatch to resolve immediately
        const dispatchSpy = vi.spyOn(store, 'dispatch').mockResolvedValue();

        const signOutButton = wrapper.find('[data-test="sign-out-link"]');
        await signOutButton.trigger('click');

        // Wait for all promises to resolve
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Now check that dispatch was called correctly
        expect(dispatchSpy).toHaveBeenCalledWith('SIGNOUT_USER');

        // Manually update the state since we mocked the dispatch
        store.state.isUserSignedIn = false;
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[data-test="sign-in-link"]').text()).toBe(
            'Sign In'
        );

        // Clean up
        dispatchSpy.mockRestore();
    });

    it('renders the fullscreen button with the correct icon when minimized', () => {
        expect(
            wrapper.find('[data-test="fullscreen-link-minimised"]').exists()
        ).toBe(true);
        const fullscreenIcon = wrapper.find(
            '[data-test="fullscreen-link-minimised"] i'
        );
        expect(fullscreenIcon.classes()).toContain('fa-expand-arrows-alt');
    });

    it('toggles fullscreen mode when clicking the button', async () => {
        // Mock the document methods
        const mockRequestFullscreen = vi.fn();
        const mockExitFullscreen = vi.fn();

        document.documentElement.requestFullscreen = mockRequestFullscreen;
        document.exitFullscreen = mockExitFullscreen;

        // Click to enter fullscreen
        await wrapper
            .find('[data-test="fullscreen-link-minimised"]')
            .trigger('click');
        expect(mockRequestFullscreen).toHaveBeenCalled();
        expect(
            wrapper.find('[data-test="fullscreen-link-maximised"]').exists()
        ).toBe(true);
        expect(
            wrapper.find('[data-test="fullscreen-link-maximised"] i').classes()
        ).toContain('fa-window-minimize');

        // Click to exit fullscreen
        await wrapper
            .find('[data-test="fullscreen-link-maximised"]')
            .trigger('click');
        expect(mockExitFullscreen).toHaveBeenCalled();
        expect(
            wrapper.find('[data-test="fullscreen-link-minimised"]').exists()
        ).toBe(true);
    });
});
