/**
 * Content report (0.4 phase E) – `npm run content:report`. A Markdown overview
 * of what exists, what is broken and what still needs human work.
 */
import type { CatalogIndex } from '../catalog/catalogIndex';
import { validateCatalog } from '../catalog/validateCatalog';
import type { ContentRepository } from '../repository';
import { visualCoverage } from '../visualPlan';
import { validateContent } from '../validateContent';
import { checkVocabulary, type CoreVocabulary } from '../vocabularyCheck';

export type ContentReport = {
  publishedModules: number;
  plannedModules: number;
  catalogLinks: number;
  compatibilityPlacements: number;
  entries: number;
  senses: number;
  sensesReviewed: number;
  sensesAiDraft: number;
  catalogTitlesJa: { categories: number; modules: number; totalCategories: number; totalModules: number };
  brokenReferences: string[];
  unintroducedWords: string[];
  duplicateLemmas: string[];
  catalogIssues: string[];
  markdown: string;
};

export function buildContentReport(repo: ContentRepository, core: CoreVocabulary, catalog: CatalogIndex): ContentReport {
  const senses = repo.entries.flatMap((e) => e.senses);
  const lemmaCount = new Map<string, number>();
  for (const e of repo.entries) lemmaCount.set(`${e.lemma}|${e.pos}`, (lemmaCount.get(`${e.lemma}|${e.pos}`) ?? 0) + 1);
  const duplicateLemmas = [...lemmaCount].filter(([, n]) => n > 1).map(([k]) => k.replace('|', ' (') + ')');
  const brokenReferences = validateContent(repo).map((i) => `${i.where}: ${i.message}`);
  const unintroducedWords = checkVocabulary(repo, core).map((i) => `${i.where}: [${i.unknown.join(', ')}]`);
  const catalogIssues = validateCatalog(catalog, repo.modules.map((m) => m.id)).map((i) => `${i.where}: ${i.message}`);
  const tr = catalog.translationStatus();
  const moduleSenses = [...new Set(repo.modules.flatMap((m) => m.words.map((w) => w.senseId)))];
  const vis = visualCoverage(moduleSenses);
  const r = {
    publishedModules: repo.modules.length,
    plannedModules: catalog.modules.filter((m) => m.status === 'planned' && !catalog.publishedModuleFor(m.catalogId)).length,
    catalogLinks: catalog.mapping.links.length,
    compatibilityPlacements: catalog.mapping.compatibilityPlacements.length,
    entries: repo.entries.length,
    senses: senses.length,
    sensesReviewed: senses.filter((s) => s.quality.status === 'reviewed').length,
    sensesAiDraft: senses.filter((s) => s.quality.status === 'ai-draft').length,
    catalogTitlesJa: { categories: tr.categoriesWithJa, modules: tr.modulesWithJa, totalCategories: catalog.categories.length, totalModules: catalog.modules.length },
    brokenReferences, unintroducedWords, duplicateLemmas, catalogIssues,
  };
  const list = (items: string[]) => (items.length ? items.map((i) => `- ${i}`).join('\n') : '- inga');
  const rows = repo.modules.map((m) => {
    const link = catalog.mapping.links.find((l) => l.moduleId === m.id);
    const place = catalog.mapping.compatibilityPlacements.find((p) => p.moduleId === m.id);
    return `| ${m.id} | ${m.titleSv} | ${m.words.length} | v${m.contentVersion} | ${link ? link.catalogId : place ? `placering ${place.catalogCategoryId}` : '**saknas**'} |`;
  });
  const markdown = `# Swechan – innehållsrapport

## Översikt
- Publicerade moduler: **${r.publishedModules}** (verifierade katalogkopplingar: ${r.catalogLinks}, kompatibilitetsplaceringar: ${r.compatibilityPlacements})
- Planerade katalogmoduler som inte är publicerade: **${r.plannedModules}** av ${catalog.modules.length}
- Ordposter: ${r.entries} · betydelser: ${r.senses}
- Granskningsstatus för betydelser: **${r.sensesReviewed} mänskligt granskade**, ${r.sensesAiDraft} AI-utkast
- Visualisering av modulord (0.12): **${vis.produced} av ${vis.total} klara** · plan: animation ${vis.planned.animation}, scen ${vis.planned.scene}, symbol ${vis.planned.symbol}, ingen ${vis.planned.none}${vis.missingPlan ? ` · **${vis.missingPlan} saknar plan**` : ''}
- Japanska katalogtitlar: kategorier ${tr.categoriesWithJa}/${catalog.categories.length}, moduler ${tr.modulesWithJa}/${catalog.modules.length} (saknade titler får inte fabriceras)

## Publicerade moduler
| ID | Titel | Ord | Version | Katalog |
|---|---|---|---|---|
${rows.join('\n')}

## Brutna referenser och schemaproblem
${list(brokenReferences)}

## Ord som inte är introducerade (kontrollerat ordförråd)
${list(unintroducedWords)}

## Dubbletter (samma uppslagsord och ordklass i flera poster)
${list(duplicateLemmas)}

## Katalogproblem
${list(catalogIssues)}
`;
  return { ...r, markdown };
}
