/**
 * End-to-end acceptance test (spec §26) in Chromium with iPhone emulation.
 *
 *   npm run build && npm run e2e
 *
 * Uses the globally installed `playwright` package (not a project dependency).
 * Starts `vite preview`, simulates a new user over two days with Playwright's
 * fake clock, and asserts the main flow works and persists.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(`${process.env.NODE_PATH ?? '/opt/node22/lib/node_modules'}/playwright`); }
const { chromium, devices } = playwright;

const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
const SHOTS = process.env.E2E_SHOTS; // optional screenshot directory
const log = (...a) => console.log('•', ...a);
function assert(cond, msg) { if (!cond) throw new Error(`ASSERTION FAILED: ${msg}`); log('ok –', msg); }
/** Wait until a locator is visible (default 8 s). */
const visible = (loc, timeout = 8000) => loc.first().waitFor({ state: 'visible', timeout }).then(() => true, () => false);

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
await new Promise((resolve, reject) => {
  server.stdout.on('data', (d) => { if (String(d).includes(String(PORT))) resolve(); });
  server.on('exit', (c) => reject(new Error(`preview exited ${c}`)));
  setTimeout(() => reject(new Error('preview timeout')), 20000);
});

const browser = await chromium.launch();
const context = await browser.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1, locale: 'sv-SE', timezoneId: 'Europe/Stockholm', acceptDownloads: true });
await context.grantPermissions(['clipboard-read', 'clipboard-write']);
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.clock.install({ time: new Date('2026-11-02T09:00:00+01:00') });
const shot = async (name) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false }); };
const click = (text, opts = {}) => page.getByRole('button', { name: text, exact: opts.exact ?? false }).first().click();

/** Answer step-1 / review exercises until `doneText` is visible. Answers some correctly via the revealed answer. */
async function runExercises(doneText, { dictCheckAt = -1 } = {}) {
  for (let i = 0; i < 400; i++) {
    if (await page.getByText(doneText).first().isVisible().catch(() => false)) return i;
    if (i >= dictCheckAt && dictCheckAt >= 0 && await page.getByRole('button', { name: 'Jag vet inte' }).isVisible().catch(() => false) && !(await page.locator('.option.wrong, .option.correct').count())) {
      dictCheckAt = -1;
      const before = await page.locator('main').innerText();
      await page.getByRole('button', { name: 'Öppna ordboken' }).click();
      await page.getByRole('dialog').getByLabel('Sök i ordboken').fill('belägrade');
      await page.getByRole('dialog').getByRole('button', { name: /belägra/ }).first().click();
      assert(await visible(page.getByRole('dialog').getByText('Böjning')), 'dictionary sheet opens during an exercise and finds an inflected form');
      await page.getByRole('button', { name: 'Stäng' }).click();
      assert((await page.locator('main').innerText()) === before, 'exercise state is unchanged after closing the dictionary');
    }
    const btn = (name) => page.getByRole('button', { name, exact: true }).first();
    const tryClick = (loc) => loc.click({ timeout: 1500 }).then(() => true, () => false);
    if (await btn('Jag förstår – nästa').isVisible().catch(() => false)) { await tryClick(btn('Jag förstår – nästa')); continue; }
    if (await btn('Jag vet inte').isVisible().catch(() => false)) {
      // choice exercise: pick the first option; after two wrong picks the answer is revealed
      await tryClick(page.locator('.option:not([disabled])').first());
      await page.waitForTimeout(60);
      if (await page.locator('.option.correct').count()) {
        await page.waitForTimeout(30); // result sheet appears; continue below
        await page.waitForTimeout(60);
        if (await btn('Fortsätt').isVisible().catch(() => false)) await tryClick(btn('Fortsätt'));
        continue;
      }
      if (await page.locator('.option:not([disabled])').count()) await tryClick(page.locator('.option:not([disabled])').first());
      await page.waitForTimeout(60);
      if (await btn('Fortsätt').isVisible().catch(() => false)) await tryClick(btn('Fortsätt'));
      continue;
    }
    if (await btn('Visa svaret').isVisible().catch(() => false)) {
      // typed exercise: one wrong attempt (hint shown), then reveal
      await page.getByLabel('Ditt svar').fill('xyz').catch(() => {});
      await tryClick(btn('Kontrollera'));
      if (await btn('Visa svaret').isVisible().catch(() => false)) await tryClick(btn('Visa svaret'));
      await tryClick(btn('Fortsätt'));
      continue;
    }
    if (await btn('Fortsätt').isVisible().catch(() => false)) { await tryClick(btn('Fortsätt')); continue; }
    await page.waitForTimeout(100);
  }
  throw new Error(`never reached "${doneText}"`);
}

