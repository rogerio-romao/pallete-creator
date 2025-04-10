import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { coverageConfigDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.FIREBASE_API_KEY': JSON.stringify(
                env.FIREBASE_API_KEY
            ),
        },
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
    };
});
