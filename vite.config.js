import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            reporter: ['text', 'json', 'html'],
            provider: 'v8',
            exclude: ['src/main.js', ...coverageConfigDefaults.exclude],
            all: true,
        },
    },
});
