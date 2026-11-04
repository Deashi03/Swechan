import { getContent } from '../content/repository';
import { knowledgeLevel, type KnowledgeLevel } from '../learning/knowledge';
import { getDb } from '../storage/db';
import type { ReviewCardRecord, ReviewEventRecord } from '../storage/types';

export type Stats = {
  levels: Record<KnowledgeLevel, number>;
  modulesCompleted: number;
  reviewsDone: number;
  /** Cumulative introduced words per date (for the progress chart). */
  timeline: { date: string; introduced: number }[];
};

export function groupBySense<T extends { senseId: string }>(rows: T[]): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const r of rows) m.set(r.senseId, [...(m.get(r.senseId) ?? []), r]);
  return m;
}

export async function computeStats(): Promise<Stats> {
  const db = getDb();
  const [cards, events, progress] = await Promise.all([db.cards.toArray(), db.reviewEvents.toArray(), db.moduleProgress.toArray()]);
  return statsFrom(cards, events, progress.filter((p) => p.status === 'completed').length);
}

export function statsFrom(cards: ReviewCardRecord[], events: ReviewEventRecord[], modulesCompleted: number): Stats {
  const repo = getContent();
  const cBy = groupBySense(cards);
  const eBy = groupBySense(events);
  const senses = new Set([...cBy.keys(), ...eBy.keys()].filter((id) => repo.getSense(id)));
  const levels: Record<KnowledgeLevel, number> = { introduced: 0, understood: 0, active: 0, consolidated: 0 };
  // Cumulative counts: an "active" word is also understood and introduced.
  for (const id of senses) {
    const lv = knowledgeLevel(cBy.get(id) ?? [], eBy.get(id) ?? []);
    if (!lv) continue;
    levels.introduced++;
    if (lv !== 'introduced') levels.understood++;
    if (lv === 'active' || lv === 'consolidated') levels.active++;
    if (lv === 'consolidated') levels.consolidated++;
  }
  const firstSeen = new Map<string, string>();
  for (const e of [...events].sort((a, b) => a.at - b.at)) if (!firstSeen.has(e.senseId)) firstSeen.set(e.senseId, e.date);
  const perDate = new Map<string, number>();
  for (const d of firstSeen.values()) perDate.set(d, (perDate.get(d) ?? 0) + 1);
  let acc = 0;
  const timeline = [...perDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, n]) => ({ date, introduced: (acc += n) }));
  return { levels, modulesCompleted, reviewsDone: events.filter((e) => e.phase !== 'learn').length, timeline };
}
