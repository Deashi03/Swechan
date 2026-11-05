import { getContent } from '../../content/repository';
import { MOTIFS, MODULE_MOTIF, ROOT_MOTIF } from './motifs';
import { artFor } from './Art';
import { renderArt } from './render';

describe('illustrations (0.5)', () => {
  // 0.7: new modules are published without pictures until the new picture/animation pipeline exists.
  it('every root area has its own picture', () => {
    for (const r of ['R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R07', 'R08']) expect(artFor(r), r).not.toBeNull();
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
