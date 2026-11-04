/**
 * Short optional placement test. Gives a rough vocabulary band to recommend
 * modules, choose the conversation level and shorten introductions of very
 * easy words. It is NOT a validated or official CEFR assessment.
 */
import { LEVELS, type Level, type PlacementItem } from '../content/schema';
import type { PlacementResult } from '../storage/types';

export function scorePlacement(items: PlacementItem[], correctIds: Set<string>, now: number): PlacementResult {
  const perLevel: PlacementResult['perLevel'] = {};
  for (const it of items) {
    const p = perLevel[it.level] ?? { correct: 0, total: 0 };
    p.total += 1;
    if (correctIds.has(it.id)) p.correct += 1;
    perLevel[it.level] = p;
  }
  // Highest level in an unbroken run from the bottom where ≥ 2/3 were correct.
  let estimated: Level | null = null;
  for (const lv of LEVELS) {
    const p = perLevel[lv];
    if (!p) continue;
    if (p.correct / p.total >= 2 / 3) estimated = lv;
    else break;
  }
  return { takenAt: now, skipped: false, estimatedLevel: estimated, perLevel };
}

export function levelIndex(l: Level | null | undefined): number {
  return l ? LEVELS.indexOf(l) : -1;
}

/** Introductions are shortened for words at least two levels below the estimate. */
export function isWellBelowLevel(wordLevel: Level, estimated: Level | null | undefined): boolean {
  return levelIndex(estimated) - levelIndex(wordLevel) >= 2;
}
