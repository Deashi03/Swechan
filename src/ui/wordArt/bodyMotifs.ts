/**
 * Word illustrations for Kroppen & sinnena (0.13 pilot), built with body.ts.
 * Keys are motif ids as used in src/content/data/images/wordVisuals.json.
 */
import type { Svg } from './kit';
import { faceFeatures, headFront, headProfile, skull } from './body';
import { armFlex, bodyBack, bodyFront, bodySide, fist, footprints, footSide, handBack, handPalm, legSide, tiptoe, toesTop, writingHand, barefoot } from './limbs';

export const BODY_MOTIFS: Record<string, Svg> = {
  // ── Huvud och ansikte ──────────────────────────────────────────
  'kropp.skalle': skull(),
  'kropp.hjässa': headProfile(['hjässa'], { arrowFrom: [104, 8] }),
  'kropp.bakhuvud': headProfile(['bakhuvud'], { arrowFrom: [10, 30] }),
  'kropp.tinning': headFront(['tinning'], { arrowFrom: [112, 30] }),
  'kropp.nacke': headProfile(['nacke'], { arrowFrom: [12, 100] }),
  'kropp.haka': headFront(['haka'], { arrowFrom: [108, 110] }),
  'kropp.käke': headFront(['käke'], { arrowFrom: [112, 104] }),
  'kropp.ögonbryn': headFront(['ögonbryn'], { arrowFrom: [110, 30] }),
  'kropp.ögonfrans': headFront(['ögonfrans'], { arrowFrom: [110, 34] }),
  'kropp.ögonlock': headFront(['ögonlock'], { arrowFrom: [110, 40] }),
  'kropp.näsrygg': headFront(['näsrygg'], { arrowFrom: [100, 40] }),
  'kropp.näsborre': headFront(['näsborre'], { arrowFrom: [106, 92] }),
  'kropp.mungipa': headFront(['mungipa'], { arrowFrom: [108, 98] }),
  'kropp.smilgrop': headFront(['smilgrop'], { arrowFrom: [110, 96] }),
  'kropp.ansiktsdrag': faceFeatures(),
  // ── Armar och händer ────────────────────────────────────────────
  'kropp.överarm': armFlex(['överarm'], [40, 96]),
  'kropp.underarm': armFlex(['underarm'], [116, 44]),
  'kropp.armhåla': armFlex(['armhåla'], [60, 96]),
  'kropp.handled': handPalm(['handled'], [104, 112]),
  'kropp.handflata': handPalm(['handflata'], [108, 104]),
  'kropp.handrygg': handBack(['handrygg'], [108, 104]),
  'kropp.knoge': handBack(['knoge'], [106, 92]),
  'kropp.knytnäve': fist(['knytnäve'], [110, 108]),
  'kropp.fingertopp': handPalm(['fingertopp'], [92, 8]),
  'kropp.pekfinger': handPalm(['pekfinger'], [18, 18]),
  'kropp.långfinger': handPalm(['långfinger'], [86, 6]),
  'kropp.lillfinger': handPalm(['lillfinger'], [110, 22]),
  'kropp.ringfinger': handPalm(['ringfinger'], [104, 10]),
  'kropp.högerhänt': writingHand('right'),
  'kropp.vänsterhänt': writingHand('left'),
  // ── Ben och fötter ──────────────────────────────────────────────
  'kropp.tå': footSide(['tå'], [112, 60]),
  'kropp.stortå': toesTop(['stortå'], [14, 14]),
  'kropp.lilltå': toesTop(['lilltå'], [112, 24]),
  'kropp.häl': footSide(['häl'], [8, 112]),
  'kropp.fotsula': footSide(['fotsula'], [100, 116]),
  'kropp.fotvalv': footSide(['fotvalv'], [64, 116]),
  'kropp.plattfot': footprints(true),
  'kropp.fotled': legSide(['fotled'], [24, 108]),
  'kropp.vrist': legSide(['vrist'], [92, 84]),
  'kropp.smalben': legSide(['smalben'], [96, 66]),
  'kropp.vad': legSide(['vad'], [16, 76]),
  'kropp.knäskål': legSide(['knäskål'], [100, 42]),
  'kropp.knäveck': legSide(['knäveck'], [14, 40]),
  'kropp.barfota': barefoot(),
  'kropp.på-tå': tiptoe(),
  // ── Bål och rygg ────────────────────────────────────────────────
  'kropp.bröst': bodyFront(['bröst'], [104, 24]),
  'kropp.höft': bodyFront(['höft'], [110, 96]),
  'kropp.midja': bodyFront(['midja'], [110, 52]),
  'kropp.överkropp': bodyFront(['överkropp']),
  'kropp.underkropp': bodyFront(['underkropp']),
  'kropp.bål': bodyBack(['bål']),
  'kropp.navel': bodyFront(['navel'], [100, 56]),
  'kropp.buk': bodyFront(['buk'], [106, 70]),
  'kropp.ljumske': bodyFront(['ljumske'], [108, 104]),
  'kropp.skulderblad': bodyBack(['skulderblad'], [108, 24]),
  'kropp.korsrygg': bodyBack(['korsrygg'], [104, 104]),
  'kropp.ländrygg': bodyBack(['ländrygg'], [108, 56]),
  'kropp.svank': bodySide(['svank'], [16, 48]),
  'kropp.rumpa': bodyBack(['rumpa'], [108, 104]),
};
