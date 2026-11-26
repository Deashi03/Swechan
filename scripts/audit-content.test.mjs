/**
 * Tests for the quality gate (scripts/audit-content.mjs) and automatic contentVersion
 * (scripts/content-version.mjs). Synthetic changes are applied to an in-memory copy of the real
 * content, never to the files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, analyse, compare, GATED_METRICS, typography, isRendaku, svSentences, jaSentences, parityProblem } from './audit-content.mjs';
import { moduleHashes } from './content-version.mjs';

const root = process.env.SWECHAN_REPO ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const clone = (x) => structuredClone(x);

let base;
let baseRes;
beforeAll(() => {
  base = loadContent();
  baseRes = analyse(base);
});

describe('kvalitetsspärren', () => {
  it('den incheckade lägstanivån stämmer med innehållet (npm run audit:content -- --check)', () => {
    const { worse } = compare(baseRes.metrics, readJson('quality/metrics.json').metrics);
    expect(worse).toEqual([]);
    expect(baseRes.violations).toEqual([]);
  });

  it('ett sämre mått fäller spärren', () => {
    const c = { ...base, vis: new Map(base.vis), faces: new Set(base.faces) };
    const victim = base.modules[0].words.map((w) => w.senseId).find((s) => c.vis.has(s) && !c.faces.has(s));
    c.vis.delete(victim);
    const res = analyse(c);
    const { worse } = compare(res.metrics, baseRes.metrics);
    expect(worse.map((w) => w.metric)).toContain('ord utan bild');
  });

  it('ett mått som nått 0 rapporteras och spärras fortfarande (0.62)', () => {
    for (const k of GATED_METRICS) expect(baseRes.metrics).toHaveProperty([k]);
    expect(compare({ 'ord utan bild': 1 }, { 'ord utan bild': 0 }).worse).toHaveLength(1);
  });

  it('färre animationer fäller spärren (högre är bättre)', () => {
    expect(compare({ 'ord med animation': 10 }, { 'ord med animation': 11 }).worse).toHaveLength(1);
    expect(compare({ 'ord med animation': 12 }, { 'ord med animation': 11 }).better).toHaveLength(1);
    expect(compare({ 'ord utan bild': 4 }, { 'ord utan bild': 5 }).better).toHaveLength(1);
  });

  it('ett nytt mått utan lägstanivå fäller inte spärren förrän det skrivits in', () => {
    expect(compare({ 'nytt mått': 3 }, {}).worse).toEqual([]);
  });

  it('en ny modul utan standard 2 bryter mot kontraktet', () => {
    const m = clone(base.modules[0]);
    m.id = 'm.zz-syntetisk';
    const c = { ...base, modules: [...base.modules, m] };
    const res = analyse(c);
    expect(res.violations.some((v) => v.module === 'm.zz-syntetisk' && v.rule === 'standard')).toBe(true);
  });

  it('en ny modul med standard 2 kontrolleras mot K1–K10 för sina egna ord', () => {
    const verbEntry = base.entries.find((e) => e.pos === 'verb' && e.level === 'B2' && e.senses.length === 1);
    const s = clone(verbEntry.senses[0]);
    s.id = 's.zzverb.1';
    s.examples = s.examples.slice(0, 1);
    const entry = { ...clone(verbEntry), id: 'e.zzverb', lemma: 'zzverb', senses: [s] };
    delete entry.senseInventory;
    const m = clone(base.modules[0]);
    m.id = 'm.zz-ny';
    m.standard = 2;
    m.words = [{ senseId: 's.zzverb.1', active: true }, ...m.words.slice(1)];
    m.reading.factSources = ['fri text'];
    const senses = new Map(base.senses);
    senses.set(s.id, { entry, sense: s });
    const plan = { ...base.plan, 's.zzverb.1': { kind: 'animation', by: 'manual' } };
    const c = { ...base, modules: [...base.modules, m], entries: [...base.entries, entry], senses, plan };
    const rules = new Set(analyse(c).violations.filter((v) => v.module === 'm.zz-ny').map((v) => v.rule));
    for (const r of ['K1', 'K2', 'K3', 'K6', 'K9']) expect(rules).toContain(r);
    expect(rules).not.toContain('standard');
  });
});

describe('hjälpfunktioner', () => {
  it('typografi', () => {
    expect(typography('Det var bra..')).toContain('dubbelpunkt');
    expect(typography('Ge något till till en annan.')).toContain('dubbla ord');
    expect(typography('Han sa "hej".')).toContain('raka citattecken');
    expect(typography('Det var var han bodde.')).toEqual([]);
    expect(typography('Vänta...')).toEqual([]);
    expect(typography('Ord ,ord')).toContain('blanksteg före skiljetecken');
  });
  it('tonande första ljud godtas', () => {
    expect(isRendaku('かいしゃ', 'がいしゃ')).toBe(true);
    expect(isRendaku('ふとん', 'ぶとん')).toBe(true);
    expect(isRendaku('きょう', 'こんにち')).toBe(false);
  });
  it('meningar', () => {
    expect(svSentences('Det är t.ex. 3.5 meter. Bra!')).toBe(2);
    expect(svSentences('Vem? Varför? Det vet ingen.')).toBe(1);
    expect(jaSentences('{雨|あめ}です。いいです')).toBe(2);
    expect(parityProblem('En mening. Två meningar. Tre. Fyra. Fem meningar här.', '一つです。')).toMatch(/meningar/);
    expect(parityProblem('Kort.', '短い。')).toBeNull();
  });
});

describe('automatisk contentVersion', () => {
  it('fingeravtrycken är aktuella (npm run content:version -- --check)', () => {
    const now = moduleHashes();
    const stored = readJson('quality/content-hashes.json').modules;
    for (const [id, x] of Object.entries(now)) {
      expect(stored[id]?.hash, id).toBe(x.hash);
      expect(stored[id]?.contentVersion, id).toBe(x.contentVersion);
    }
  });
});
