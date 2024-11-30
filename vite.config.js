import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

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
    };
});
