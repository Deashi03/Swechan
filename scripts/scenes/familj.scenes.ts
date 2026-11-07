/** Relationer & familj (0.14): scenes for verbs about family life. */
import { P, face, icon, pose, say, shake, tween, type Def } from './kit';

const kid = (o: Parameters<typeof P>[0]) => P({ ...o });

export const FAMILJ: Def[] = [
  { sense: 's.växa-upp.1', group: 'familj', feature: 'a child grows into an adult while years pass', durationMs: 3600, posterMs: 2400,
    actors: [P({ x: 56, top: 'yellow' })], shapes: [{ ...icon('a', 'arrow-up', 96, 40, 22, { fill: '#4f9d69' }), opacity: 0 }, { type: 'rect', id: 'm', x: 84, y: 14, w: 6, h: 90, rx: 2, fill: '#fff6d8', stroke: '#2b2a33', sw: 1.4 }],
    timeline: [tween('p', 'scale', 0, 0.55, 1, 0.55), tween('p', 'scale', 400, 1, 2400), tween('a', 'opacity', 600, 1, 400), face('p', 0, { mouth: 'smile' }), face('p', 2600, { eyes: 'open', brows: 'up', mouth: 'smile' })] },
  { sense: 's.flytta-hemifrån.1', group: 'familj', feature: 'a young person carries a box out of the door, waves goodbye', durationMs: 3600, env: 'room',
    actors: [P({ x: 34, top: 'purple' })], props: [{ id: 'd', asset: 'door', at: { x: 24, y: 100 }, state: { angle: 1 } }, { id: 'b', asset: 'box', attachTo: { actor: 'p', hand: 'right' } }],
    timeline: [pose('p', 0, { uArmR: 40, fArmR: 60, uArmL: 34, fArmL: 60 }, 1), { t: 200, action: 'walk', actor: 'p', to: { x: 90, y: 104 }, durationMs: 2200 }, { t: 2500, action: 'turn', actor: 'p', facing: 'left' }, pose('p', 2600, { uArmL: -150, fArmL: 20 }, 300), face('p', 2600, { eyes: 'open', brows: 'up', mouth: 'smile' })] },
  { sense: 's.bråka.1', group: 'syskon', feature: 'two children pull a ball back and forth, angry faces', durationMs: 3200, posterMs: 1500,
    actors: [kid({ x: 40, top: 'teal' }), kid({ id: 'q', x: 80, facing: 'left', variant: 'b', top: 'pink', hairStyle: 'long' })], props: [{ id: 'b', asset: 'ball', at: { x: 60, y: 66 }, scale: 0.9 }],
    timeline: [pose('p', 200, { uArmR: 80, fArmR: 10 }, 300), pose('q', 200, { uArmR: 80, fArmR: 10 }, 300), face('p', 300, { eyes: 'open', brows: 'down', mouth: 'frown' }), face('q', 300, { eyes: 'open', brows: 'down', mouth: 'open' }),
      ...[0, 1, 2, 3].flatMap((i) => [tween('b', 'x', 500 + i * 600, i % 2 ? 64 : 56, 300), tween('p', 'x', 500 + i * 600, i % 2 ? 42 : 38, 300), tween('q', 'x', 500 + i * 600, i % 2 ? 82 : 78, 300)]), say('q', 1000, { icon: 'exclaim', mood: 'angry', d: 1400 })] },
  { sense: 's.reta.1', group: 'syskon', feature: 'one child points and laughs, the other is sad and angry', durationMs: 3000, posterMs: 1800,
    actors: [kid({ x: 40, top: 'teal' }), kid({ id: 'q', x: 80, facing: 'left', variant: 'b', top: 'pink', hairStyle: 'long' })],
    timeline: [pose('p', 300, { uArmR: 80, fArmR: 0 }, 300), face('p', 300, { eyes: 'closed', brows: 'up', mouth: 'open' }), ...shake('p', 600, { torso: -6 }, { torso: 2 }, 4, 180),
      say('p', 700, { text: 'ha ha!', mood: 'happy', d: 1600 }), face('q', 900, { eyes: 'half', brows: 'worried', mouth: 'frown' }), pose('q', 900, { head: 10, uArmR: 30, fArmR: 125, uArmL: 40, fArmL: 120 }, 500)] },
];
