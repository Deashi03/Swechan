/**
 * Motion library: parametric generators that write joint tracks for one actor
 * over [from, to]. All cycles are written as dense keyframes so the result is
 * plain data. Angles: 0 = down, + = forward.
 */
import { addKey, dense, tween, type Tracks } from '../engine/track';
import { REST_POSE, legAngles, SEG } from '../engine/rig';
import type { Joint } from '../schema/scene';
import type { EaseName } from '../engine/easing';

export const J = (actor: string, j: Joint) => `${actor}.j.${j}`;
const TAU = Math.PI * 2;

/** Set every joint to a pose at time t with an eased transition from the current value. */
export function poseTo(tr: Tracks, a: string, from: number, to: number, pose: Partial<Record<Joint, number>>, e: EaseName = 'easeInOut'): void {
  for (const [j, v] of Object.entries(pose) as [Joint, number][]) tween(tr, J(a, j), from, to, v, e);
}
export function restPose(tr: Tracks, a: string, from: number, to: number): void { poseTo(tr, a, from, to, REST_POSE); }

/**
 * Gait model shared by walk and run. Feet are driven by *foot placement*, not
 * by angle sweeps: during stance the planted foot moves backward under the hips
 * at exactly the ground speed, during swing it arcs forward. Leg angles come
 * from IK, so nothing slides and knees only bend backward. Returns the ground
 * speed (units/s) the body must travel (or the world must scroll) to match.
 *   stride  = distance between two footfalls of the same foot / 2 (one step)
 *   duty    = fraction of the cycle a foot is on the ground (walk ≈ 0.62, run ≈ 0.36 → flight phase)
 */
