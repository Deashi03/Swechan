import 'fake-indexeddb/auto';
import '@testing-library/jest-dom/vitest';

// jsdom does not implement scrolling APIs
window.scrollTo = (() => {}) as typeof window.scrollTo;
Element.prototype.scrollIntoView = function scrollIntoView() {};

// Content-wide tests (module:validate, content:report, vocabulary check) run synchronously for tens of seconds
// back to back. Between tests the runner only awaits microtasks, so the worker never handles the main process's
// RPC replies and vitest fails the run with "Timeout calling onTaskUpdate" although every test passed (CI, 0.41–0.42).
// Yield one macrotask after each test so those replies are processed. The real setTimeout is captured here,
// before any test installs fake timers.
const realSetTimeout = globalThis.setTimeout;
afterEach(() => new Promise<void>((resolve) => realSetTimeout(resolve, 0)));
