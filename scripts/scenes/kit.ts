/**
 * Helpers for authoring word scenes as data in Swechan (0.13). Scenes use the player's own
 * schema (src/ui/anim/schema/scene.ts) – the same format Animation_tool- exports – so they can
 * be moved to the tool later unchanged. Used for body words (postures, gestures, faces) that
 * the tool has no family for yet. See ARCHITECTURE.md ADR 37.
 */
import type { SceneInput } from '../../src/ui/anim/player';

export type Joints = Partial<Record<'torso' | 'head' | 'uArmL' | 'fArmL' | 'uArmR' | 'fArmR' | 'thighL' | 'shinL' | 'thighR' | 'shinR' | 'footL' | 'footR', number>>;
type Face = { eyes?: 'open' | 'half' | 'closed' | 'wide'; brows?: 'neutral' | 'up' | 'down' | 'worried'; mouth?: 'smile' | 'neutral' | 'open' | 'o' | 'calm' | 'frown'; gaze?: number };
type Action = Record<string, unknown> & { t: number; action: string };

export type Def = {
  sense: string; // senseId
  hint: string; // meaningHint (Swedish definition)
  group: string;
  category?: 'action' | 'state' | 'emotion' | 'property';
  quiz?: boolean;
  confusable?: string[];
  durationMs?: number;
  posterMs?: number;
  loop?: boolean;
  env?: 'neutral' | 'room' | 'bedroom' | 'kitchen' | 'outdoors.park' | 'street';
  actors?: SceneInput['actors'];
  props?: SceneInput['props'];
  shapes?: SceneInput['shapes'];
  timeline: Action[];
  feature: string;
  note?: string;
};

/** The main actor "p": standing at x, facing right by default. `close` = scale 1.7, head big in the frame (faces). */
export const P = (o: { x?: number; y?: number; facing?: 'left' | 'right'; close?: boolean; top?: string; bottom?: string; hair?: string; hairStyle?: 'short' | 'long' | 'bun' | 'curly'; id?: string; variant?: 'a' | 'b' | 'c'; shorts?: boolean; face?: Face } = {}) => ({
  id: o.id ?? 'p', asset: 'character.base' as const, variant: o.variant ?? 'a',
  at: { x: o.x ?? 60, y: o.y ?? (o.close ? 186 : 104) }, facing: o.facing ?? 'right', scale: o.close ? 1.7 : 1,
  wardrobe: { top: o.top ?? 'teal', bottom: o.bottom ?? 'dark', ...(o.hair ? { hair: o.hair } : {}), ...(o.hairStyle ? { hairStyle: o.hairStyle } : {}), ...(o.shorts ? { shorts: true } : {}) },
  ...(o.face ? { face: o.face } : {}),
});

/** Pose keyframes: [t, joints, durationMs?, ease?] for one actor. */
export const poses = (actor: string, keys: [number, Joints, number?, string?][], extra: Record<string, unknown> = {}): Action[] =>
  keys.map(([t, joints, d, ease]) => ({ t, action: 'pose', actor, joints, durationMs: d ?? 400, ease: ease ?? 'easeInOut', ...extra }));
export const pose = (actor: string, t: number, joints: Joints, d = 400, more: { lift?: number; bodyRotate?: number; ease?: string } = {}): Action => ({ t, action: 'pose', actor, joints, durationMs: d, ease: more.ease ?? 'easeInOut', ...(more.lift !== undefined ? { lift: more.lift } : {}), ...(more.bodyRotate !== undefined ? { bodyRotate: more.bodyRotate } : {}) });
export const face = (actor: string, t: number, f: Face): Action => ({ t, action: 'face', actor, ...f });
export const set = (target: string, prop: string, t: number, value: number | string | boolean): Action => ({ t, action: 'set', target, prop, value });
export const tween = (target: string, prop: string, t: number, to: number, d: number, from?: number, ease = 'easeInOut'): Action => ({ t, action: 'tween', target, prop, to, durationMs: d, ease, ...(from !== undefined ? { from } : {}) });
export const emph = (target: string, t: number, kind: 'ring' | 'glow' | 'arrowDown' | 'glint' | 'wobble' | 'stretch' | 'bounce' | 'crumbs', d = 800): Action => ({ t, action: 'emphasis', target, kind, durationMs: d });
export const sound = (target: string, t: number, kind: 'hum' | 'ring' | 'bark' | 'thump' | 'crunch' | 'splash', d = 1200): Action => ({ t, action: 'sound', target, kind, durationMs: d });
export const say = (actor: string, t: number, o: { icon?: string; text?: string; mood?: string; d?: number; gesture?: boolean; to?: string }): Action => ({ t, action: 'say', actor, ...(o.icon ? { icon: o.icon } : {}), ...(o.text ? { text: o.text } : {}), mood: o.mood ?? 'neutral', durationMs: o.d ?? 1600, gesture: o.gesture ?? false, ...(o.to ? { to: o.to } : {}) });
export const express = (actor: string, t: number, emotion: string, d = 400): Action => ({ t, action: 'express', actor, emotion, durationMs: d });
/** Repeat a pair of poses n times from t (a, b, a, b …), each half `half` ms. */
export function shake(actor: string, t: number, a: Joints, b: Joints, n: number, half: number): Action[] {
  const out: Action[] = [];
  for (let i = 0; i < n; i++) out.push(pose(actor, t + i * 2 * half, a, half), pose(actor, t + (i * 2 + 1) * half, b, half));
  return out;
}
/** A free icon shape (fades in via tween on opacity). */
export const icon = (id: string, name: string, x: number, y: number, size: number, o: { fill?: string; stroke?: string; opacity?: number } = {}) => ({ type: 'icon' as const, id, icon: name, x, y, size, ...o });

export function build(d: Def): SceneInput {
  const lemma = d.sense.replace(/^s\./, '').replace(/\.\d+$/, '');
  const n = d.sense.match(/\.(\d+)$/)![1];
  const durationMs = d.durationMs ?? 3200;
  return {
    schemaVersion: 1, assetsVersion: 1, motionsVersion: 1,
    animationId: `anim.${lemma}.${n}`, kind: 'word', template: 'body', senseId: d.sense,
    titleSv: lemma.replace(/-/g, ' '), meaningHint: d.hint, category: d.category ?? 'action',
    durationMs, loop: d.loop ?? false, holdMs: 400, posterMs: d.posterMs ?? Math.round(durationMs * 0.6),
    canvas: { w: 120, h: 120 }, environment: { id: d.env ?? 'neutral', time: 'day' },
    actors: d.actors ?? [P()], props: d.props ?? [], shapes: d.shapes ?? [], timeline: d.timeline,
    focus: { targets: ['p'], feature: d.feature },
    pedagogy: { quizEligible: d.quiz ?? false, group: d.group, confusableWith: d.confusable ?? [], reviewStatus: 'ai-draft', note: d.note ?? 'Utkast skrivet som data i Swechan (scripts/scenes).' },
    label: { show: 'optional' },
  } as SceneInput;
}