export type Gait = {
  stepLen: number; cycleMs: number; duty: number; swingLift: number; lean: number; armSwing: number; elbow: number; bob: number; flightLift: number;
  /** hips sink this many units: knees stay bent (sneaking) */ crouch?: number;
  /** foot angle during stance: > 0 = on the toes (tiptoeing); the body rises with it */ toe?: number;
  /** uneven legs (limping): the right leg is on the ground for `dutyR` of the cycle, the left for `dutyL`; step lengths follow so planted feet never slide */ asym?: { dutyL: number; dutyR: number; offsetR: number; dip: number };
  /** irregular rhythm (staggering): the gait phase speeds up and slows down by this amount; the body follows the phase (see gaitPhase) */ warp?: number;
  /** torso sway amplitude in degrees on top of the lean (staggering, trudging) */ sway?: number;
  /** head angle relative to level: > 0 = looking down (trudging) */ headDown?: number;
};
export type GaitKind = 'walk' | 'run' | 'jog' | 'careful' | 'lope' | 'sprint' | 'sneak' | 'tiptoe' | 'trudge' | 'march' | 'limp' | 'stagger';
export const GAITS: Record<GaitKind, Gait> = {
  // step lengths keep the contact leg reachable (leg = 32 units): d = hypot(step/2, hipH + lift − 2.4) < 32
  walk: { stepLen: 17, cycleMs: 1100, duty: 0.62, swingLift: 3.5, lean: 3, armSwing: 16, elbow: 18, bob: 1.8, flightLift: 0 },
  run: { stepLen: 22, cycleMs: 660, duty: 0.36, swingLift: 9, lean: 15, armSwing: 32, elbow: 95, bob: 3.2, flightLift: 5 },
  jog: { stepLen: 14, cycleMs: 760, duty: 0.42, swingLift: 6, lean: 8, armSwing: 22, elbow: 90, bob: 2.4, flightLift: 3 },
  // careful: short slow steps, almost no bob or arm swing – the gait of someone carrying something that must not spill
  careful: { stepLen: 9, cycleMs: 1500, duty: 0.66, swingLift: 2, lean: 0, armSwing: 3, elbow: 70, bob: 0.6, flightLift: 0 },
  // lope: a slow, loose run that is almost a walk – short flight, low arms, upright (lunka)
  lope: { stepLen: 12, cycleMs: 940, duty: 0.47, swingLift: 4, lean: 4, armSwing: 12, elbow: 60, bob: 2.2, flightLift: 1.5 },
  // sprint: longest steps, deep lean, pumping arms, long flight (sprinta, rusa)
  sprint: { stepLen: 27, cycleMs: 560, duty: 0.3, swingLift: 13, lean: 24, armSwing: 46, elbow: 95, bob: 3, flightLift: 6 },
  // sneak: crouched, long slow steps, torso forward, hands up in front (smyga)
  sneak: { stepLen: 15, cycleMs: 1700, duty: 0.7, swingLift: 5, lean: 22, armSwing: 4, elbow: 100, bob: 0.5, flightLift: 0, crouch: 6 },
  // tiptoe: small quick steps on the toes, body raised, arms bent (tassa)
  tiptoe: { stepLen: 8, cycleMs: 760, duty: 0.58, swingLift: 6, lean: 3, armSwing: 4, elbow: 110, bob: 1.2, flightLift: 0, toe: 48 },
  // trudge: slow heavy steps, feet barely lift, head and shoulders down, arms hang (traska)
  trudge: { stepLen: 12, cycleMs: 1500, duty: 0.66, swingLift: 1.6, lean: 9, armSwing: 7, elbow: 4, bob: 2.6, flightLift: 0, sway: 1.5, headDown: 16 },
  // march: upright, knees high, straight arms swinging high, even beat (marschera)
  march: { stepLen: 15, cycleMs: 1000, duty: 0.56, swingLift: 15, lean: -1, armSwing: 52, elbow: 2, bob: 1, flightLift: 0 },
  // limp: the right leg hurts – short stance on it, the body dips and leans when it carries weight (halta)
  limp: { stepLen: 12, cycleMs: 1300, duty: 0.62, swingLift: 2.5, lean: 5, armSwing: 8, elbow: 20, bob: 1, flightLift: 0, asym: { dutyL: 0.74, dutyR: 0.36, offsetR: 0.64, dip: 6 } },
  // stagger: small uneven steps, swaying body, arms out for balance (stappla)
  stagger: { stepLen: 9, cycleMs: 1150, duty: 0.66, swingLift: 3, lean: 6, armSwing: 4, elbow: 20, bob: 1.8, flightLift: 0, warp: 1.35, sway: 18 },
};
export const gaitSpeed = (g: Gait): number => g.stepLen / ((g.duty * g.cycleMs) / 1000); // the planted foot covers stepLen during its stance time
/** Gait phase in cycles since `from`. Linear unless the gait has `warp`; the body must travel in proportion to it so feet stay planted. */
export function gaitPhase(g: Gait, from: number, t: number): number {
  const u = (t - from) / g.cycleMs;
  return g.warp ? u + (g.warp / (2 * Math.PI)) * Math.sin((2 * Math.PI * u) / 1.7) : u; // d/du = 1 + (warp/1.7)·cos(…) stays > 0 for warp < 1.7
}

/** Smoothstep. */
const ss = (u: number) => u * u * (3 - 2 * u);

