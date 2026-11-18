/**
 * Ordered background saving (kvalitetsplanen A3). A session shows the next card at once and saves
 * the previous answer in the background. Saves run strictly one after another in the order they
 * were queued, a failed save does not stop the ones after it, and `flush()` waits for everything
 * queued so far (used before leaving a session).
 */
export type SaveQueue = {
  push: (task: () => Promise<unknown>) => Promise<void>;
  flush: () => Promise<void>;
  /** Errors from failed saves since the last call (oldest first). */
  takeErrors: () => unknown[];
};

export function createSaveQueue(onError: (e: unknown) => void = (e) => console.error('Kunde inte spara', e)): SaveQueue {
  let tail: Promise<void> = Promise.resolve();
  let errors: unknown[] = [];
  return {
    push(task) {
      tail = tail.then(task).then(() => undefined, (e) => { errors.push(e); onError(e); });
      return tail;
    },
    flush: () => tail,
    takeErrors() { const e = errors; errors = []; return e; },
  };
}
