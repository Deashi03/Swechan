/**
 * Backup export/import (versioned JSON).
 *
 * - Export contains all user tables (settings, streak, history, schedules,
 *   saved words, module progress). Content is not exported – it ships with the app.
 * - Import validates the whole file first. Invalid files never touch data.
 * - Before replacing data, a restore point (snapshot of current data) is
 *   stored so the import can be undone.
 * - Older backup versions are migrated forward in `migrateBackup`.
 */
import { z } from 'zod';
import { APP_VERSION } from '../config/appConfig';
import { DATA_VERSION, getDb, USER_TABLES } from './db';

export const BACKUP_FORMAT = 'swechan-backup';

const Card = z.object({
  id: z.string(), senseId: z.string(), dimension: z.enum(['meaning', 'spelling', 'inflection']),
  createdDate: z.string(), createdAt: z.number(), due: z.number(),
  sched: z.object({ algorithm: z.literal('fsrs'), stability: z.number(), difficulty: z.number(), state: z.number(), scheduledDays: z.number(), learningSteps: z.number(), reps: z.number(), lapses: z.number(), lastReview: z.number().optional() }),
  source: z.enum(['module', 'personal']),
});
const Event = z.object({
  id: z.number().optional(), cardId: z.string().optional(), senseId: z.string(), dimension: z.enum(['meaning', 'spelling', 'inflection']),
  exerciseType: z.string(), phase: z.enum(['learn', 'review', 'extra']), correct: z.boolean(), attempts: z.number(),
  rating: z.enum(['again', 'hard', 'good', 'easy']).optional(), at: z.number(), date: z.string(), nextDue: z.number().optional(), confusedWithSenseId: z.string().optional(),
});
const StepStatus = z.enum(['not_started', 'in_progress', 'completed']);
const Progress = z.object({
  moduleId: z.string(), contentVersion: z.number(), status: z.enum(['in_progress', 'completed']), startedAt: z.number(),
  completedAt: z.number().optional(), completedDate: z.string().optional(),
  steps: z.object({ learn: StepStatus, read: StepStatus, converse: StepStatus }),
  learn: z.any().optional(), read: z.any().optional(),
});
const Daily = z.object({
  date: z.string(), reviewTarget: z.number(), reviewPlan: z.array(z.string()), reviewIndex: z.number(),
  reviewCompletedAt: z.number().optional(), noReviewMaterial: z.boolean(), modulesCompleted: z.array(z.string()),
  completedAt: z.number().optional(), extraReviewsDone: z.number(),
});
const Saved = z.object({ senseId: z.string(), savedAt: z.number(), queuedForLearning: z.boolean(), learnedAt: z.number().optional() });
const Meta = z.object({ key: z.string(), value: z.unknown() });

export const BackupSchema = z.object({
  format: z.literal(BACKUP_FORMAT),
  backupVersion: z.number().int().positive(),
  appVersion: z.string(),
  exportedAt: z.string(),
  data: z.object({
    meta: z.array(Meta),
    cards: z.array(Card),
    reviewEvents: z.array(Event),
    moduleProgress: z.array(Progress),
    dailySessions: z.array(Daily),
    savedWords: z.array(Saved),
  }),
});
export type Backup = z.infer<typeof BackupSchema>;

async function snapshot(): Promise<Backup['data']> {
  const db = getDb();
  const [meta, cards, reviewEvents, moduleProgress, dailySessions, savedWords] = await Promise.all([
    db.meta.toArray(), db.cards.toArray(), db.reviewEvents.toArray(), db.moduleProgress.toArray(), db.dailySessions.toArray(), db.savedWords.toArray(),
  ]);
  // Never nest old restore points inside backups.
  return { meta: meta.filter((m) => m.key !== 'restorePoint'), cards, reviewEvents, moduleProgress, dailySessions, savedWords } as Backup['data'];
}

export async function exportBackup(at = new Date()): Promise<Backup> {
  return { format: BACKUP_FORMAT, backupVersion: DATA_VERSION, appVersion: APP_VERSION, exportedAt: at.toISOString(), data: await snapshot() };
}

/** Migrate an older backup to the current DATA_VERSION. */
export function migrateBackup(raw: unknown): unknown {
  const b = raw as { backupVersion?: number };
  if (typeof b?.backupVersion === 'number' && b.backupVersion > DATA_VERSION)
    throw new Error('Säkerhetskopian kommer från en nyare version av Swechan. Uppdatera appen först.');
  // v1 is the first format – future migrations go here, e.g. if (b.backupVersion === 1) { ...; b.backupVersion = 2 }
  return raw;
}

export type ImportResult = { ok: true; counts: Record<string, number> } | { ok: false; error: string };

async function replaceAll(data: Backup['data'], restorePoint?: Backup['data']) {
  const db = getDb();
  await db.transaction('rw', USER_TABLES.map((t) => db.table(t)), async () => {
    for (const t of USER_TABLES) await db.table(t).clear();
    await db.meta.bulkPut(data.meta as { key: never; value: unknown }[]);
    await db.cards.bulkPut(data.cards);
    await db.reviewEvents.bulkPut(data.reviewEvents);
    await db.moduleProgress.bulkPut(data.moduleProgress as never[]);
    await db.dailySessions.bulkPut(data.dailySessions);
    await db.savedWords.bulkPut(data.savedWords);
    if (restorePoint) await db.meta.put({ key: 'restorePoint', value: { createdAt: Date.now(), data: restorePoint } });
  });
}

export async function importBackup(text: string): Promise<ImportResult> {
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { return { ok: false, error: 'Filen är inte giltig JSON.' }; }
  let migrated: unknown;
  try { migrated = migrateBackup(parsed); } catch (e) { return { ok: false, error: (e as Error).message }; }
  const res = BackupSchema.safeParse(migrated);
  if (!res.success) return { ok: false, error: 'Filen är inte en giltig Swechan-säkerhetskopia.' };
  const current = await snapshot();
  try {
    await replaceAll(res.data.data, current);
  } catch (e) {
    return { ok: false, error: `Importen misslyckades och inget ändrades: ${(e as Error).message}` };
  }
  const d = res.data.data;
  return { ok: true, counts: { cards: d.cards.length, reviewEvents: d.reviewEvents.length, modules: d.moduleProgress.length, savedWords: d.savedWords.length } };
}

export async function hasRestorePoint(): Promise<number | null> {
  const rp = (await getDb().meta.get('restorePoint'))?.value as { createdAt: number } | undefined;
  return rp?.createdAt ?? null;
}

export async function undoLastImport(): Promise<boolean> {
  const rp = (await getDb().meta.get('restorePoint'))?.value as { data: Backup['data'] } | undefined;
  if (!rp) return false;
  await replaceAll(rp.data);
  return true;
}

export function downloadJson(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 1)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