export function gait(tr: Tracks, a: string, from: number, to: number, g: Gait, inPlace = false, backward = false): number {
  const hipH = SEG.hipH;
  const v = gaitSpeed(g) / 1000; // units per ms of phase-time
  const dir = backward ? -1 : 1; // walking backward: planted feet slide forward under the hips, the swing arcs backward
  const legParams = g.asym
    ? { L: { duty: g.asym.dutyL, off: 0 }, R: { duty: g.asym.dutyR, off: g.asym.offsetR } }
    : { L: { duty: g.duty, off: 0 }, R: { duty: g.duty, off: 0.5 } };
  // phase of a foot in [0,1): stance for φ < duty, swing otherwise
  const footTarget = (phi: number, duty: number, lift = g.swingLift): { dx: number; dy: number } => {
    const S = v * duty * g.cycleMs; // step length that matches the ground speed for this leg's stance time
    if (phi < duty) { const u = phi / duty; return { dx: dir * (S / 2 - u * S), dy: 0 }; }
    const u = (phi - duty) / (1 - duty);
    // the foot lifts quickly after toe-off and comes down more gently (asymmetric arc)
    return { dx: dir * (-S / 2 + ss(u) * S), dy: -lift * Math.sin(Math.PI * Math.pow(u, 0.7)) };
  };
  // limping: the sore right leg is swung almost straight and low (dragged), the healthy one steps normally
  const swingLiftOf = (side: 'L' | 'R') => (g.asym && side === 'R' ? 0.6 : g.swingLift);
  const toeRise = g.toe ? 2.2 : 0; // standing on the toes lifts the body
  const bodyLift = (phase: number): number => {
    const stepPhase = (phase * 2) % 1; // two steps per cycle
    let base = -g.bob * (0.5 + 0.5 * Math.cos(2 * Math.PI * (stepPhase - 0.15))) - (g.crouch ?? 0) + toeRise;
    if (g.asym) { // the body drops while the sore right leg carries it
      const pr = (phase - g.asym.offsetR + 1) % 1;
      if (pr < g.asym.dutyR) base -= g.asym.dip * Math.sin(Math.PI * (pr / g.asym.dutyR));
    }
    if (g.duty < 0.5) { // flight when neither foot is on the ground
      const flightStart = g.duty * 2, flightLen = 1 - flightStart;
      if (stepPhase > flightStart && flightLen > 0) { const w = (stepPhase - flightStart) / flightLen; return g.flightLift * 4 * w * (1 - w); } // flight: unchanged from the original gait (springa's airborne share depends on it)
    }
    return base;
  };
  const step = 40;
  const n = Math.max(1, Math.round((to - from) / step));
  for (let i = 0; i <= n; i++) {
    const t = Math.round(from + ((to - from) * i) / n);
    const cyc = gaitPhase(g, from, t);
    const phase = ((cyc % 1) + 1) % 1;
    const lift = bodyLift(phase);
    for (const side of ['L', 'R'] as const) {
      const { duty, off } = legParams[side];
      const phi = (phase - off + 1) % 1;
      const ft = footTarget(phi, duty, swingLiftOf(side));
      // ankle relative to hip: ground is hipH below the hip when lift = 0; ankle sits 2 above the sole (higher on the toes)
      const ang = legAngles([ft.dx, hipH + lift - 2.4 - toeRise + ft.dy]); // on the toes the ankle stays raised through the swing too, so the foot never dips below the floor at touch-down
      addKey(tr, J(a, `thigh${side}` as Joint), { t, v: ang.thigh, e: 'linear' });
      addKey(tr, J(a, `shin${side}` as Joint), { t, v: ang.shin, e: 'linear' });
      const swingFoot = 12 * Math.sin(Math.PI * ((phi - duty) / (1 - duty)));
      addKey(tr, J(a, `foot${side}` as Joint), { t, v: phi < duty ? (g.toe ?? 0) : Math.max(swingFoot, g.toe ?? 0), e: 'linear' });
    }
    let lean = g.lean;
    if (g.asym) { const pr = (phase - g.asym.offsetR + 1) % 1; if (pr < g.asym.dutyR) lean += 7 * Math.sin(Math.PI * (pr / g.asym.dutyR)); }
    // arms swing opposite to the legs; elbows bent more at speed
    const swing = Math.sin(2 * Math.PI * phase);
    const sway = (g.sway ?? 0) * Math.sin(2 * Math.PI * cyc * (g.warp ? 0.62 : 0.5));
    if (g.warp) { // staggering: arms held out and flailing a little for balance
      addKey(tr, J(a, 'uArmL'), { t, v: 62 + 16 * Math.sin(2 * Math.PI * cyc * 0.8), e: 'linear' }); // never above shoulder height: an arm over the face reads as hiding it
      addKey(tr, J(a, 'uArmR'), { t, v: -58 + 16 * Math.sin(2 * Math.PI * cyc * 0.8 + 1.7), e: 'linear' });
      addKey(tr, J(a, 'fArmL'), { t, v: g.elbow, e: 'linear' });
      addKey(tr, J(a, 'fArmR'), { t, v: g.elbow, e: 'linear' });
    } else {
      const hold = g.crouch ? -8 : g.toe ? 6 : 0; // sneaking/tiptoeing: elbows bent up, hands up in front of the chest
      addKey(tr, J(a, 'uArmL'), { t, v: hold - g.armSwing * swing - (hold ? 0 : g.elbow * 0.18), e: 'linear' });
      addKey(tr, J(a, 'fArmL'), { t, v: g.elbow + 8 * swing, e: 'linear' });
      if (g.asym) { // limping: the arm on the sore side hangs still (a hand on the thigh read as holding the crotch in a front-facing figure, blind test gs3)
        addKey(tr, J(a, 'uArmR'), { t, v: -6 - lean, e: 'linear' }); addKey(tr, J(a, 'fArmR'), { t, v: 4, e: 'linear' });
      } else {
        addKey(tr, J(a, 'uArmR'), { t, v: hold + g.armSwing * swing - (hold ? 0 : g.elbow * 0.18), e: 'linear' });
        addKey(tr, J(a, 'fArmR'), { t, v: g.elbow - 8 * swing, e: 'linear' });
      }
    }
    addKey(tr, J(a, 'torso'), { t, v: dir * (lean + sway) + 1.5 * Math.sin(4 * Math.PI * phase), e: 'linear' });
    addKey(tr, J(a, 'head'), { t, v: -dir * (lean + sway) * 0.7 + (g.headDown ?? 0), e: 'linear' }); // head stays level unless the gait looks down
    addKey(tr, `${a}.lift`, { t, v: lift, e: 'linear' });
  }
  void inPlace;
  return gaitSpeed(g);
}
/** Leg angles for an ankle target relative to the hip (re-exported IK for actions that place feet themselves). */
export const legAnglesTo = (target: [number, number]) => legAngles(target);
export const walkCycle = (tr: Tracks, a: string, from: number, to: number): number => gait(tr, a, from, to, GAITS.walk);
export const runCycle = (tr: Tracks, a: string, from: number, to: number): number => gait(tr, a, from, to, GAITS.run);
/** Jump: anticipation crouch → push-off → parabolic flight → landing squash → recover. Returns [flightStart, flightEnd]. */
export function jump(tr: Tracks, a: string, from: number, durationMs: number, height: number): [number, number] {
  const t1 = from + durationMs * 0.26, t2 = from + durationMs * 0.34, t3 = from + durationMs * 0.78, end = from + durationMs;
  // crouch (anticipation): knees bend, arms back, torso forward, hips sink
  poseTo(tr, a, from, t1, { thighL: 46, thighR: 42, shinL: -78, shinR: -74, torso: 22, uArmL: -58, uArmR: -54, fArmL: 10, fArmR: 10, head: -10 }, 'easeInOut');
  tween(tr, `${a}.lift`, from, t1, -8, 'easeInOut');
  tween(tr, `${a}.lift`, t1, t2, 0, 'easeIn'); // push-off: legs extend, arms swing up
  poseTo(tr, a, t1, t2, { thighL: 8, thighR: 4, shinL: -4, shinR: -2, torso: 6, uArmL: 118, uArmR: 112, fArmL: 16, fArmR: 16, head: 4 }, 'easeOut');
  // flight: a real parabola (constant downward acceleration)
  dense(tr, `${a}.lift`, t2, t3, (t) => { const v = (t - t2) / (t3 - t2); return height * 4 * v * (1 - v); }, 0, 30);
  poseTo(tr, a, t2, from + durationMs * 0.56, { thighL: 34, thighR: 22, shinL: -46, shinR: -34 }, 'easeInOut'); // tuck at the apex
  poseTo(tr, a, from + durationMs * 0.56, t3, { thighL: 18, thighR: 12, shinL: -14, shinR: -10, uArmL: 60, uArmR: 56, fArmL: 20, fArmR: 20 }, 'easeIn'); // reach for the ground
  // landing squash and recovery
  poseTo(tr, a, t3, t3 + (end - t3) * 0.4, { thighL: 44, thighR: 40, shinL: -72, shinR: -68, torso: 18, head: -6, uArmL: 30, uArmR: 26 }, 'easeOut');
  tween(tr, `${a}.lift`, t3, t3 + (end - t3) * 0.4, -6, 'easeOut');
  tween(tr, `${a}.lift`, t3 + (end - t3) * 0.4, end, 0, 'easeOut');
  poseTo(tr, a, t3 + (end - t3) * 0.4, end, { ...REST_POSE }, 'easeOut');
  return [t2, t3];
}
/** Breathing idle with periodic blinks. */
export function idleBreathe(tr: Tracks, a: string, from: number, to: number): void {
  dense(tr, J(a, 'torso'), from, to, (t) => 1.5 * Math.sin(((t - from) / 1000) * TAU * 0.35), 0, 80);
  dense(tr, `${a}.lift`, from, to, (t) => 0.4 * Math.sin(((t - from) / 1000) * TAU * 0.35), 0, 80);
  blinks(tr, a, from, to);
}
export function blinks(tr: Tracks, a: string, from: number, to: number, every = 2800): void {
  for (let t = from + 900; t + 160 < to; t += every) {
    addKey(tr, `${a}.blink`, { t, v: true }); addKey(tr, `${a}.blink`, { t: t + 140, v: false });
  }
}
export function footWiggle(tr: Tracks, a: string, from: number, to: number, joint: Joint = 'footL'): void {
  dense(tr, J(a, joint), from, to, (t) => 14 * Math.sin(((t - from) / 1000) * TAU * 0.9), 0, 60);
}
/** Jog on the spot (run cycle without travel, smaller lean). */
export function jogInPlace(tr: Tracks, a: string, from: number, to: number): number { return gait(tr, a, from, to, GAITS.jog, true); }
/**
 * Keepy-uppies: a ball bounces off the knee in a true parabola; the knee rises to meet it.
 * Writes the actor's legs/arms and the ball's x/y (world) – call with the knee's world position.
 */
