/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Kvalitetsplanen A4: the dictionary is split into one chunk per subject group (R01-A01 …), so a
 * release that adds or edits one group leaves the other chunks – and the learner's cache – alone.
 * Maps module slug -> subject group from the module index, the catalog and the published mapping.
 */
function dictionaryAreas(): Map<string, string> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const read = (p: string) => JSON.parse(fs.readFileSync(path.resolve(here, p), 'utf8'));
  const out = new Map<string, string>();
  try {
    const index = read('src/content/data/moduleIndex.json').modules as { id: string; categoryId: string }[];
    const catalog = read('planning/catalog/swechan-catalog.v1.json') as { modules: { catalogId: string; catalogCategoryId: string }[] };
    const mapping = read('src/content/data/catalog/publishedMapping.json') as { links: { moduleId: string; catalogId: string }[]; compatibilityPlacements: { moduleId: string; catalogCategoryId: string }[] };
    const catOf = new Map(catalog.modules.map((m) => [m.catalogId, m.catalogCategoryId]));
    const place = new Map(mapping.compatibilityPlacements.map((p) => [p.moduleId, p.catalogCategoryId]));
    const link = new Map(mapping.links.map((l) => [l.moduleId, catOf.get(l.catalogId)]));
    for (const m of index) {
      let cid: string | undefined = m.categoryId;
      if (!/^R\d\d-A\d\d/.test(cid)) cid = place.get(m.id) ?? link.get(m.id) ?? cid;
      out.set(m.id.slice(2), cid && /^R\d\d-A\d\d/.test(cid) ? cid.slice(0, 7) : 'misc');
    }
  } catch { /* fall back to one chunk */ }
  return out;
}
const dictArea = dictionaryAreas();

/**
 * Writes dist/asset-list.json: every hashed file of this build. The service worker (public/sw.js)
 * keeps cached assets across releases and removes only files that are no longer listed.
 */
const assetList: Plugin = {
  name: 'swechan-asset-list',
  apply: 'build',
  generateBundle(_options, bundle) {
    const files = Object.keys(bundle).filter((f) => f.startsWith('assets/')).sort();
    this.emitFile({ type: 'asset', fileName: 'asset-list.json', source: JSON.stringify(files) });
  },
};

// base: './' keeps every asset path relative, so the same build works on
// GitHub Pages (/Swechan/), any sub-path and locally. Routing is hash-based.
export default defineConfig({
  base: './',
  plugins: [react(), assetList],
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
          const dict = id.match(/\/src\/content\/data\/dictionary\/m-([^/]+)\.json$/);
          if (dict) return `dict-${dictArea.get(dict[1]!) ?? 'misc'}`;
          if (id.includes('/src/content/data/dictionary/')) return 'dict-base';
          if (id.endsWith('/src/content/data/images/wordVisuals.json')) return 'visuals';
          if (id.endsWith('/src/content/data/moduleIndex.json')) return 'module-index';
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
