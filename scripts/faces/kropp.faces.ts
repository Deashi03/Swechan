/**
 * Face scenes for Kroppen & sinnena (0.14): every word where the face carries the meaning.
 * Rules (also in CONTENT_GUIDELINES.md → Ansiktsuttryck):
 * - start with a neutral key at t = 0, build up to the expression, hold it; the poster is the peak,
 * - one main cue per word, plus supporting cues (brows + lids + mouth agree with each other),
 * - words that are easy to confuse (stirra / snegla / blänga) differ in a cue you can see in a still.
 */
import { HAND_AT, type FaceKey, type FaceScene, type Overlay } from '../../src/ui/face/rig';

export type FaceDef = { sense: string; group: string; quiz?: boolean; confusable?: string[]; scene: FaceScene };

/** Neutral values for every parameter a scene touches – use at t = 0 and when returning. */
export const N = { browRaise: 0, browTilt: 0, browKnit: 0, browAsym: 0, eyeOpen: 1, squint: 0, lookX: 0, lookY: 0, noseWrinkle: 0, nostrilFlare: 0, smile: 0.15, smirk: 0, mouthOpen: 0, mouthRound: 0, mouthWidth: 1, lipBite: 0, pout: 0, teeth: 0, puff: 0, cheeks: 0, blush: 0, tilt: 0, yaw: 0, nod: 0, jitter: 0, hand: 0 } as const;
const HAPPY = { browRaise: 0.25, eyeOpen: 0.85, squint: 0.5, smile: 0.95, cheeks: 0.9, mouthOpen: 0.3 };
const SAD = { browRaise: 0.1, browTilt: 1, eyeOpen: 0.75, lookY: 0.5, smile: -0.8, mouthOpen: 0, cheeks: 0, squint: 0 };
const ANGRY = { browRaise: -0.6, browTilt: -1, browKnit: 1, eyeOpen: 0.85, squint: 0.3, smile: -0.6, mouthOpen: 0, lookY: 0, cheeks: 0 };
const SURPRISED = { browRaise: 1, browTilt: 0, browKnit: 0, eyeOpen: 1.35, squint: 0, smile: 0, mouthOpen: 0.5, mouthRound: 0.9, lookY: 0, cheeks: 0 };
const k = (t: number, p: Record<string, number | string>): FaceKey => ({ t, ...p }) as FaceKey;
const scene = (durationMs: number, posterMs: number, keys: FaceKey[], overlays?: Overlay[]): FaceScene => ({ durationMs, posterMs, ...(overlays ? { overlays } : {}), keys: [...keys].sort((a, b) => a.t - b.t) });
/** Keys that hold the current values of `p` at t (so the next key starts its transition there). */
const hold = (t: number, p: Record<string, number>): FaceKey => k(t, p);

