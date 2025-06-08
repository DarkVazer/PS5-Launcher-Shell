import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        launcher: path.resolve(__dirname, 'launcher.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          components: [
            './src/components/Header.jsx',
            './src/components/GameTiles.jsx',
            './src/components/MustSeeSection.jsx',
            './src/components/TileWaveEffect.jsx',
          ],
        },
      },
    },
  },
});