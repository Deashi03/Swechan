/**
 * Local-first persistence (IndexedDB via Dexie).
 *
 * Schema versioning: each change to stores or record shapes adds a new
 * `db.version(n)` with an `upgrade()` that migrates existing data in place.
 * Never delete or rewrite user progress without an explicit migration.
 * The current version is also written into backups (see backup.ts).
 */
import Dexie, { type Table } from 'dexie';
import type {
  DailySessionRecord, MetaKey, ModuleProgressRecord, ReviewCardRecord, ReviewEventRecord, SavedWordRecord,
} from './types';

export const DB_NAME = 'swechan';
export const DATA_VERSION = 1;

export class SwechanDB extends Dexie {
  meta!: Table<{ key: MetaKey; value: unknown }, MetaKey>;
  cards!: Table<ReviewCardRecord, string>;
  reviewEvents!: Table<ReviewEventRecord, number>;
  moduleProgress!: Table<ModuleProgressRecord, string>;
  dailySessions!: Table<DailySessionRecord, string>;
  savedWords!: Table<SavedWordRecord, string>;

  constructor(name = DB_NAME) {
    super(name);
    this.version(1).stores({
      meta: 'key',
      cards: 'id, senseId, due, dimension, createdDate',
      reviewEvents: '++id, senseId, cardId, date, at',
      moduleProgress: 'moduleId, status, completedDate',
      dailySessions: 'date',
      savedWords: 'senseId, savedAt',
    });
    // Future example:
    // this.version(2).stores({ ... }).upgrade(async (tx) => { /* migrate records */ });
  }
}

let db: SwechanDB | null = null;

export function getDb(): SwechanDB {
  if (!db) db = new SwechanDB();
  return db;
}

/** Tests: give each test a fresh database. */
export async function resetDbForTests(): Promise<SwechanDB> {
  if (db) { db.close(); await Dexie.delete(db.name); }
  db = new SwechanDB(`swechan-test-${Math.random().toString(36).slice(2)}`);
  return db;
}

export const USER_TABLES = ['meta', 'cards', 'reviewEvents', 'moduleProgress', 'dailySessions', 'savedWords'] as const;
export type UserTable = (typeof USER_TABLES)[number];

export async function getMeta<T>(key: MetaKey): Promise<T | undefined> {
  return (await getDb().meta.get(key))?.value as T | undefined;
}
export async function setMeta<T>(key: MetaKey, value: T): Promise<void> {
  await getDb().meta.put({ key, value });
}

/** Ask the browser to keep our storage (reduces risk of eviction on iOS). */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}
