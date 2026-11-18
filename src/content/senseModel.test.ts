/**
 * Kvalitetsplanen A6: display order, level and inflection per sense, and the sense inventory.
 * Ids never change; only how the senses are shown and graded.
 */
import { getContent, orderSenses } from './repository';
import type { VocabularyEntry } from './schema';

describe('betydelser: ordning, nivå och böjning per betydelse', () => {
  const repo = getContent();

  it('vardagsbetydelsen av arbete visas först fast den har id .2', () => {
    const e = repo.getEntry('e.arbete')!;
    expect(e.senses.map((s) => s.id)).toEqual(['s.arbete.2', 's.arbete.1']);
    expect(repo.getSense('s.arbete.2')!.senseIndex).toBe(0);
    expect(e.senseInventory?.coreSense).toBe('s.arbete.2');
  });

  it('nivån följer betydelsen: arbete (jobb) A1, arbete (i fysik) B2', () => {
    expect(repo.getSense('s.arbete.2')!.entry.level).toBe('A1');
    expect(repo.getSense('s.arbete.1')!.entry.level).toBe('B2');
  });

  it('böjningen följer betydelsen: ett damm (smuts) men en damm (sjö)', () => {
    const dust = repo.getSense('s.damm.1')!.entry.inflection;
    const pond = repo.getSense('s.damm.2')!.entry.inflection;
    expect(dust.kind === 'noun' && dust.gender).toBe('ett');
    expect(dust.kind === 'noun' && dust.indefPl).toBeNull();
    expect(pond.kind === 'noun' && pond.gender).toBe('en');
    // the mass-noun grammar note follows the sense's own inflection
    expect(repo.grammarNotesFor('s.damm.1').map((n) => n.id)).toContain('gn.mass-noun');
  });

  it('orderSenses: betydelser med order först, sedan resten i filordning; ingen order = oförändrad post', () => {
    const s = (id: string, order?: number) => ({ id, order } as unknown as VocabularyEntry['senses'][number]);
    const e = (senses: VocabularyEntry['senses']) => ({ id: 'e.x', senses } as unknown as VocabularyEntry);
    const plain = e([s('s.x.1'), s('s.x.2')]);
    expect(orderSenses(plain)).toBe(plain);
    expect(orderSenses(e([s('s.x.1'), s('s.x.2'), s('s.x.3', 1)])).senses.map((x) => x.id)).toEqual(['s.x.3', 's.x.1', 's.x.2']);
    expect(orderSenses(e([s('s.x.1', 3), s('s.x.2', 2), s('s.x.3', 1)])).senses.map((x) => x.id)).toEqual(['s.x.3', 's.x.2', 's.x.1']);
  });
});
