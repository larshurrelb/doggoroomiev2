import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { copyFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: 'public',
  publicDir: false, // Don't copy public dir as static assets
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false
  },
  plugins: [
    {
      name: 'copy-rive-file',
      closeBundle() {
        const src = resolve(__dirname, 'public/dog_animations.riv');
        const dest = resolve(__dirname, 'dist/dog_animations.riv');
        copyFileSync(src, dest);
        console.log('Copied dog_animations.riv to dist/');
      }
    }
  ]
});
