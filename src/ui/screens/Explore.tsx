/**
 * "Kurser" (Explore) – 0.4 phase C.
 *
 * Navigation follows the real planning catalog (CatalogIndex.menuItems):
 * root areas → sub-areas → topic groups → modules, never more than eight
 * choices per screen (the search field is not a choice). Published lessons
 * can be opened and started; planned catalog entries only get an
 * information view without a start button.
 */
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useState } from 'react';
import type { CatalogIndex, MenuItem } from '../../content/catalog/catalogIndex';
import { loadCatalog } from '../../content/catalog/loadCatalog';
import { getContent } from '../../content/repository';
import { getDictionaryIndex } from '../../dictionary/dictionaryService';
import { globalSearch } from '../../dictionary/globalSearch';
import { getDb } from '../../storage/db';
import type { ModuleProgressRecord } from '../../storage/types';
import { href, navigate } from '../app/router';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { useDictionarySheet } from '../dictionary/DictionarySheet';
import { ModuleCard } from './ModuleOverview';
import { Art } from '../art/Art';

/** Results per search section page (search results are a menu → paginate). */
export const SEARCH_PAGE_SIZE = 8;

function useCatalog(): { catalog: CatalogIndex | null; error: boolean; retry: () => void } {
  const [catalog, setCatalog] = useState<CatalogIndex | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    setError(false);
    loadCatalog().then((c) => alive && setCatalog(c)).catch(() => alive && setError(true));
    return () => { alive = false; };
  }, [attempt]);
  return { catalog, error, retry: () => setAttempt((a) => a + 1) };
}

function CatalogLoading({ error, retry }: { error: boolean; retry: () => void }) {
  return error ? (
    <div className="card stack-sm"><p>Kurskatalogen kunde inte laddas.</p><button className="btn secondary small" onClick={retry}>Försök igen</button></div>
  ) : <p className="muted">Laddar kurser…</p>;
}

function Crumbs({ catalog, categoryId }: { catalog: CatalogIndex; categoryId: string }) {
  return (
    <nav className="crumbs" aria-label="Var du är">
      <a href={href({ name: 'explore' })}>Kurser</a>
      {catalog.path(categoryId).map((c) => <span key={c.catalogCategoryId}>› <a href={href({ name: 'explore', categoryId: c.catalogCategoryId })}>{c.titleSv}</a></span>)}
    </nav>
  );
}

function CountLine({ planned, published }: { planned: number; published: number }) {
  return (
    <span className="xsmall muted">
      {published > 0 && <span style={{ color: 'var(--c-success)', fontWeight: 700 }}>{published} klar{published === 1 ? '' : 'a'} att studera · </span>}
      {planned} planerade
    </span>
  );
}

function MenuRow({ item, progress }: { item: MenuItem; progress: Map<string, ModuleProgressRecord> }) {
  if (item.kind === 'category') {
    return (
      <li>
        <a className="list-item" href={href({ name: 'explore', categoryId: item.id })}>
          <Art id={item.id} size={item.id.length === 3 ? 52 : 40} />
          <span className="grow"><strong>{item.titleSv}</strong><br /><CountLine planned={item.plannedCount} published={item.publishedCount} /></span>
          <Icon name="chevron" size={18} />
        </a>
      </li>
    );
  }
  if (item.kind === 'published') {
    const m = getContent().getModule(item.id);
    if (!m) return null;
    return <li style={{ padding: '8px 0' }}><ModuleCard m={m} progress={progress.get(m.id)} /></li>;
  }
  return (
    <li>
      <a className="list-item" href={href({ name: 'catalogModule', id: item.id })} aria-label={`${item.titleSv} – planerad, inte klar än`}>
        <Art id={item.id} size={40} />
        <span className="grow"><span className="muted">{item.titleSv}</span></span>
        <span className="badge">Planerad</span>
      </a>
    </li>
  );
}

export function Explore({ categoryId }: { categoryId?: string }) {
  const { catalog, error, retry } = useCatalog();
  const [q, setQ] = useState('');
  const progress = useLiveQuery(async () => new Map((await getDb().moduleProgress.toArray()).map((p) => [p.moduleId, p])), [], new Map());
  const validCategory = catalog && categoryId && catalog.getCategory(categoryId) ? categoryId : null;
  const cat = validCategory ? catalog!.getCategory(validCategory) : undefined;
  const items = catalog ? catalog.menuItems(validCategory) : [];

  return (
    <div className="stack">
      <h1>{cat ? cat.titleSv : 'Kurser'}</h1>
      <input className="input search" type="search" placeholder="Sök moduler, ämnen och ord" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Global sökning" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
      {q.trim() ? <SearchResults query={q} catalog={catalog} /> : !catalog ? <CatalogLoading error={error} retry={retry} /> : (
        <>
          {cat && <Crumbs catalog={catalog} categoryId={cat.catalogCategoryId} />}
          {!cat && <p className="small muted">Välj ett område. Moduler märkta <span className="badge">Planerad</span> finns i kursplanen men är inte färdiga än.</p>}
          <ul className="list card" style={{ padding: '0 16px' }} aria-label="Val">
            {items.map((it) => <MenuRow key={`${it.kind}:${it.id}`} item={it} progress={progress} />)}
          </ul>
        </>
      )}
    </div>
  );
}

type Section = { key: string; title: string; rows: { key: string; node: React.ReactNode }[] };

