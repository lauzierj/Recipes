import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'static',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/search.ts'),
      formats: ['iife'],
      fileName: () => 'search.js'
    }
  }
});

