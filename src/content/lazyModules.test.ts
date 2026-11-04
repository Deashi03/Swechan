import { execFileSync } from 'node:child_process';
import { ContentRepository, getContent, loadBundledContent, ModuleNotAvailableError } from './repository';

describe('lazy-loaded lesson bodies (0.4 phase D)', () => {
  it('the module index is generated from the module files and up to date', () => {
    expect(() => execFileSync(process.execPath, ['scripts/build-module-index.mjs', '--check'], { stdio: 'pipe' })).not.toThrow();
  });

  it('the index has metadata and words but no lesson body', () => {
    const m = getContent().getModule('m.atomer-molekyler')!;
    expect(m.words.length).toBeGreaterThanOrEqual(15);
    expect('reading' in m).toBe(false);
    expect('conversation' in m).toBe(false);
  });

  it('loads, validates and caches every published body', async () => {
    const repo = getContent();
    for (const meta of repo.modules) {
      const body = await repo.loadModuleBody(meta.id);
      expect(body.id).toBe(meta.id);
      expect(body.reading.paragraphs.length).toBeGreaterThan(0);
      expect(repo.getLoadedModuleBody(meta.id)).toBe(body);
      expect(await repo.loadModuleBody(meta.id)).toBe(body); // cached
    }
  });

  it('rejects planned catalog IDs and unknown modules', async () => {
    await expect(getContent().loadModuleBody('SWC-HIS-02-03-01')).rejects.toBeInstanceOf(ModuleNotAvailableError);
    await expect(getContent().loadModuleBody('m.finns-inte')).rejects.toBeInstanceOf(ModuleNotAvailableError);
  });

  it('a failed load can be retried', async () => {
    const raw = loadBundledContent();
    let calls = 0;
    const repo = new ContentRepository({ ...raw, loadBody: (f) => { calls++; return calls === 1 ? Promise.reject(new Error('nätverksfel')) : raw.loadBody!(f); } });
    await expect(repo.loadModuleBody('m.hemmet-vardag')).rejects.toThrow('nätverksfel');
    await expect(repo.loadModuleBody('m.hemmet-vardag')).resolves.toMatchObject({ id: 'm.hemmet-vardag' });
    expect(calls).toBe(2);
  });

  it('detects a stale index (body contentVersion differs)', async () => {
    const raw = loadBundledContent();
    const repo = new ContentRepository({ ...raw, loadBody: async (f) => ({ ...(await raw.loadBody!(f) as object), contentVersion: 999 }) });
    await expect(repo.loadModuleBody('m.krig-forsvar')).rejects.toThrow(/inaktuellt/);
  });
});
