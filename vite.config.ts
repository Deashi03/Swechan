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
          // Animation player (0.12): its own lazily loaded chunk.
          if (id.includes('/src/ui/anim/')) return 'anim';
          // Face rig + face scenes (0.14): one lazy chunk, loaded when a face visual is shown.
          if (id.includes('/src/ui/face/') || id.includes('/src/content/data/faces/') || id.endsWith('/src/content/faces.ts')) return 'face';
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
    // agent worktrees (.claude/worktrees) contain full copies of the repo
    exclude: ['**/node_modules/**', '**/dist/**', '.claude/**'],
  },
});
