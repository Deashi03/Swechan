import { useMemo } from 'react';
import mapping from '../../content/data/catalog/publishedMapping.json';
import { AREA_MOTIF, MODULE_MOTIF, ROOT_HUE, ROOT_MOTIF } from './motifs';
import { GROUP_MOTIF } from './groupMotifs';
import { renderArt } from './render';

const PREFIX_ROOT: Record<string, string> = { VAR: 'R01', MAN: 'R02', SAM: 'R03', HIS: 'R04', NAT: 'R05', VET: 'R06', TEK: 'R07', KUL: 'R08' };

/** Root area (R01…R08) of a catalog category, catalog module or published module. */
function rootOf(id: string): string | undefined {
  if (id.startsWith('SWC-')) return PREFIX_ROOT[id.slice(4, 7)];
  if (id.startsWith('m.')) {
    const linked = mapping.links.find((l) => l.moduleId === id)?.catalogId;
    if (linked) return rootOf(linked);
    return mapping.compatibilityPlacements.find((p) => p.moduleId === id)?.catalogCategoryId.slice(0, 3);
  }
  return id.slice(0, 3);
}

/**
 * Illustration for a root area, a sub-area (överämne, e.g. R01-A01), a topic
 * group (ämnesgrupp, e.g. R01-A01-T01), a catalog module or a published m.* module.
 */
export function artFor(id: string): { motif: string; hue: number } | null {
  const root = rootOf(id);
  const hue = root ? ROOT_HUE[root] : undefined;
  if (hue === undefined) return null;
  if (id.startsWith('m.')) {
    const linked = mapping.links.find((l) => l.moduleId === id)?.catalogId;
    const motif = MODULE_MOTIF[id] ?? (linked ? MODULE_MOTIF[linked] : undefined);
    return motif ? { motif, hue } : null;
  }
  if (id.startsWith('SWC-')) return MODULE_MOTIF[id] ? { motif: MODULE_MOTIF[id]!, hue } : null;
  if (id.length === 7) return AREA_MOTIF[id] ? { motif: AREA_MOTIF[id]!, hue } : null;
  if (id.length === 11) return GROUP_MOTIF[id] ? { motif: GROUP_MOTIF[id]!, hue } : null;
  return id.length === 3 && ROOT_MOTIF[id] ? { motif: ROOT_MOTIF[id]!, hue } : null;
}

export function Art({ id, size = 48 }: { id: string | undefined; size?: number }) {
  const a = id ? artFor(id) : null;
  const svg = useMemo(() => (a ? renderArt(a.motif, a.hue) : ''), [a?.motif, a?.hue]);
  if (!svg) return null;
  // Static, locally generated markup (no user input).
  return <span className="art" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