function SearchResults({ query, catalog }: { query: string; catalog: CatalogIndex | null }) {
  const repo = getContent();
  const dict = useDictionarySheet();
  const [pages, setPages] = useState<Record<string, number>>({});
  useEffect(() => setPages({}), [query]);
  const sections = useMemo<Section[]>(() => {
    const local = globalSearch(query, repo, getDictionaryIndex());
    const published: Section = { key: 'published', title: 'Moduler att studera', rows: local.filter((r) => r.type === 'module').map((r) => {
      const m = repo.getModule(r.type === 'module' ? r.id : '')!;
      return { key: m.id, node: <a className="list-item" href={href({ name: 'module', id: m.id })}><span className="grow"><strong>{m.titleSv}</strong><br /><Ja text={m.titleJa} className="small muted" /></span><span className="badge" style={{ color: 'var(--c-success)' }}>klar</span></a> };
    }) };
    const catHits = catalog ? catalog.search(query, 400) : [];
    const areas: Section = { key: 'areas', title: 'Ämnen', rows: catHits.filter((h) => h.kind === 'category').map((h) => ({ key: h.id, node: <a className="list-item" href={href({ name: 'explore', categoryId: h.id })}><span className="grow"><strong>{h.titleSv}</strong><br /><span className="xsmall muted">{catalog!.path(h.id).slice(0, -1).map((c) => c.titleSv).join(' › ') || 'Område'}</span></span><Icon name="chevron" size={18} /></a> })) };
    const planned: Section = { key: 'planned', title: 'Planerade moduler', rows: catHits.filter((h) => h.kind === 'planned').map((h) => ({ key: h.id, node: <a className="list-item" href={href({ name: 'catalogModule', id: h.id })}><span className="grow">{h.titleSv}</span><span className="badge">Planerad</span></a> })) };
    const seen = new Set<string>();
    const words: Section = { key: 'words', title: 'Ord', rows: local.filter((r) => r.type === 'word').flatMap((r) => {
      if (r.type !== 'word' || seen.has(r.hit.entryId)) return [];
      seen.add(r.hit.entryId);
      const e = repo.getEntry(r.hit.entryId)!;
      const s = (r.hit.senseId && repo.getSense(r.hit.senseId)?.sense) || e.senses[0]!;
      return [{ key: e.id, node: <button className="list-item" onClick={() => dict.open({ entryId: e.id, senseId: r.hit.senseId })}><span className="grow"><strong lang="sv">{e.lemma}</strong> <Ja text={s.ja} className="small muted" /></span><span className="badge">ord</span></button> }];
    }) };
    return [published, words, areas, planned].filter((s) => s.rows.length > 0);
  }, [query, catalog, repo, dict]);

  if (!sections.length) return <p className="muted small">{catalog ? 'Inga träffar.' : 'Söker…'}</p>;
  return (
    <div className="stack-sm">
      {sections.map((s) => {
        const page = pages[s.key] ?? 0;
        const pageCount = Math.ceil(s.rows.length / SEARCH_PAGE_SIZE);
        const visible = s.rows.slice(page * SEARCH_PAGE_SIZE, (page + 1) * SEARCH_PAGE_SIZE);
        return (
          <section key={s.key} aria-label={s.title}>
            <div className="section-title">{s.title} ({s.rows.length})</div>
            <ul className="list card" style={{ padding: '0 16px' }}>{visible.map((r) => <li key={r.key}>{r.node}</li>)}</ul>
            {pageCount > 1 && (
              <div className="row between small" style={{ marginTop: 6 }}>
                <button className="btn ghost small" disabled={page === 0} onClick={() => setPages((p) => ({ ...p, [s.key]: page - 1 }))}>‹ Föregående</button>
                <span className="muted">Sida {page + 1} av {pageCount}</span>
                <button className="btn ghost small" disabled={page >= pageCount - 1} onClick={() => setPages((p) => ({ ...p, [s.key]: page + 1 }))}>Nästa ›</button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

/** Information view for a planned catalog entry. Deliberately NO start button. */
export function CatalogModuleView({ id }: { id: string }) {
  const { catalog, error, retry } = useCatalog();
  if (!catalog) return <CatalogLoading error={error} retry={retry} />;
  const m = catalog.getModule(id);
  if (!m) return <div className="stack"><p>Modulen finns inte i kursplanen.</p><a className="btn secondary" href={href({ name: 'explore' })}>Till Kurser</a></div>;
  const linked = catalog.publishedModuleFor(id);
  if (linked && catalog.isStartable(linked)) { navigate({ name: 'module', id: linked }, { replace: true }); return null; }
  const overlaps = catalog.mapping.compatibilityPlacements.filter((p) => p.overlapsCatalogIds.includes(id)).map((p) => getContent().getModule(p.moduleId)).filter((x) => !!x);
  return (
    <div className="stack">
      <Crumbs catalog={catalog} categoryId={m.catalogCategoryId} />
      <header>
        <h1>{m.titleSv}</h1>
        <div className="row wrap" style={{ gap: 6 }}><span className="badge">Planerad</span><span className="badge">ca {m.targetWordCount} ord</span></div>
      </header>
      <div className="card tint-warning stack-sm small">
        <strong>Den här modulen är inte färdig än.</strong>
        <div>Den finns i kursplanen, men orden, texten och övningarna är inte skrivna. Den kan därför inte startas ännu.</div>
        <Ja as="div" className="xsmall muted" text="このモジュールはまだ{準備中|じゅんびちゅう}です。" />
      </div>
      {overlaps.length > 0 && (
        <section className="stack-sm">
          <div className="section-title">Närliggande moduler som redan finns</div>
          {overlaps.map((pm) => <ModuleCard key={pm!.id} m={pm!} />)}
        </section>
      )}
    </div>
  );
}
