import { mount } from '@vue/test-utils';
import { createToast } from 'mosha-vue-toastify';
import { describe, expect, it, vi } from 'vitest';
import { createStore } from 'vuex';
import SignInModal from './SignInModal.vue';

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((auth, cb) => cb(null)),
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: {} })),
    createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: {} })),
}));

vi.mock('mosha-vue-toastify', () => ({
    createToast: vi.fn(),
}));

const createVuexStore = () => {
    return createStore({
        state: {
            isUserSignedIn: false,
        },
    });
};

describe('SignInModal', () => {
    it('renders sign in mode by default', () => {
        const store = createVuexStore();
        const wrapper = mount(SignInModal, {
            global: { plugins: [store] },
        });
        expect(wrapper.find('h3').text()).toBe('Sign In');
    });

    it('switches to signup mode', async () => {
        const store = createVuexStore();
        const wrapper = mount(SignInModal, {
            global: { plugins: [store] },
        });

        await wrapper.find('.switch-mode-msg span').trigger('click');
        expect(wrapper.find('h3').text()).toBe('Register');
    });

    it('shows validation error for invalid email', async () => {
        const store = createVuexStore();
        const wrapper = mount(SignInModal, {
            global: { plugins: [store] },
        });

        // Set invalid email
        await wrapper.find('#email').setValue('invalid-email');
        // Set a password to pass password check
        await wrapper.find('#password').setValue('password123');

        // Find the 'Sign In' button and trigger click
        const buttons = wrapper.findAll('button.secondary-button');
        const signInButton = buttons.find((btn) =>
            btn.text().includes('Sign In'),
        );
        await signInButton.trigger('click');

        // Assert createToast was called with the error message
        expect(createToast).toHaveBeenCalledWith(
            'Please enter a valid email address.',
            expect.any(Object),
        );
    });

    it('emits close event', async () => {
        const store = createVuexStore();
        const wrapper = mount(SignInModal, {
            global: { plugins: [store] },
        });

        await wrapper.find('button.secondary-button').trigger('click');
        expect(wrapper.emitted('close')).toBeTruthy();
    });
});