export function kickUps(tr: Tracks, a: string, ball: string, from: number, to: number, kneeWorld: [number, number], facing: 1 | -1, periodMs = 720, height = 18): void {
  const r = 6; // ball radius
  const hits: number[] = [];
  for (let t = from; t <= to; t += periodMs) hits.push(t);
  for (let i = 0; i < hits.length; i++) {
    const t0 = hits[i]!, t1 = hits[i + 1] ?? to;
    dense(tr, `${ball}.y`, t0, t1, (t) => { const v = (t - t0) / Math.max(1, t1 - t0); return kneeWorld[1] - 2 - height * 4 * v * (1 - v); }, 0, 30);
    addKey(tr, `${ball}.x`, { t: t0, v: kneeWorld[0] + facing * 1.5 });
    // knee lift: thigh rises to meet the ball just before the hit, foot hangs down
    poseTo(tr, a, Math.max(from, t0 - 200), t0, { thighL: 86, shinL: -92, footL: 20, uArmL: 36, uArmR: -30, fArmL: 40, fArmR: 40, torso: 6 }, 'easeOut');
    poseTo(tr, a, t0 + 40, Math.min(t1, t0 + 320), { thighL: 14, shinL: -10, footL: 0, uArmL: 22, uArmR: -16, fArmL: 30, fArmR: 30, torso: 2 }, 'easeInOut');
  }
  dense(tr, `${a}.lift`, from, to, (t) => -1.2 + 1.2 * Math.cos((2 * Math.PI * (t - from)) / periodMs), 0, 40);
  void r;
}
/** Stretch: arms up, side lean, then forward bend toward the toes, back up. */
export function stretch(tr: Tracks, a: string, from: number, to: number): void {
  tween(tr, `${a}.lift`, from, from + 1, 0, 'linear');
  const d = to - from, k = (u: number) => from + d * u;
  poseTo(tr, a, from, k(0.2), { uArmL: 168, uArmR: 164, fArmL: 6, fArmR: 6, torso: -8, head: 10, thighL: 0, thighR: 0, shinL: 0, shinR: 0 });
  poseTo(tr, a, k(0.2), k(0.38), { torso: -14, head: 14 });
  poseTo(tr, a, k(0.38), k(0.52), { torso: 4, head: 2, uArmL: 40, uArmR: 36, fArmL: 30, fArmR: 30 });
  // lunge: front leg bent, back leg stretched, hands on the front thigh
  poseTo(tr, a, k(0.52), k(0.72), { thighL: 62, shinL: -72, thighR: -34, shinR: -4, torso: 12, head: -2, uArmL: 48, fArmL: 44, uArmR: 44, fArmR: 48 });
  tween(tr, `${a}.lift`, k(0.52), k(0.72), -8, 'easeInOut');
  tween(tr, `${a}.lift`, k(0.78), k(1), 0, 'easeInOut');
  poseTo(tr, a, k(0.78), k(1), { ...REST_POSE });
}