export const KROPP_FACES: FaceDef[] = [
  // ── Ansiktsuttryck och miner ───────────────────────────────────────────
  { sense: 's.höja-på-ögonbrynen.1', group: 'ögonbryn', quiz: true, confusable: ['s.rynka-pannan.1'], scene: scene(2800, 1100, [
    k(0, N), hold(500, { browRaise: 0, eyeOpen: 1 }), k(800, { e: 'out', browRaise: 1, eyeOpen: 1.3 }), hold(1400, { browRaise: 1, eyeOpen: 1.3 }),
    k(1650, { browRaise: 0.45, eyeOpen: 1.1 }), k(1900, { e: 'out', browRaise: 1, eyeOpen: 1.3 })]) },
  { sense: 's.rynka-pannan.1', group: 'panna', quiz: true, confusable: ['s.höja-på-ögonbrynen.1', 's.blänga.1'], scene: scene(2800, 1500, [
    k(0, N), hold(500, { browRaise: 0, browKnit: 0, browTilt: 0, squint: 0, smile: 0.15 }),
    k(1200, { browRaise: -0.7, browKnit: 1, browTilt: -0.4, squint: 0.35, eyeOpen: 0.85, smile: -0.3, nod: 0.2 })]) },
  { sense: 's.rynka-på-näsan.1', group: 'näsa', quiz: true, scene: scene(3000, 1700, [
    k(0, { ...N, 'o:st': 0, 'x:st': 116 }), k(500, { 'o:st': 1 }), k(1100, { 'x:st': 100 }),
    hold(800, { noseWrinkle: 0, squint: 0, eyeOpen: 1, browRaise: 0, browKnit: 0, smile: 0.15, tilt: 0, yaw: 0 }),
    k(1300, { e: 'out', noseWrinkle: 1, squint: 0.7, eyeOpen: 0.6, browRaise: -0.5, browKnit: 0.6, smile: -0.5, tilt: -6, yaw: -0.35 })],
    [{ id: 'st', kind: 'stink', x: 100, y: 70 }]) },
  { sense: 's.leende.1', group: 'leende', quiz: true, confusable: ['s.flina.1', 's.surmulen.1'], scene: scene(2800, 2000, [
    k(0, N), hold(500, { smile: 0.15, cheeks: 0, squint: 0, eyeOpen: 1, browRaise: 0, mouthOpen: 0 }),
    k(1100, { smile: 0.9, cheeks: 0.8, squint: 0.45, eyeOpen: 0.9, browRaise: 0.2, mouthOpen: 0 }), hold(1500, { mouthOpen: 0 }), k(1900, { mouthOpen: 0.3 })]) },
  { sense: 's.flina.1', group: 'leende', confusable: ['s.leende.1'], scene: scene(2800, 1700, [
    k(0, N), hold(500, { smirk: 0, smile: 0.15, mouthOpen: 0, browAsym: 0, squint: 0, lookX: 0, tilt: 0, cheeks: 0 }),
    k(1300, { smirk: 0.9, smile: 0.7, mouthOpen: 0.28, browAsym: 0.9, squint: 0.55, lookX: 0.7, tilt: -7, cheeks: 0.6 })]) },
  { sense: 's.fnissa.1', group: 'skratt', scene: scene(3000, 1500, [
    k(0, { ...N, ...HAND_AT.down }), hold(300, { hand: 0, eyeOpen: 1, squint: 0, smile: 0.15, cheeks: 0, browTilt: 0, jitter: 0 }),
    k(700, { ...HAND_AT.mouth, hand: 1, eyeOpen: 0, squint: 1, smile: 0.8, cheeks: 1, browTilt: 0.5, browRaise: 0.3 }),
    k(800, { jitter: 1 }), hold(2500, { jitter: 1 }), k(2800, { jitter: 0 })]) },
  { sense: 's.grimas.1', group: 'grimas', confusable: ['s.min-ansikte.1'], scene: scene(2800, 1500, [
    k(0, N), hold(500, { teeth: 0, mouthOpen: 0, mouthWidth: 1, smile: 0.15, eyeOpen: 1, squint: 0, browKnit: 0, noseWrinkle: 0, tilt: 0 }),
    k(1100, { e: 'out', teeth: 1, mouthOpen: 0.6, mouthWidth: 1.4, smile: -0.25, eyeOpen: 0.15, squint: 1, browKnit: 1, browRaise: -0.4, noseWrinkle: 0.7, tilt: 6 })]) },
  { sense: 's.min-ansikte.1', group: 'grimas', confusable: ['s.grimas.1', 's.ansiktsuttryck.1'], scene: scene(2800, 1600, [
    k(0, N), hold(500, { browAsym: 0, smirk: 0, smile: 0.15, squint: 0, lookX: 0, tilt: 0 }),
    k(1200, { browAsym: 1, smirk: -0.9, smile: -0.3, squint: 0.5, lookX: 0.5, tilt: 5, noseWrinkle: 0.3 })]) },
  { sense: 's.ansiktsuttryck.1', group: 'grimas', confusable: ['s.min-ansikte.1', 's.humörsvängning.1'], scene: scene(3200, 400, [
    k(0, { ...N, ...HAPPY }), hold(600, HAPPY), k(900, { ...SURPRISED }), hold(1400, SURPRISED), k(1700, { ...ANGRY, mouthRound: 0 }), hold(2200, ANGRY), k(2500, { ...SAD, browKnit: 0 })]) },
  { sense: 's.himla-med-ögonen.1', group: 'blick', scene: scene(3200, 1150, [
    k(0, N), hold(400, { eyeOpen: 1, lookX: 0, lookY: 0, browRaise: 0, smile: 0.15, tilt: 0 }),
    k(700, { eyeOpen: 0.8, lookY: -1, lookX: -0.8, browRaise: 0.5 }), k(1150, { e: 'linear', lookX: 0 }), k(1600, { e: 'linear', lookX: 0.8 }),
    k(2000, { lookY: 0.1, lookX: 0, eyeOpen: 0.7, browRaise: 0.1, smile: -0.35, tilt: 6, mouthRound: 0.6, mouthOpen: 0.1 }), k(2200, { 'o:br': 0 }), k(2500, { 'o:br': 1 }), k(3000, { 'x:br': 96 })],
    [{ id: 'br', kind: 'breath', x: 76, y: 92, s: 0.8 }]) },
  { sense: 's.bita-sig-i-läppen.1', group: 'läpp', quiz: true, scene: scene(2800, 1600, [
    k(0, N), hold(500, { lipBite: 0, browTilt: 0, browRaise: 0, lookX: 0, lookY: 0, tilt: 0 }),
    k(1100, { lipBite: 1, browTilt: 0.9, browRaise: 0.25, lookX: -0.8, lookY: 0.45, tilt: -4 })]) },
  { sense: 's.snegla.1', group: 'blick', confusable: ['s.stirra.1', 's.blänga.1'], scene: scene(3000, 1000, [
    k(0, { ...N, eyeOpen: 0.85, 'o:pl': 1 }), hold(600, { lookX: 0 }), k(750, { e: 'out', lookX: 1 }), hold(1150, { lookX: 1 }), k(1300, { lookX: 0 }), hold(1800, { lookX: 0 }), k(1950, { e: 'out', lookX: 1 }), hold(2300, { lookX: 1 }), k(2450, { lookX: 0 })],
    [{ id: 'pl', kind: 'plate', x: 108, y: 102 }]) },
  { sense: 's.stirra.1', group: 'blick', confusable: ['s.snegla.1', 's.blänga.1'], scene: scene(3000, 2200, [
    k(0, N), hold(400, { eyeOpen: 1, browRaise: 0, mouthOpen: 0, nod: 0 }),
    k(1600, { eyeOpen: 1.4, browRaise: 0.25, mouthOpen: 0.08, mouthRound: 0.5, smile: 0, nod: -0.25 })]) },
  { sense: 's.blänga.1', group: 'blick', confusable: ['s.stirra.1', 's.snegla.1'], scene: scene(2800, 1600, [
    k(0, N), hold(400, { browRaise: 0, browKnit: 0, browTilt: 0, eyeOpen: 1, squint: 0, lookX: 0, smile: 0.15, nod: 0 }),
    k(1100, { browRaise: -0.7, browKnit: 1, browTilt: -1, eyeOpen: 0.75, squint: 0.45, lookX: 1, smile: -0.5, nod: 0.35 })]) },
  { sense: 's.surmulen.1', group: 'leende', quiz: true, confusable: ['s.leende.1'], scene: scene(2800, 1700, [
    k(0, N), hold(500, { pout: 0, smile: 0.15, browTilt: 0, browRaise: 0, lookX: 0, lookY: 0, yaw: 0, tilt: 0 }),
    k(1300, { pout: 1, smile: -0.65, browTilt: -0.5, browRaise: -0.35, lookX: -1, lookY: 0.4, yaw: -0.4, tilt: -6 })]) },
  { sense: 's.humörsvängning.1', group: 'känsla', confusable: ['s.ansiktsuttryck.1'], scene: scene(3400, 1250, [
    k(0, { ...N, ...HAPPY, 'o:tr': 0 }), hold(500, HAPPY), k(800, { ...SAD }), k(900, { 'o:tr': 0 }), k(1100, { 'o:tr': 1 }), hold(1500, SAD), k(1600, { 'o:tr': 0 }),
    k(1800, { ...ANGRY }), hold(2300, ANGRY), k(2600, { ...HAPPY, browKnit: 0, browTilt: 0 })],
    [{ id: 'tr', kind: 'tear', x: 42, y: 70 }]) },
  // ── Ögon, syn och ljus ─────────────────────────────────────────────────
  { sense: 's.blinka.1', group: 'ögon', scene: scene(2600, 780, [
    k(0, N), ...[700, 1500, 2100].flatMap((t) => [k(t, { eyeOpen: 1 }), k(t + 80, { e: 'linear', eyeOpen: 0 }), k(t + 180, { e: 'linear', eyeOpen: 1 })])]) },
  { sense: 's.kisa.1', group: 'ljus', confusable: ['s.bländad.1', 's.ljuskänslig.1'], scene: scene(2800, 1700, [
    k(0, { ...N, 'o:sun': 0 }), k(500, { 'o:sun': 1 }), hold(700, { squint: 0, eyeOpen: 1, browKnit: 0, browRaise: 0, noseWrinkle: 0, smile: 0.15 }),
    k(1300, { squint: 1, eyeOpen: 0.35, browKnit: 0.6, browRaise: -0.4, noseWrinkle: 0.3, smile: -0.1 })],
    [{ id: 'sun', kind: 'sun', x: 100, y: 18, s: 1.2 }]) },
  { sense: 's.bländad.1', group: 'ljus', confusable: ['s.kisa.1', 's.ljuskänslig.1'], scene: scene(2800, 1500, [
    k(0, { ...N, ...HAND_AT.down, 'o:sun': 0 }), k(350, { 'o:sun': 0 }), k(500, { e: 'out', 'o:sun': 1 }),
    hold(500, { eyeOpen: 1, squint: 0, yaw: 0, browKnit: 0, hand: 0 }), k(650, { e: 'out', eyeOpen: 0, squint: 1, browKnit: 0.8, yaw: -0.5, tilt: -5 }),
    k(1200, { ...HAND_AT.eyes, hand: 1 })],
    [{ id: 'sun', kind: 'sun', x: 100, y: 20, s: 1.6 }]) },
  { sense: 's.ljuskänslig.1', group: 'ljus', confusable: ['s.bländad.1', 's.kisa.1'], scene: scene(2800, 1700, [
    k(0, { ...N, 'o:l': 0 }), k(400, { 'o:l': 1 }), hold(600, { squint: 0, eyeOpen: 1, lookX: 0, browTilt: 0, yaw: 0, smile: 0.15 }),
    k(1300, { squint: 0.8, eyeOpen: 0.4, lookX: -1, browTilt: 0.7, yaw: -0.35, smile: -0.3 })],
    [{ id: 'l', kind: 'lamp', x: 102, y: 22, s: 1.2 }]) },
  { sense: 's.vakenhet.1', group: 'sömn', confusable: ['s.dåsig.1'], scene: scene(2800, 1800, [
    k(0, { ...N, 'o:sun': 0 }), k(500, { 'o:sun': 1 }), k(700, { eyeOpen: 1 }), k(780, { e: 'linear', eyeOpen: 0 }), k(880, { e: 'linear', eyeOpen: 1 }),
    hold(1000, { browRaise: 0, smile: 0.15, cheeks: 0 }), k(1500, { eyeOpen: 1.25, browRaise: 0.5, smile: 0.6, cheeks: 0.4 })],
    [{ id: 'sun', kind: 'sun', x: 100, y: 20 }]) },
  { sense: 's.dåsig.1', group: 'sömn', confusable: ['s.vakenhet.1'], scene: scene(3600, 2600, [
    k(0, { ...N, 'o:z': 0 }), k(500, { eyeOpen: 0.5, browRaise: -0.1 }), hold(900, { mouthOpen: 0, mouthRound: 0, eyeOpen: 0.5, browRaise: -0.1, nod: 0 }),
    k(1300, { mouthOpen: 1, mouthRound: 0.6, eyeOpen: 0, squint: 0.4, browRaise: 0.6, nod: -0.4 }), hold(1800, { mouthOpen: 1 }),
    k(2200, { mouthOpen: 0, mouthRound: 0, eyeOpen: 0.3, squint: 0, browRaise: 0, nod: 0.7, tilt: 7 }), k(2600, { 'o:z': 1 })],
    [{ id: 'z', kind: 'zzz', x: 92, y: 24 }]) },
  { sense: 's.rodna.1', group: 'hud', scene: scene(3000, 2400, [
    k(0, N), hold(500, { blush: 0, lookX: 0, lookY: 0, smile: 0.15, browTilt: 0, tilt: 0 }),
    k(1100, { lookX: -0.6, lookY: 0.8, smile: 0.4, browTilt: 0.4, tilt: -5 }), k(2300, { blush: 1 })]) },
  // ── Hörsel och lukt ────────────────────────────────────────────────────
  { sense: 's.höra-dåligt.1', group: 'hörsel', scene: scene(3000, 2000, [
    k(0, { ...N, ...HAND_AT.down, 'o:w': 0, 'o:q': 0 }), k(300, { 'o:w': 0.5 }),
    k(900, { ...HAND_AT.ear, hand: 1, browTilt: 0.8, lookX: 0.6, mouthRound: 0.7, mouthOpen: 0.15, yaw: 0.3 }), k(1500, { 'o:q': 0 }), k(1800, { 'o:q': 1 })],
    [{ id: 'w', kind: 'waves', x: 112, y: 64, flip: true, s: 0.7 }, { id: 'q', kind: 'question', x: 28, y: 22 }]) },
  { sense: 's.ljudkänslig.1', group: 'hörsel', scene: scene(2800, 1500, [
    k(0, { ...N, ...HAND_AT.down, 'o:b': 0 }), k(500, { 'o:b': 0 }), k(650, { e: 'out', 'o:b': 1 }),
    hold(650, { eyeOpen: 1, squint: 0, browTilt: 0, tilt: 0, hand: 0, jitter: 0 }),
    k(800, { e: 'out', eyeOpen: 0, squint: 1, browTilt: 1, browKnit: 0.6, tilt: -7, jitter: 0.6, smile: -0.4 }), k(1200, { ...HAND_AT.ear, hand: 1 }), k(1800, { jitter: 0 })],
    [{ id: 'b', kind: 'bell', x: 104, y: 22, s: 1.1 }]) },
  { sense: 's.uppmärksam.1', group: 'hörsel', scene: scene(2800, 1700, [
    k(0, { ...N, 'o:b': 0 }), k(500, { 'o:b': 1 }), hold(600, { eyeOpen: 1, browRaise: 0, lookX: 0, nod: 0, yaw: 0 }),
    k(1000, { e: 'out', eyeOpen: 1.3, browRaise: 0.6, lookX: 1, nod: -0.2, yaw: 0.3, smile: 0 })],
    [{ id: 'b', kind: 'bell', x: 106, y: 26 }]) },
  { sense: 's.överstimulerad.1', group: 'sinnen', scene: scene(3200, 2600, [
    k(0, { ...N, ...HAND_AT.down, 'o:a': 0, 'o:b': 0, 'o:c': 0, 'o:d': 0, 'o:e': 0 }), k(300, { 'o:a': 1 }), k(700, { 'o:b': 1 }), k(1100, { 'o:c': 1 }), k(1500, { 'o:d': 1 }), k(1900, { 'o:e': 1 }),
    k(500, { browTilt: 0.5, eyeOpen: 1.2 }), k(1300, { eyeOpen: 0.4, browTilt: 1, smile: -0.4, jitter: 0.3 }), k(2000, { eyeOpen: 0, squint: 1, browKnit: 0.8, jitter: 0.8 }), k(2400, { ...HAND_AT.forehead, hand: 1 })],
    [{ id: 'a', kind: 'note', x: 18, y: 30 }, { id: 'b', kind: 'bell', x: 104, y: 22 }, { id: 'c', kind: 'lamp', x: 16, y: 62 }, { id: 'd', kind: 'exclaim', x: 102, y: 60 }, { id: 'e', kind: 'lightning', x: 60, y: 8 }]) },
  { sense: 's.känna-lukten-av.1', group: 'lukt', confusable: ['s.sniffa.1'], scene: scene(3000, 1900, [
    k(0, { ...N, 'o:sm': 0, 'x:sm': 116 }), k(400, { 'o:sm': 1 }), k(1300, { 'x:sm': 90 }),
    hold(1100, { browRaise: 0, eyeOpen: 1, nostrilFlare: 0, yaw: 0, smile: 0.15, lookX: 0 }),
    k(1600, { browRaise: 0.6, eyeOpen: 1.2, nostrilFlare: 0.8, yaw: 0.4, smile: 0.4, lookX: 0.8 })],
    [{ id: 'sm', kind: 'smell', x: 92, y: 74 }]) },
  { sense: 's.sniffa.1', group: 'lukt', confusable: ['s.känna-lukten-av.1'], scene: scene(3000, 1150, [
    k(0, { ...N, 'o:sm': 0, eyeOpen: 0.7, browRaise: 0.3, lookX: 0.4 }), k(400, { 'o:sm': 0.8 }),
    ...[600, 950, 1300, 1650, 2000].flatMap((t) => [k(t, { nostrilFlare: 0, nod: 0 }), k(t + 120, { e: 'out', nostrilFlare: 1, nod: -0.25 }), k(t + 300, { nostrilFlare: 0.2, nod: 0 })])],
    [{ id: 'sm', kind: 'smell', x: 96, y: 76, s: 0.8 }]) },
  { sense: 's.hålla-för-näsan.1', group: 'lukt', scene: scene(3000, 1900, [
    k(0, { ...N, ...HAND_AT.down, 'o:st': 0, 'x:st': 116 }), k(400, { 'o:st': 1 }), k(1100, { 'x:st': 98 }),
    hold(800, { squint: 0, eyeOpen: 1, browKnit: 0, yaw: 0, hand: 0, noseWrinkle: 0 }),
    k(1100, { noseWrinkle: 0.6, squint: 0.8, eyeOpen: 0.4, browKnit: 0.8, yaw: -0.3, smile: -0.4 }), k(1500, { ...HAND_AT.nose, hand: 1 })],
    [{ id: 'st', kind: 'stink', x: 98, y: 72 }]) },
  // ── Andning och kroppsljud ─────────────────────────────────────────────
  { sense: 's.andas-in.1', group: 'andning', confusable: ['s.andas-ut.1'], scene: scene(3000, 1500, [
    k(0, { ...N, 'o:br': 0, 'x:br': 108 }), k(300, { 'o:br': 1 }), k(1500, { e: 'linear', 'x:br': 74 }), k(1700, { 'o:br': 0 }),
    hold(300, { nostrilFlare: 0, eyeOpen: 1, browRaise: 0, nod: 0, smile: 0.15 }),
    k(1500, { nostrilFlare: 1, eyeOpen: 0, squint: 0.2, browRaise: 0.35, nod: -0.35, smile: 0 })],
    [{ id: 'br', kind: 'breath', x: 108, y: 70, flip: true }]) },
  { sense: 's.andas-ut.1', group: 'andning', confusable: ['s.andas-in.1'], scene: scene(3000, 1300, [
    k(0, { ...N, 'o:br': 0, 'x:br': 70, eyeOpen: 0, nod: -0.3 }), k(500, { mouthRound: 0.8, mouthOpen: 0.3, nod: 0.25 }), k(600, { 'o:br': 1 }), k(2000, { e: 'linear', 'x:br': 100 }), k(2300, { 'o:br': 0 })],
    [{ id: 'br', kind: 'breath', x: 70, y: 92 }]) },
  { sense: 's.hålla-andan.1', group: 'andning', scene: scene(3200, 2400, [
    k(0, { ...N, 'o:c': 0 }), k(400, { nod: -0.3, nostrilFlare: 1, browRaise: 0.4 }), k(900, { nod: 0, nostrilFlare: 0, puff: 1, smile: 0, eyeOpen: 0, squint: 0.5, browRaise: 0.3 }),
    k(1100, { 'o:c': 1 }), k(2600, { blush: 1 })],
    [{ id: 'c', kind: 'clock', x: 100, y: 24 }]) },
  { sense: 's.kippa-efter-andan.1', group: 'andning', confusable: ['s.luftbrist.1'], scene: scene(3000, 900, [
    k(0, { ...N, browTilt: 1, eyeOpen: 1.3 }), ...[500, 1200, 1900].flatMap((t) => [k(t, { mouthOpen: 0.3, nod: 0 }), k(t + 250, { e: 'out', mouthOpen: 1, nod: -0.5, nostrilFlare: 1 }), k(t + 650, { mouthOpen: 0.4, nod: 0, nostrilFlare: 0.3 })])]) },
  { sense: 's.luftbrist.1', group: 'andning', confusable: ['s.kippa-efter-andan.1'], scene: scene(3000, 1800, [
    k(0, { ...N, ...HAND_AT.down }), k(800, { mouthOpen: 1, eyeOpen: 1.35, browTilt: 1, browRaise: 0.4, pale: 0.5 }), k(1300, { ...HAND_AT.chin, hand: 1, jitter: 0.5 })]) },
  { sense: 's.nysa.1', group: 'kroppsljud', scene: scene(2800, 1250, [
    k(0, { ...N, 'o:sp': 0 }), k(300, { eyeOpen: 1 }), k(1000, { eyeOpen: 0.5, browRaise: 0.7, mouthRound: 0.8, mouthOpen: 0.35, nostrilFlare: 1, nod: -0.7 }),
    k(1150, { e: 'out', eyeOpen: 0, squint: 1, browRaise: -0.3, mouthRound: 0, mouthOpen: 0.7, nod: 1, jitter: 1 }), k(1150, { 'o:sp': 0, 'o:sq': 0 }), k(1200, { 'o:sp': 1, 'o:sq': 1 }), k(1700, { 'o:sp': 0, 'o:sq': 0, jitter: 0 }),
    k(2200, { ...N })], [{ id: 'sp', kind: 'spray', x: 36, y: 96, s: 1.6 }, { id: 'sq', kind: 'spray', x: 84, y: 96, s: 1.6, flip: true }]) },
  { sense: 's.hosta.1', group: 'kroppsljud', scene: scene(3000, 1300, [
    k(0, { ...N, ...HAND_AT.down }), k(500, { ...HAND_AT.mouth, hand: 1, eyeOpen: 0, squint: 0.8, browTilt: 0.6 }),
    ...[800, 1300, 1800].flatMap((t) => [k(t, { nod: 0, jitter: 0 }), k(t + 90, { e: 'out', nod: 0.6, jitter: 0.8 }), k(t + 300, { nod: 0, jitter: 0 })])]) },
  { sense: 's.rapa.1', group: 'kroppsljud', confusable: ['s.uppstötning.1'], scene: scene(2800, 1100, [
    k(0, { ...N, 'o:b': 0 }), k(700, { mouthRound: 0, mouthOpen: 0 }), k(900, { e: 'out', mouthRound: 1, mouthOpen: 0.6, browRaise: 0.7, eyeOpen: 1.2, nod: -0.4 }), k(900, { 'o:b': 0 }), k(1000, { 'o:b': 1 }),
    k(1700, { 'o:b': 0, mouthRound: 0, mouthOpen: 0, smile: 0.6, blush: 0.9, browRaise: 0.2, eyeOpen: 0.9, lookX: -0.6, nod: 0 })],
    [{ id: 'b', kind: 'bubble', x: 92, y: 30, text: 'rap!' }]) },
  { sense: 's.uppstötning.1', group: 'kroppsljud', confusable: ['s.rapa.1'], scene: scene(2800, 1500, [
    k(0, { ...N, ...HAND_AT.down }), k(700, { puff: 0.6, eyeOpen: 1.3, browTilt: 1, browRaise: 0.4, nod: -0.3 }), k(1100, { ...HAND_AT.mouth, hand: 1, puff: 0.3, jitter: 0.4 }), k(1800, { jitter: 0 })]) },
  { sense: 's.hicka.1', group: 'kroppsljud', scene: scene(3000, 720, [
    k(0, { ...N, 'o:b': 0 }), ...[600, 1300, 2000].flatMap((t) => [k(t, { eyeOpen: 1, browRaise: 0, nod: 0, 'o:b': 0 }), k(t + 80, { e: 'out', eyeOpen: 1.35, browRaise: 0.9, nod: -0.6, mouthRound: 0.4, 'o:b': 1 }), k(t + 450, { eyeOpen: 1, browRaise: 0.1, nod: 0, mouthRound: 0, 'o:b': 0 })])],
    [{ id: 'b', kind: 'bubble', x: 94, y: 28, text: 'hick!' }]) },
  { sense: 's.skrika.1', group: 'tal', scene: scene(2800, 1400, [
    k(0, { ...N, 'o:x': 0, 'o:w': 0 }), k(500, { browRaise: 0.2 }), k(900, { e: 'out', mouthOpen: 1, mouthWidth: 1.25, browTilt: -1, browKnit: 0.8, browRaise: -0.3, eyeOpen: 1.2, nod: -0.5 }),
    k(1000, { 'o:x': 1, 'o:w': 1 })], [{ id: 'x', kind: 'exclaim', x: 98, y: 24 }, { id: 'w', kind: 'waves', x: 92, y: 90 }]) },
  // ── Huvudrörelser ──────────────────────────────────────────────────────
  { sense: 's.vrida-på-huvudet.1', group: 'huvud', confusable: ['s.skaka-på-huvudet.1'], scene: scene(3000, 1100, [
    k(0, N), k(400, { yaw: 0, lookX: 0 }), k(1000, { yaw: -1, lookX: -1 }), hold(1400, { yaw: -1, lookX: -1 }), k(2100, { yaw: 1, lookX: 1 }), hold(2400, { yaw: 1, lookX: 1 }), k(2900, { yaw: 0, lookX: 0 })]) },
  { sense: 's.skaka-på-huvudet.1', group: 'huvud', confusable: ['s.vrida-på-huvudet.1'], scene: scene(2800, 800, [
    k(0, N), k(400, { smile: -0.5, browKnit: 0.5, browRaise: -0.2 }), ...[500, 860, 1220, 1580].flatMap((t) => [k(t, { yaw: -0.55, lookX: -0.4 }), k(t + 180, { yaw: 0.55, lookX: 0.4 })]), k(2100, { yaw: 0, lookX: 0 })]) },
  { sense: 's.känna-på-sig.1', group: 'aning', scene: scene(3000, 2100, [
    k(0, { ...N, ...HAND_AT.down, 'o:b': 0 }), k(700, { ...HAND_AT.chin, hand: 1, lookY: -0.8, lookX: 0.6, browAsym: 0.7, smile: 0.25, tilt: 5 }), k(1400, { 'o:b': 0 }), k(1800, { 'o:b': 1 }), k(1800, { eyeOpen: 1.2, browRaise: 0.4 })],
    [{ id: 'b', kind: 'bulb', x: 100, y: 22, s: 1.2 }]) },
  // ── Hud och sjukdom ────────────────────────────────────────────────────
  { sense: 's.gulsot.1', group: 'sjukdom', scene: scene(2800, 1800, [
    k(0, { ...N }), k(1200, { yellow: 0.9, eyeOpen: 0.6, browTilt: 0.5, smile: -0.2 }), k(2000, { eyeOpen: 0.6 }), k(2100, { e: 'linear', eyeOpen: 0 }), k(2250, { e: 'linear', eyeOpen: 0.6 })]) },
  { sense: 's.blodbrist.1', group: 'sjukdom', scene: scene(2800, 1800, [
    k(0, { ...N }), k(1200, { pale: 1, eyeOpen: 0.5, browTilt: 0.6, smile: -0.3, tilt: 6, nod: 0.3 })]) },
  { sense: 's.demens.1', group: 'sjukdom', scene: scene(3200, 2000, [
    k(0, { ...N, 'o:q1': 0, 'o:q2': 0 }), k(600, { browTilt: 0.8, mouthRound: 0.5, mouthOpen: 0.1, lookX: -0.8 }), k(900, { 'o:q1': 1 }), k(1500, { lookX: 0.8, tilt: 5 }), k(1800, { 'o:q2': 1 }), k(2400, { lookX: 0, lookY: 0.3 })],
    [{ id: 'q1', kind: 'question', x: 24, y: 22 }, { id: 'q2', kind: 'question', x: 98, y: 26 }]) },
];
