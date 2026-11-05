/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps every asset path relative, so the same build works on
// GitHub Pages (/Swechan/), any sub-path and locally. Routing is hash-based.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separate chunks so app updates don't invalidate cached libraries/content.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          // Lesson bodies are lazy-loaded: let each become its own chunk (0.4 phase D).
          if (id.includes('/src/content/data/modules/')) return undefined;
          if (id.includes('/src/content/data/')) return 'content';
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // content-wide tests iterate over every module word; they grow with the content
    testTimeout: 60_000,
  },
});
