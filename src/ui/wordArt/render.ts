import { scene } from './kit';
import { WORD_MOTIFS } from './motifs';

/**
 * Word illustrations. The original motifs (motifs.ts) are always here; the motifs of each area are
 * their own lazily loaded chunk (0.14), keyed by the prefix of the motif id, so that opening a module
 * only downloads the drawings it needs. Call `loadMotif` before `renderWordArt` for such a motif.
 */
type Motifs = Record<string, string>;
const GROUPS: Record<string, () => Promise<Motifs>> = {
  'arbp.': () => import('./workplace').then((m) => m.WORKPLACE_MOTIFS),
  'jobb.': () => import('./jobSearch').then((m) => m.JOB_SEARCH_MOTIFS),
  'pek.': () => import('./privateEconomy').then((m) => m.PRIVATE_ECONOMY_MOTIFS),
  'uni.': () => import('./university').then((m) => m.UNIVERSITY_MOTIFS),
  'utb.': () => import('./eduWorld').then((m) => m.EDUWORLD_MOTIFS),
  'ftg.': () => import('./business').then((m) => m.BUSINESS_MOTIFS),
  'mark.': () => import('./marketEconomy').then((m) => m.MARKET_ECONOMY_MOTIFS),
  'bank.': () => import('./banking').then((m) => m.BANKING_MOTIFS),
  'rgrund.': () => import('./lawBasics').then((m) => m.LAW_BASICS_MOTIFS),
  'brott.': () => import('./crime').then((m) => m.CRIME_MOTIFS),
  'polis.': () => import('./police').then((m) => m.POLICE_MOTIFS),
  'domst.': () => import('./courts').then((m) => m.COURT_MOTIFS),
  'civil.': () => import('./civilLaw').then((m) => m.CIVIL_LAW_MOTIFS),
  'forv.': () => import('./authorities').then((m) => m.AUTHORITY_MOTIFS),
  'ideo.': () => import('./ideologies').then((m) => m.IDEOLOGY_MOTIFS),
  'intpol.': () => import('./worldPolitics').then((m) => m.WORLD_POLITICS_MOTIFS),
  'kommun.': () => import('./municipal').then((m) => m.MUNICIPAL_MOTIFS),
  'valet.': () => import('./elections').then((m) => m.ELECTION_MOTIFS),
  'svpol.': () => import('./swedishPolitics').then((m) => m.SWEDISH_POLITICS_MOTIFS),
  'demo.': () => import('./democracy').then((m) => m.DEMOCRACY_MOTIFS),
  'kropp.': () => import('./bodyMotifs').then((m) => m.BODY_MOTIFS),
  'familj.': () => import('./family').then((m) => m.FAMILY_MOTIFS),
  'fest.': () => import('./celebrations').then((m) => m.CELEBRATION_MOTIFS),
  'vän.': () => import('./friends').then((m) => m.FRIEND_MOTIFS),
  'mat.': () => import('./food').then((m) => m.FOOD_MOTIFS),
  'konfl.': () => import('./conflicts').then((m) => m.CONFLICT_MOTIFS),
  'barn.': () => import('./parenting').then((m) => m.PARENTING_MOTIFS),
  'samt.': () => import('./conversation').then((m) => m.CONVERSATION_MOTIFS),
  'lär.': () => import('./learning').then((m) => m.LEARNING_MOTIFS),
  'ung.': () => import('./childhood').then((m) => m.CHILDHOOD_MOTIFS),
  'hög.': () => import('./familyEvents').then((m) => m.FAMILY_EVENT_MOTIFS),
  'gest.': () => import('./nonverbal').then((m) => m.NONVERBAL_MOTIFS),
  'ident.': () => import('./identity').then((m) => m.IDENTITY_MOTIFS),
  'åsikt.': () => import('./opinions').then((m) => m.OPINION_MOTIFS),
  'vux.': () => import('./adulthood').then((m) => m.ADULTHOOD_MOTIFS),
  'rel.': () => import('./relationSkills').then((m) => m.RELATION_SKILL_MOTIFS),
  'dist.': () => import('./remoteTalk').then((m) => m.REMOTE_TALK_MOTIFS),
  'åld.': () => import('./ageing').then((m) => m.AGEING_MOTIFS),
  'artig.': () => import('./politeness').then((m) => m.POLITENESS_MOTIFS),
  'motg.': () => import('./setbacks').then((m) => m.SETBACK_MOTIFS),
  'kär.': () => import('./love').then((m) => m.LOVE_MOTIFS),
  'livs.': () => import('./groceries').then((m) => m.GROCERY_MOTIFS),
  'kök.': () => import('./kitchen').then((m) => m.KITCHEN_MOTIFS),
  'mål.': () => import('./meals').then((m) => m.MEAL_MOTIFS),
  'bord.': () => import('./dining').then((m) => m.DINING_MOTIFS),
  'hus.': () => import('./housing').then((m) => m.HOUSING_MOTIFS),
  'möb.': () => import('./furniture').then((m) => m.FURNITURE_MOTIFS),
  'khem.': () => import('./homeKitchen').then((m) => m.HOME_KITCHEN_MOTIFS),
  'bad.': () => import('./bathroom').then((m) => m.BATHROOM_MOTIFS),
  'städ.': () => import('./cleaning').then((m) => m.CLEANING_MOTIFS),
  'bost.': () => import('./housingAdmin').then((m) => m.HOUSING_ADMIN_MOTIFS),
  'acc.': () => import('./accessories').then((m) => m.ACCESSORY_MOTIFS),
  'tyg.': () => import('./textiles').then((m) => m.TEXTILE_MOTIFS),
  'pass.': () => import('./fit').then((m) => m.FIT_MOTIFS),
  'tvätt.': () => import('./laundry').then((m) => m.LAUNDRY_MOTIFS),
  'skön.': () => import('./beauty').then((m) => m.BEAUTY_MOTIFS),
  'bas.': () => import('./basics').then((m) => m.BASICS_MOTIFS),
  'kfix.': () => import('./bodyFix').then((m) => m.BODY_FIX_MOTIFS),
  'tid.': () => import('./time').then((m) => m.TIME_MOTIFS),
  'rut.': () => import('./routine').then((m) => m.ROUTINE_MOTIFS),
  'plan.': () => import('./planning').then((m) => m.PLANNING_MOTIFS),
  'akt.': () => import('./actions').then((m) => m.ACTION_MOTIFS),
  'mått.': () => import('./measure').then((m) => m.MEASURE_MOTIFS),
  'vard.': () => import('./mishaps').then((m) => m.MISHAP_MOTIFS),
  'köp.': () => import('./shopping').then((m) => m.SHOPPING_MOTIFS),
  'peng.': () => import('./money').then((m) => m.MONEY_MOTIFS),
  'buti.': () => import('./stores').then((m) => m.STORES_MOTIFS),
  'ehan.': () => import('./online').then((m) => m.ONLINE_MOTIFS),
  'post.': () => import('./post').then((m) => m.POST_MOTIFS),
  'tjän.': () => import('./services').then((m) => m.SERVICES_MOTIFS),
  'trafik.': () => import('./transit').then((m) => m.TRANSIT_MOTIFS),
  'väg.': () => import('./nav').then((m) => m.NAV_MOTIFS),
  'bil.': () => import('./car').then((m) => m.CAR_MOTIFS),
  'cyk.': () => import('./bike').then((m) => m.BIKE_MOTIFS),
  'tåg.': () => import('./rail').then((m) => m.RAIL_MOTIFS),
  'res.': () => import('./travel').then((m) => m.TRAVEL_MOTIFS),
  'sympt.': () => import('./symptoms').then((m) => m.SYMPTOMS_MOTIFS),
  'besök.': () => import('./care').then((m) => m.CARE_MOTIFS),
  'sjuk.': () => import('./disease').then((m) => m.DISEASE_MOTIFS),
  'med.': () => import('./medicine').then((m) => m.MEDICINE_MOTIFS),
  'akut.': () => import('./firstaid').then((m) => m.FIRSTAID_MOTIFS),
  'frisk.': () => import('./prevention').then((m) => m.PREVENTION_MOTIFS),
  'känsla.': () => import('./emotions').then((m) => m.EMOTION_MOTIFS),
  'emo.': () => import('./emotions2').then((m) => m.EMO2_MOTIFS),
  'tanke.': () => import('./mind').then((m) => m.MIND_MOTIFS),
  'drag.': () => import('./traits').then((m) => m.TRAIT_MOTIFS),
  'väl.': () => import('./wellbeing').then((m) => m.WELL_MOTIFS),
  'växa.': () => import('./growth').then((m) => m.GROWTH_MOTIFS),
  'stud.': () => import('./studySkills').then((m) => m.STUDY_MOTIFS),
  'fors.': () => import('./research').then((m) => m.RESEARCH_MOTIFS),
  'ped.': () => import('./pedagogy').then((m) => m.PEDAGOGY_MOTIFS),
  'skol.': () => import('./school').then((m) => m.SCHOOL_MOTIFS),
  'offb.': () => import('./publicBuildings').then((m) => m.PUBLIC_BUILDING_MOTIFS),
  'stad.': () => import('./cityPlaces').then((m) => m.CITY_PLACE_MOTIFS),
  'samh.': () => import('./publicServices').then((m) => m.PUBLIC_SERVICE_MOTIFS),
  'splan.': () => import('./urbanPlanning').then((m) => m.URBAN_PLANNING_MOTIFS),
  'migr.': () => import('./migration').then((m) => m.MIGRATION_MOTIFS),
  'civs.': () => import('./civilSociety').then((m) => m.CIVIL_SOCIETY_MOTIFS),
  'nyh.': () => import('./newsMedia').then((m) => m.NEWS_MOTIFS),
  'kkrit.': () => import('./sourceCriticism').then((m) => m.SOURCE_MOTIFS),
  'some.': () => import('./socialMedia').then((m) => m.SOCIAL_MEDIA_MOTIFS),
  'rekl.': () => import('./advertising').then((m) => m.ADVERTISING_MOTIFS),
  'fix.': () => import('./blindFix').then((m) => m.BLIND_FIX_MOTIFS),
};
const loaded: Motifs = {};
const pending = new Map<string, Promise<void>>();
const groupOf = (id: string) => Object.keys(GROUPS).find((p) => id.startsWith(p));

/** Make sure the chunk that holds `motifId` is loaded (resolves at once for the original motifs). */
export function loadMotif(motifId: string): Promise<void> {
  const g = groupOf(motifId);
  if (!g) return Promise.resolve();
  let p = pending.get(g);
  if (!p) { p = GROUPS[g]!().then((m) => { Object.assign(loaded, m); }); pending.set(g, p); }
  return p;
}
/** Load every group (tests, contact sheets). */
export async function loadAllMotifs(): Promise<void> { await Promise.all(Object.keys(GROUPS).map((g) => loadMotif(g))); }
/** True when the motif exists (after its group is loaded). */
export const hasMotif = (motifId: string): boolean => motifId in WORD_MOTIFS || motifId in loaded;

/** Full SVG markup for a word illustration, or null if the motif does not exist (or is not loaded yet). */
export function renderWordArt(motifId: string): string | null {
  const body = WORD_MOTIFS[motifId] ?? loaded[motifId];
  return body === undefined ? null : scene(body);
}
