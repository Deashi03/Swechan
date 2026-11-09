import { getContent } from '../../content/repository';
import fs from 'node:fs';
import { AREA_MOTIF, MOTIFS, MODULE_MOTIF, ROOT_MOTIF } from './motifs';
import { GROUP_MOTIF } from './groupMotifs';
import { artFor } from './Art';
import { renderArt } from './render';

describe('illustrations (0.5)', () => {
  // 0.7: new modules are published without pictures until the new picture/animation pipeline exists.
  it('every root area has its own picture', () => {
    for (const r of ['R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08']) expect(artFor(r), r).not.toBeNull();
  });
  it('every sub-area (överämne) in the catalog has its own picture, distinct from roots and modules', () => {
    const catalog = JSON.parse(fs.readFileSync('planning/catalog/swechan-catalog.v1.json', 'utf8')) as { categories: { catalogCategoryId: string }[] };
    const areas = catalog.categories.map((c) => c.catalogCategoryId).filter((id) => id.length === 7);
    expect(areas.length).toBe(48);
    const motifs = areas.map((id) => { const a = artFor(id); expect(a, id).not.toBeNull(); return a!.motif; });
    expect(new Set(motifs).size).toBe(areas.length);
    const others = new Set([...Object.values(ROOT_MOTIF), ...Object.values(MODULE_MOTIF)]);
    for (const m of motifs) expect(others.has(m), m).toBe(false);
    for (const k of Object.values(AREA_MOTIF)) expect(MOTIFS[k], k).toBeDefined();
  });
  it('every topic group (ämnesgrupp) in the catalog has its own picture, distinct from roots, areas and modules', () => {
    const catalog = JSON.parse(fs.readFileSync('planning/catalog/swechan-catalog.v1.json', 'utf8')) as { categories: { catalogCategoryId: string }[] };
    const groups = catalog.categories.map((c) => c.catalogCategoryId).filter((id) => id.length === 11);
    expect(groups.length).toBe(288);
    const motifs = groups.map((id) => { const a = artFor(id); expect(a, id).not.toBeNull(); return a!.motif; });
    expect(new Set(motifs).size).toBe(groups.length);
    const others = new Set([...Object.values(ROOT_MOTIF), ...Object.values(AREA_MOTIF), ...Object.values(MODULE_MOTIF)]);
    for (const m of motifs) expect(others.has(m), m).toBe(false);
    for (const k of Object.values(GROUP_MOTIF)) expect(MOTIFS[k], k).toBeDefined();
  });
  it('every catalog module in the finished root areas (Vardag, Människan, Samhälle, Historia, Natur, Vetenskap) has a picture', () => {
    const catalog = JSON.parse(fs.readFileSync('planning/catalog/swechan-catalog.v1.json', 'utf8')) as { modules: { catalogId: string }[] };
    const done = catalog.modules.filter((m) => /^SWC-(VAR|MAN|SAM|HIS|NAT|VET)-/.test(m.catalogId));
    expect(done.length).toBe(1512);
    for (const m of done) { expect(artFor(m.catalogId), m.catalogId).not.toBeNull(); expect(MOTIFS[MODULE_MOTIF[m.catalogId]!], m.catalogId).toBeDefined(); }
  });
  it('catalog modules with a picture never share a motif with each other or with categories', () => {
    const catalog = JSON.parse(fs.readFileSync('planning/catalog/swechan-catalog.v1.json', 'utf8')) as { modules: { catalogId: string }[] };
    const motifs = catalog.modules.flatMap((m) => { const a = artFor(m.catalogId); return a ? [a.motif] : []; });
    expect(new Set(motifs).size).toBe(motifs.length);
    const cats = new Set([...Object.values(ROOT_MOTIF), ...Object.values(AREA_MOTIF), ...Object.values(GROUP_MOTIF)]);
    for (const m of motifs) expect(cats.has(m), m).toBe(false);
  });
  it('no two published modules share a motif, and every referenced motif exists', () => {
    const used = getContent().modules.flatMap((m) => { const a = artFor(m.id); return a ? [a.motif] : []; });
    expect(new Set(used).size).toBe(used.length);
    for (const k of [...Object.values(MODULE_MOTIF), ...Object.values(ROOT_MOTIF)]) expect(MOTIFS[k], k).toBeDefined();
  });
  it('renders a self-contained SVG without emoji or text', () => {
    const svg = renderArt('house', 24);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).not.toMatch(/<text|\p{Extended_Pictographic}/u);
  });
});
