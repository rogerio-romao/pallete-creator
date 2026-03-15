import { coverageConfigDefaults } from 'vitest/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        coverage: {
            all: true,
            exclude: ['src/main.js', ...coverageConfigDefaults.exclude],
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
        environment: 'jsdom',
        globals: true,
    },
});
