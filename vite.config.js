import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // Относительные пути для Electron
  build: {
    minify: 'esbuild',
    cssMinify: true,
    outDir: 'dist', // Папка сборки
    assetsDir: 'assets', // Папка для JS/CSS
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
