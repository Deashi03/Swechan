/**
 * Eager access to ALL content including lesson bodies – for tests, the
 * content validators and CLI tools only. Never import this from app code
 * (it would put every lesson into the startup bundle).
 */
import { ContentRepository, loadBundledContent } from './repository';
import type { Module } from './schema';

export function loadAllModuleBodiesEager(): unknown[] {
  return Object.values(import.meta.glob('./data/modules/*.json', { eager: true, import: 'default' }));
}

/** A repository with every lesson body already in memory. */
export function toolingRepository(): ContentRepository {
  const raw = loadBundledContent();
  return new ContentRepository({ ...raw, moduleIndex: undefined, loadBody: undefined, modules: loadAllModuleBodiesEager() });
}

export function allModuleBodies(repo: ContentRepository): Module[] {
  return repo.modules.map((m) => repo.getLoadedModuleBody(m.id)).filter((m): m is Module => !!m);
}
