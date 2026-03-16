import { coverageConfigDefaults } from 'vitest/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        coverage: {
            all: true,
            exclude: [
                'src/main.js',
                'stylelint.config.mjs',
                ...coverageConfigDefaults.exclude,
            ],
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
        environment: 'jsdom',
        globals: true,
    },
});
