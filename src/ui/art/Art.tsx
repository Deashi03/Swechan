import { useMemo } from 'react';
import mapping from '../../content/data/catalog/publishedMapping.json';
import { MODULE_MOTIF, ROOT_HUE, ROOT_MOTIF } from './motifs';
import { ART_STYLES, renderArt, type ArtStyle } from './render';

/** Style exploration (0.5): chosen per device until the product owner picks one. */
export function currentArtStyle(): ArtStyle {
  try {
    const s = localStorage.getItem('swechan.artStyle');
    if (s && (ART_STYLES as readonly string[]).includes(s)) return s as ArtStyle;
  } catch { /* storage unavailable */ }
  return 'platt';
}

/** Art for a catalog category (root motif) or catalog module (own motif, else its root's). */
export function artFor(id: string): { motif: string; hue: number } | null {
  const root = id.startsWith('SWC-') ? null : id.slice(0, 3);
  if (root) return ROOT_MOTIF[root] ? { motif: ROOT_MOTIF[root]!, hue: ROOT_HUE[root]! } : null;
  const motif = MODULE_MOTIF[id];
  return motif ? { motif, hue: hueForCatalogModule(id) } : null;
}
/** Art id for a published m.* module: its linked catalog entry, else its compatibility placement. */
export function artIdForModule(moduleId: string): string | undefined {
  return mapping.links.find((l) => l.moduleId === moduleId)?.catalogId
    ?? mapping.compatibilityPlacements.find((p) => p.moduleId === moduleId)?.catalogCategoryId;
}
const PREFIX_ROOT: Record<string, string> = { VAR: 'R01', MAN: 'R02', SAM: 'R03', HIS: 'R04', NAT: 'R05', VET: 'R06', TEK: 'R07', KUL: 'R08' };
function hueForCatalogModule(id: string): number {
  return ROOT_HUE[PREFIX_ROOT[id.slice(4, 7)] ?? 'R01'] ?? 214;
}

export function Art({ id, size = 48, style }: { id: string | undefined; size?: number; style?: ArtStyle }) {
  const st = style ?? currentArtStyle();
  const a = id ? artFor(id) : null;
  const svg = useMemo(() => (a ? renderArt(a.motif, st, a.hue) : ''), [a?.motif, a?.hue, st]);
  if (!svg) return null;
  // Static, locally generated markup (no user input).
  return <span className="art" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
