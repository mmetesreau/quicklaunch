import {defineConfig} from 'vite'
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'public/manifest.json',
                    dest: '.',
                }
            ],
        }),
    ],
    build: {
	sourcemap: true,
        outDir: 'build',
        rollupOptions: {
            input: {
                index: './index.html',
                options: './options.html'
            },
        },
    },
});