async function doModule(moduleTitleRe, { checks = false, promptIncludes = null } = {}) {
  // Step 1
  // Home's primary button goes straight into the next step; from a module page, start step 1.
  const startBtn = page.getByRole('button', { name: /Starta: Lär dig orden|Fortsätt: Lär dig orden/ });
  if (await startBtn.isVisible().catch(() => false)) await startBtn.click();
  const n = await runExercises('Bra jobbat!', { dictCheckAt: checks ? 8 : -1 });
  log(`step 1 finished after ${n} interactions`);
  await click('Vidare till läsningen');
  // Step 2
  await page.getByRole('heading', { level: 1 }).first().waitFor();
  if (checks) {
    await shot('03-reading');
    await page.locator('.word-link.target').last().click();
    const y = await page.evaluate(() => window.scrollY);
    assert(await visible(page.getByRole('dialog')), 'tapping a word in the text opens the dictionary sheet');
    await shot('04-reading-lookup');
    await page.getByRole('button', { name: 'Stäng' }).click();
    const y2 = await page.evaluate(() => window.scrollY);
    assert(y > 0 && Math.abs(y2 - y) < 5, `reading position is preserved after closing the sheet (${y} → ${y2})`);
  }
  await click('Jag har läst texten');
  for (let i = 0; i < 60; i++) {
    if (await page.getByRole('button', { name: 'Klar med läsningen' }).isVisible().catch(() => false)) break;
    const opt = page.locator('.option:not([disabled])').first();
    if (await opt.isVisible().catch(() => false)) { await opt.click({ timeout: 1500 }).catch(() => {}); continue; }
    const cont = page.getByRole('button', { name: 'Fortsätt', exact: true });
    if (await cont.isVisible().catch(() => false)) { await cont.click({ timeout: 1500 }).catch(() => {}); continue; }
    await page.waitForTimeout(100);
  }
  await click('Klar med läsningen');
  await click('Vidare till samtalet');
  // Step 3
  await click('Kopiera samtalsprompt');
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  if (checks) {
    assert(clip.includes('Du är min svenska samtalspartner') && clip.includes('- städa – 掃除（そうじ）する'), 'conversation prompt copied with target words');
    await shot('05-converse');
  }
  if (promptIncludes) assert(clip.includes(promptIncludes), `conversation prompt contains "${promptIncludes}"`);
  await click('Jag har genomfört samtalet');
  assert(await visible(page.getByText('Modulen är klar!')), `module completed (${moduleTitleRe})`);
  await click('Till startsidan');
}

