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
            threshold: {
                branches: 90,
                functions: 90,
                lines: 90,
                statements: 90,
            },
        },
        environment: 'jsdom',
        globals: true,
    },
});
