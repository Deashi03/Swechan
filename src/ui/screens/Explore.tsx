import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { getContent } from '../../content/repository';
import { getDictionaryIndex } from '../../dictionary/dictionaryService';
import { globalSearch } from '../../dictionary/globalSearch';
import { recommendedModule } from '../../modules/moduleService';
import { getDb } from '../../storage/db';
import { href, navigate } from '../app/router';
import { Icon } from '../components/Icon';
import { Ja } from '../components/Ja';
import { useDictionarySheet } from '../dictionary/DictionarySheet';
import { ModuleCard } from './ModuleOverview';

export function Explore({ categoryId }: { categoryId?: string }) {
  const repo = getContent();
  const [q, setQ] = useState('');
  const progress = useLiveQuery(async () => new Map((await getDb().moduleProgress.toArray()).map((p) => [p.moduleId, p])), [], new Map());
  const rec = useLiveQuery(() => recommendedModule(), []);
  const dict = useDictionarySheet();
  const results = useMemo(() => (q.trim() ? globalSearch(q, repo, getDictionaryIndex()) : []), [q, repo]);
  const cat = categoryId ? repo.getCategory(categoryId) : undefined;
  const children = repo.childCategories(categoryId ?? null);
  const directModules = categoryId ? repo.modules.filter((m) => m.categoryId === categoryId) : [];

  return (
    <div className="stack">
      <h1>Utforska</h1>
      <div className="row">
        <input className="input search grow" type="search" placeholder="Sök moduler, ämnen och ord" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Global sökning" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
      </div>

      {q.trim() ? (
        <div className="stack-sm">
          {results.length === 0 && <p className="muted small">Inga träffar.</p>}
          {(['module', 'category', 'word'] as const).map((type) => {
            const list = results.filter((r) => r.type === type);
            if (!list.length) return null;
            return (
              <section key={type}>
                <div className="section-title">{type === 'module' ? 'Moduler' : type === 'category' ? 'Ämnen' : 'Ord'}</div>
                <ul className="list">
                  {list.map((r, i) => {
                    if (r.type === 'module') { const m = repo.getModule(r.id)!; return <li key={i}><a className="list-item" href={href({ name: 'module', id: m.id })}><span className="grow"><strong>{m.titleSv}</strong><br /><Ja text={m.titleJa} className="small muted" /></span><span className="badge">modul</span></a></li>; }
                    if (r.type === 'category') { const c = repo.getCategory(r.id)!; return <li key={i}><a className="list-item" href={href({ name: 'explore', categoryId: c.id })}><span className="grow"><strong>{c.nameSv}</strong><br /><Ja text={c.nameJa} className="small muted" /></span><span className="badge">ämne</span></a></li>; }
                    const e = repo.getEntry(r.hit.entryId)!;
                    const s = (r.hit.senseId && repo.getSense(r.hit.senseId)?.sense) || e.senses[0]!;
                    return <li key={i}><button className="list-item" onClick={() => dict.open({ entryId: e.id, senseId: r.hit.senseId })}><span className="grow"><strong lang="sv">{e.lemma}</strong> <Ja text={s.ja} className="small muted" /></span><span className="badge">ord</span></button></li>;
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <>
          {!categoryId && rec && (
            <section>
              <div className="section-title">Rekommenderat för dig</div>
              <ModuleCard m={rec} progress={progress.get(rec.id)} />
            </section>
          )}
          {cat && (
            <nav className="crumbs" aria-label="Kategorier">
              <a href={href({ name: 'explore' })}>Alla ämnen</a>
              {repo.categoryPath(cat.id).map((c) => <span key={c.id}>› <a href={href({ name: 'explore', categoryId: c.id })}>{c.nameSv}</a></span>)}
            </nav>
          )}
          {cat && <header><h2>{cat.nameSv}</h2><Ja text={cat.nameJa} className="muted" as="div" /></header>}
          {children.length > 0 && (
            <section>
              <div className="section-title">{categoryId ? 'Underkategorier' : 'Ämnen'}</div>
              <ul className="list card" style={{ padding: '0 16px' }}>
                {children.map((c) => {
                  const n = repo.modulesUnderCategory(c.id).length;
                  return (
                    <li key={c.id}>
                      <button className="list-item" onClick={() => navigate({ name: 'explore', categoryId: c.id })}>
                        {c.icon && <span aria-hidden style={{ fontSize: 22 }}>{c.icon}</span>}
                        <span className="grow"><strong>{c.nameSv}</strong><br /><Ja text={c.nameJa} className="small muted" /></span>
                        <span className="xsmall muted">{n} {n === 1 ? 'modul' : 'moduler'}</span>
                        <Icon name="chevron" size={18} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          {directModules.length > 0 && (
            <section className="stack-sm">
              <div className="section-title">Moduler</div>
              {directModules.map((m) => <ModuleCard key={m.id} m={m} progress={progress.get(m.id)} />)}
            </section>
          )}
          {!categoryId && (
            <section className="stack-sm">
              <div className="section-title">Alla moduler</div>
              {repo.modules.map((m) => <ModuleCard key={m.id} m={m} progress={progress.get(m.id)} />)}
            </section>
          )}
        </>
      )}
    </div>
  );
}