try {
  // 1–2: first launch, placement test (skip-able) ------------------------
  await page.goto(BASE);
  await page.getByText('Välkommen till Swechan!').waitFor();
  await shot('01-welcome');
  await click('Gör ett kort nivåtest');
  await click('Starta testet');
  for (let i = 0; i < 15; i++) await click('Vet inte', { exact: true });
  assert(await visible(page.getByText('inte en officiell eller validerad CEFR-bedömning')), 'placement result shown with honest disclaimer');
  await click('Till Swechan');

  // Skipping onboarding must also work (regression: 0.1 bounced back to welcome)
  {
    const p2 = await context.browser().newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1 }).then((c) => c.newPage());
    await p2.goto(BASE);
    await p2.getByRole('button', { name: 'Hoppa över' }).click();
    assert(await visible(p2.getByText('DAGENS PASS', { exact: true })), '"Hoppa över" on the welcome screen leads to the home screen');
    await p2.context().close();
  }

  // 3–4: home with streak + two tasks ------------------------------------
  await page.getByText('DAGENS PASS', { exact: true }).waitFor();
  assert(await visible(page.getByText('Inga tidigare ord ännu')), 'day 1: no review material → review counts as done');
  assert(await visible(page.getByLabel(/Streak: 0 dagar/)), 'streak starts at 0');
  await shot('02-home-day1');

  // 5–15: complete module A ------------------------------------------------
  await click('Starta dagens modul');
  await doModule('Hemmet', { checks: true });

  // 18–19: day completed, streak updated ------------------------------------
  assert(await visible(page.getByText('Klart för idag!')), 'daily session completed');
  assert(await visible(page.getByLabel(/Streak: 1 dag$/)), 'streak is 1 after day 1');
  await shot('06-home-day1-done');

  // 21: persists after closing the app --------------------------------------
  await page.reload();
  await page.getByText('DAGENS PASS', { exact: true }).waitFor();
  assert(await visible(page.getByLabel(/Streak: 1 dag$/)), 'progress survives reload');

  // 20: next day – review earlier words + new module --------------------------
  await page.clock.setSystemTime(new Date('2026-11-03T08:30:00+01:00'));
  await page.reload();
  assert(await visible(page.getByText('0 av 25 ord')), 'day 2: 25 review tasks from yesterday\'s words');
  await shot('07-home-day2');
  await click('Starta dagens pass');
  await runExercises('Dagens repetition är klar!');
  await shot('08-review-done');
  await click('Till startsidan');
  assert(await visible(page.getByText('1 del kvar')), 'only module left on day 2');
  await click('Starta dagens modul');
  await doModule('Material');
  assert(await visible(page.getByLabel(/Streak: 2 dagar/)), 'streak is 2 after day 2');

  // Explore + dictionary tabs -------------------------------------------------
  await page.getByRole('link', { name: 'Kurser' }).click();
  await page.getByLabel('Global sökning').fill('分子');
  assert(await visible(page.getByText('molekyl', { exact: true })), 'global search finds Swedish word from Japanese kanji');
  await page.getByRole('link', { name: 'Ordbok' }).click();
  await page.getByLabel('Sök i ordboken').fill('molekylerna');
  assert(await visible(page.getByRole('button', { name: /molekyl/ }).first()), 'dictionary finds lemma from inflected form');
  await shot('09-dictionary');

  // 22: export -----------------------------------------------------------------
  await page.goto(`${BASE}#/settings`);
  const [dl] = await Promise.all([page.waitForEvent('download'), click('Exportera progression')]);
  const file = await dl.path();
  const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert(backup.format === 'swechan-backup' && backup.data.cards.length > 40 && backup.data.dailySessions.length === 2, 'export contains progress');

  // 0.4 phase F: the new prerequisite chain, reached through the catalog menu ------------
  await page.clock.setSystemTime(new Date('2026-11-04T08:30:00+01:00'));
  await page.goto(`${BASE}#/explore`);
  await page.getByRole('link', { name: /Vardag & hem/ }).first().click();
  await page.getByRole('link', { name: /Mat & måltider/ }).first().click();
  await page.getByRole('link', { name: /Matlagningens verb/ }).first().click();
  assert(await visible(page.getByRole('link', { name: /Skära och hacka/ })), 'catalog menu shows the published module in its topic group');
  assert((await page.locator('main a.list-item').count()) <= 8, 'topic group menu has at most 8 choices');
  // Vardag & hem is fully published from 0.8, Kroppen & sinnena from 0.9, Hälsa & sjukvård
  // from 0.10 and Känslor & psykologi from 0.11; Relationer & familj is partly published from 0.14,
  // so the planned entry is Föräldraskap & barn → Graviditet och födsel.
  await page.goto(`${BASE}#/explore`);
  await page.getByRole('link', { name: /Människan & hälsa/ }).first().click();
  await page.getByRole('link', { name: /Relationer & familj/ }).first().click();
  await page.getByRole('link', { name: /Föräldraskap & barn/ }).first().click();
  await page.getByRole('link', { name: /Graviditet och födsel/ }).first().click();
  assert(await visible(page.getByText('Planerad').first()), 'planned catalog entry shows its status');
  assert(!(await page.getByRole('button', { name: /Starta/ }).isVisible().catch(() => false)), 'planned catalog entry has no start button');
  await page.goto(`${BASE}#/explore`);
  await page.getByRole('link', { name: /Vardag & hem/ }).first().click();
  await page.getByRole('link', { name: /Mat & måltider/ }).first().click();
  await page.getByRole('link', { name: /Råvaror & skafferi/ }).first().click();
  await page.getByRole('link', { name: /Vanliga grönsaker/ }).first().click();
  await shot('10-module-gronsaker');
  await page.getByRole('button', { name: /Starta: Lär dig orden/ }).waitFor({ timeout: 15000 }); // CI is slower than local runs
  await doModule('Vanliga grönsaker', { promptIncludes: '- potatis – じゃがいも' });
  await page.goto(`${BASE}#/explore`);
  await page.getByLabel('Global sökning').fill('Skära och hacka');
  await page.getByRole('link', { name: /Skära och hacka/ }).first().click();
  assert(await visible(page.getByRole('button', { name: /Starta: Lär dig orden/ })), 'next module in the chain is found by search and can be started');
  await page.clock.setSystemTime(new Date('2026-11-05T08:30:00+01:00'));
  await page.goto(BASE);
  await page.reload();
  await click('Starta dagens pass');
  await runExercises('Dagens repetition är klar!');
  await page.goto(`${BASE}#/settings`);
  const [dl2] = await Promise.all([page.waitForEvent('download'), click('Exportera progression')]);
  const backup2 = JSON.parse(fs.readFileSync(await dl2.path(), 'utf8'));
  const newCards = backup2.data.cards.filter((c) => ['s.potatis.1', 's.morot.1', 's.skala.1'].includes(c.senseId));
  assert(newCards.length >= 3, `words from the new module became review cards (${newCards.length})`);
  assert(backup2.data.reviewEvents.some((e) => e.date === '2026-11-05'), 'day 4 review completed with events');

  const relevantErrors = errors.filter((e) => !/favicon|speechSynthesis/i.test(e));
  assert(relevantErrors.length === 0, `no console/page errors (${relevantErrors.join(' | ')})`);
  console.log('\nE2E ACCEPTANCE FLOW PASSED');
} catch (e) {
  await shot('zz-failure').catch(() => {});
  console.error(e);
  console.error('page errors:', errors);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.kill('SIGKILL');
  process.exit(process.exitCode ?? 0);
}
