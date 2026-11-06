/** 0.13: word scenes authored as data in scripts/scenes must be valid and in sync with public/anim/scenes. */
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Scene, compileScene } from '../ui/anim/player';
import { build } from '../../scripts/scenes/kit';
import { KROPP } from '../../scripts/scenes/kropp.scenes';
import { KROPP2 } from '../../scripts/scenes/kropp2.scenes';
import { imageFor } from './images';

const defs = [...KROPP, ...KROPP2];

describe('scene definitions (scripts/scenes)', () => {
  it('have unique senses', () => {
    const senses = defs.map((d) => d.sense);
    expect(new Set(senses).size).toBe(senses.length);
  });
  it.each(defs.map((d) => [d.sense, d] as const))('%s parses, compiles without warnings and matches the shipped scene', (sense, d) => {
    const parsed = Scene.safeParse(build(d));
    expect(parsed.success, parsed.success ? '' : JSON.stringify(parsed.error.issues)).toBe(true);
    if (!parsed.success) return;
    expect(compileScene(parsed.data).warnings).toEqual([]);
    const v = imageFor(sense);
    expect(v?.kind, `${sense} is registered as an animation`).toBe('animation');
    if (v?.kind !== 'animation') return;
    const shipped = JSON.parse(fs.readFileSync(`public/anim/scenes/${v.file}.json`, 'utf8'));
    expect(shipped.timeline, 'run npm run scenes:build -- --out dist/scenes && npm run visuals:import dist/scenes').toEqual(parsed.data.timeline);
  });
});
