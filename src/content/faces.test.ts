/** 0.14: face scenes – data, registry and the definitions in scripts/faces stay in sync, and every frame renders. */
import { describe, expect, it } from 'vitest';
import { allFaceScenes, FaceSceneSchema } from './faces';
import { allWordImages, quizImageFor } from './images';
import { faceSvg, sampleFace } from '../ui/face/rig';
import { KROPP_FACES } from '../../scripts/faces/kropp.faces';

const faces = allFaceScenes();
const registered = allWordImages().filter((i) => i.kind === 'face');

describe('face scenes', () => {
  it('every face visual has a scene and every scene a face visual', () => {
    expect(registered.map((i) => i.senseId).sort()).toEqual(Object.keys(faces).sort());
  });
  it('faces.json is generated from scripts/faces (npm run faces:build)', () => {
    const defs = Object.fromEntries(KROPP_FACES.map((d) => [d.sense, d.scene]));
    expect(faces).toEqual(defs);
  });
  it.each(Object.entries(faces))('%s is valid and renders every frame without NaN', (_s, scene) => {
    expect(FaceSceneSchema.safeParse(scene).success).toBe(true);
    for (let t = 0; t <= scene.durationMs; t += 100) {
      const svg = faceSvg(scene, t, 'x');
      expect(svg).not.toMatch(/NaN|undefined/);
    }
    const peak = sampleFace(scene, scene.posterMs).params;
    expect(Object.values(peak).every(Number.isFinite)).toBe(true);
  });
  it('quiz faces have a group and are not symbols', () => {
    for (const i of registered) if (quizImageFor(i.senseId)) expect(i.symbol).toBeFalsy();
  });
});
