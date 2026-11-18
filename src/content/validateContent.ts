/**
 * Content quality validator (developer tool).
 * Run with `npm run validate:content`. Returns human-readable issues; an
 * empty list means the content passes all automatic checks. Automatic checks
 * do NOT replace human review of translations and facts.
 */
import { checkFurigana } from './furigana';
import { entryOccursIn } from './morphology';
import { allWordImages, imageFor } from './images';
import { allPlannedVisuals, plannedVisual } from './visualPlan';
import type { ContentRepository } from './repository';
import { needsExplanation } from './schema';

export type ContentIssue = { where: string; message: string };

/**
 * Product owner's rule (0.29): everything produced from now on has a picture, an animation or a symbol.
 * These 14 module words were published without a visualisation before the rule and are the only exceptions.
 * Never add to this list – draw a picture (and blind-test it) instead.
 */
export const VISUAL_EXCEPTIONS_BEFORE_0_29: ReadonlySet<string> = new Set([
  's.en-bit.1', 's.extremt.1', 's.frasighet.1', 's.ha-det-trevligt.1', 's.knaprig.1', 's.leverans.1', 's.motion.1',
  's.otrogen.1', 's.så-fort.1', 's.varifrån.1', 's.veckovis.1', 's.vänligen.1', 's.ödmjuk.1', 's.ömsint.1',
]);

/**
 * Product owner's rule (after 0.29): a picture gets at most two blind-test rounds. A word whose picture fails
 * the second round gets plan status `none` and is listed here and under "Saknade bilder" in PROJECT_STATUS.md.
 */
export const VISUAL_MISSING_AFTER_BLIND_TEST: ReadonlySet<string> = new Set([
  's.demenssjuk.1',
  // 0.30, after two blind-test rounds
  's.rösträtt.1', 's.utöva.1', 's.statsmakt.1', 's.medborgerlig.1', 's.representera.1', 's.institution.1', 's.ansvarig.1', 's.politisk.1', 's.bereda.1', 's.debattera.1', 's.valkampanj.1', 's.valkrets.1',
  's.regional.1', 's.motivering.1',
  's.diplomatisk.1', 's.åtagande.1', 's.samarbete.1', 's.liberal.1', 's.liberalism.1', 's.socialistisk.1',
  // 0.31, after two blind-test rounds
  's.utfärda.1', 's.föreskrift.1', 's.enligt-lag.1', 's.författning.1', 's.lagstadgad.1', 's.rätt.2', 's.skyldig.3', 's.plikt.1', 's.åligga.1', 's.privatperson.1', 's.offentlig-rätt.1',
  // 0.31 (Brott & straff, Polis), after two blind-test rounds
  's.gärning.1', 's.straffbar.1', 's.brottslig.1', 's.uppsåt.1', 's.vårdslös.1', 's.avsiktlig.1', 's.uppsåtlig.1', 's.oaktsamhet.1', 's.anstiftan.1', 's.straff.1', 's.individualprevention.1', 's.skäligen-misstänkt.1', 's.anhållande.1', 's.försvåra.1',
  // 0.31 (Domstolar & rättegång), after two blind-test rounds
  's.rättegång.1', 's.yrkande.2', 's.yrka.1', 's.åtalsplikt.1', 's.åtal.1', 's.stämning.1', 's.yttra-sig.1', 's.överklagande.1', 's.frikänna.1', 's.fria.2',
  // 0.31 (Civilrätt, Förvaltning), after two blind-test rounds
  's.sakliga-skäl.1', 's.handlägga.1', 's.ansökan.1', 's.sekretessbelagd.1', 's.sekretessmarkering.1', 's.sekretess.1', 's.konfidentiell.1', 's.serviceskyldighet.1', 's.service.2', 's.vägledning.1',
  // 0.32 (Privatekonomi, Arbetsplatsens vardag, Jobbsökande), after two blind-test rounds
  's.inflation.1', 's.räntekostnad.1', 's.låneränta.1', 's.inkomstskatt.1', 's.skattepliktig.1', 's.hushålla.1', 's.ha-hand-om.1', 's.tjänstledighet.1', 's.kränkande-särbehandling.1', 's.befattning.1',
  // 0.32 (Företagande), after two blind-test rounds
  's.F-skatt.1', 's.vinst.1', 's.förlust.1', 's.marknadsföring.1', 's.bolag.1',
  // 0.32 (Marknadsekonomi), after two blind-test rounds
  's.stiga.1', 's.konkurrent.1', 's.sektor.1', 's.effektivisera.1', 's.arbetsmarknad.1', 's.finanspolitik.1', 's.penningpolitik.1',
  // 0.32 (Banker & investeringar), after two blind-test rounds
  's.obligation.1', 's.sprida-riskerna.1', 's.riskspridning.1',
  // 0.33 (Studieteknik), after two blind-test rounds
  's.förförståelse.1', 's.visualisera.1', 's.studiesvårighet.1',
  // 0.33 (Universitet & högskola), after two blind-test rounds
  's.utexaminerad.1',
  // 0.33 (Svensk skola), after two blind-test rounds
  's.friskola.1', 's.bedömning.1', 's.specialpedagog.1', 's.särskilt-stöd.1', 's.ämnesplan.1', 's.antagning.1',
  // 0.33 (Pedagogik), after two blind-test rounds
  's.pedagogik.1', 's.lärande.1', 's.förmåga.1', 's.respons.1', 's.förutsättning.2',
  // 0.33 (Forskning & akademi), after two blind-test rounds
  's.vetenskaplig.1', 's.publikation.1', 's.källkritisk.1', 's.referera.1', 's.empirisk.1', 's.etisk.1', 's.fabricera.1', 's.tes.1', 's.motargument.1',
  // 0.33 (Utbildningssystem i världen), after two blind-test rounds
  's.skolgång.1', 's.yrkeshögskola.1',
  // 0.34 (Offentliga byggnader), after two blind-test rounds
  's.myndighet.1',
  // 0.34 (Stadens platser), after two blind-test rounds
  's.trivsam.1',
  // 0.34 (Samhällsservice), after two blind-test rounds
  's.medborgarservice.1',
  // 0.34 (Bostads- & stadsplanering), after two blind-test rounds
  's.framkomlighet.1',
  // 0.34 (Befolkning & migration), after two blind-test rounds
  's.vara-skriven.1', 's.befolkning.1', 's.utflyttning.2', 's.ursprungsland.2',
  // 0.34 (Civilsamhälle), after two blind-test rounds
  's.välgörenhet.1',
  // 0.35 (Nyhetsmedier), after two blind-test rounds
  's.sensation.1',
  // 0.35 (Källkritik), after two blind-test rounds
  's.värdeladdad.1', 's.faktagranskning.1', 's.myt.1', 's.ensidig.1', 's.vinkla.1', 's.framställa.1', 's.tendens.1',
  // 0.35 (Sociala medier), after two blind-test rounds
  's.trend.1', 's.sprida-sig.1',
  // 0.35 (Reklam & påverkan), after two blind-test rounds
  's.image.1',
  // 0.35 (Yttrandefrihet & medierätt), after two blind-test rounds
  's.inskränkning.1', 's.åsiktsfrihet.1', 's.pressfrihet.1', 's.ensamansvar.1', 's.upphovsrätt.1', 's.förtal.1', 's.förtala.1', 's.nedsättande.1', 's.kränkande.1',
  // 0.35 (Debatt & opinion), after two blind-test rounds
  's.ledarskribent.1', 's.argumentation.1', 's.ta-debatten.1', 's.saklighet.1', 's.polariserad.1',
  // 0.36 (Antiken), after two blind-test rounds
  's.ofri.1', 's.ståthållare.1', 's.kejsardöme.1', 's.klassisk.2',
  // 0.36 (Medeltiden), after two blind-test rounds
  's.helig.1',
  // 0.36 (Tidigmodern tid), after two blind-test rounds
  's.humanism.1', 's.kolonialism.1', 's.prakt.1', 's.praktfull.1',
  // 0.36 (Revolutioner & industrialisering), after two blind-test rounds
  's.beskatta.1', 's.facklig.1', 's.socialdemokrati.1',
  // 0.36 (1900-tal till nutid), after two blind-test rounds
  's.fascism.1', 's.depression.1', 's.nazism.1', 's.folkmord.1', 's.civil-olydnad.1', 's.välfärdssamhälle.1', 's.socialförsäkring.1', 's.världsomspännande.1',
  // 0.37 (Forntida krigföring), after two blind-test rounds
  's.beriden.1', 's.befäl.1', 's.taktik.1',
  // 0.37 (Slott & fästningar, Belägringar), after two blind-test rounds
  's.hålla-stånd.1', 's.försvarsverk.1', 's.befästa.1', 's.strategisk.1', 's.övertag.1', 's.isolerad.2', 's.kringvärn.1', 's.kapitulation.1',
  // 0.37 (Tidiga moderna arméer), after two blind-test rounds
  's.menig.1', 's.segerrik.1',
  // 0.37 (Världskrigen), after two blind-test rounds
  's.offensiv.1',
  // 0.37 (Modern krigföring), after two blind-test rounds
  's.terrorism.1', 's.krigets-lagar.1',
  // 0.38 (Religiösa grundbegrepp), after two blind-test rounds
  's.tro.1', 's.from.1', 's.bön.1', 's.tillbe.1', 's.högtidlighålla.1',
  // 0.38 (Kristendomens historia), after two blind-test rounds
  's.protestantisk.1',
  // 0.38 (Islamisk historia & kultur), after two blind-test rounds
  's.sunna.1',
  // 0.38 (Asiatiska religioner), after two blind-test rounds
  's.nirvana.1', 's.theravadabuddhism.1', 's.renhet.1', 's.medmänsklighet.1',
  // 0.38 (Judendom & andra traditioner), after two blind-test rounds
  's.jiddisch.1', 's.bud.2', 's.animism.1',
  // 0.38 (Idéernas historia), after two blind-test rounds
  's.meningen-med-livet.1', 's.existentiell.1', 's.ateism.1',
  // 0.39 (Kunskapsteori), after two blind-test rounds
  's.förmoda.1', 's.tro.2', 's.tvivla-på.1', 's.skepticism.1', 's.evidens.1', 's.rättfärdiga.1', 's.rättfärdigande.1', 's.på-goda-grunder.1', 's.hålla-för-sant.1', 's.synsätt.1', 's.gåta.1',
  // 0.39 (Filosofins grundord), after two blind-test rounds
  's.term.1', 's.utsaga.1', 's.otänkbar.1', 's.tänka-sig.1', 's.filosofisk.1', 's.samtalsledare.1',
  // 0.39 (Etik & moral), after two blind-test rounds
  's.omoralisk.1', 's.pliktetik.1', 's.maxim.1', 's.nytta.1', 's.rättvisa.1', 's.lika-möjligheter.1',
  // 0.39 (Medvetande & identitet), after two blind-test rounds
  's.medvetenhet.1', 's.inifrån.1', 's.förnimmelse.1', 's.handling.1',
  // 0.39 (Politisk filosofi), after two blind-test rounds
  's.tvång.1', 's.stat.1', 's.lydnad.1', 's.maktposition.1', 's.individuell.1', 's.fördelningsrättvisa.1',
  // 0.39 (Existens & verklighet), after two blind-test rounds
  's.finnas-till.1', 's.existens.1', 's.varande.1', 's.väsen.1', 's.nödvändigtvis.1', 's.overklig.1', 's.sken.1', 's.idealism.1', 's.ha-något-att-leva-för.1', 's.meningslöshet.1', 's.livsuppgift.1', 's.hängivenhet.1', 's.ändlighet.1', 's.ond-tro.1', 's.existentialism.1',
  // 0.40 (Historiska föremål), after two blind-test rounds
  's.skriftlig-källa.1', 's.avsedd.1', 's.funktion.1',
  // 0.40 (Arkeologins metoder), after two blind-test rounds
  's.arkeologisk.1', 's.arkeologi.1', 's.lösfynd.1', 's.datering.1', 's.tyda-på.1',
  // 0.40 (Museer & samlingar), after two blind-test rounds
  's.konservering.1',
  // 0.40 (Byggnadshistoria), after two blind-test rounds
  's.kulturhistorisk.1',
  // 0.40 (Historisk forskning), after two blind-test rounds
  's.förstahandsuppgift.1', 's.tendentiös.1', 's.historieskrivning.1', 's.historiesyn.1',
  // 0.41 (Nordens historia), after two blind-test rounds
  's.rikssamling.1', 's.befrielsekrig.1', 's.landvinning.1', 's.representationsreform.1', 's.neutralitetspolitik.1',
  // 0.41 (Östasiens historia), after two blind-test rounds
  's.shogunat.1', 's.ståndssamhälle.1', 's.kolonialstyre.1', 's.folkrepublik.1',
  // 0.41 (Sydasiens historia), after two blind-test rounds
  's.civilisation.1', 's.sanskrit.1', 's.blomstra.1', 's.storslagen.1', 's.sultanat.1',
  // 0.41 (Mellanösterns historia), after two blind-test rounds
  's.expansion.1', 's.mandat.2',
  // 0.41 (Afrikas historia), after two blind-test rounds
  's.indirekt-styre.1',
  // 0.41 (Amerikas & Oceaniens historia), after two blind-test rounds
  's.arbetsplikt.1',
  // 0.42 (Landskapets former), after two blind-test rounds
  's.sträcka-sig.1', 's.vidsträckt.1', 's.klippig.1', 's.naturskön.1',
  // 0.42 (Bergarter & mineral), after two blind-test rounds
  's.sedimentär.1', 's.metamorf.1', 's.hårdhet.1', 's.geologisk.1',
  // 0.42 (Jordens inre), after two blind-test rounds
  's.oceanisk.1', 's.kontinental.1', 's.tektonisk.1', 's.plattektonik.1', 's.vulkanisk.1', 's.erosion.1',
  // 0.42 (Floder, sjöar & hav), after two blind-test rounds
  's.nedströms.1', 's.mild.2',
  // 0.42 (Is & istider), after two blind-test rounds
  's.osorterad.1',
  // 0.42 (Mark & jordarter), after two blind-test rounds
  's.sandig.1', 's.lerig.1', 's.lucker.1', 's.omkomma.1',
  // 0.43 (Vädrets vardagsord), after two blind-test rounds
  's.mulen.1', 's.strålande.1', 's.regnig.1', 's.halt-adj.1', 's.blåsig.1', 's.dimmig.1', 's.disig.1', 's.hundkall.1', 's.växlande-molnighet.1',
  // 0.43 (Atmosfären), after two blind-test rounds
  's.lufttryck.2', 's.hektopascal.1', 's.avdunstning.1', 's.kondensation.1', 's.relativ-luftfuktighet.1',
  // 0.43 (Nederbörd & moln), after two blind-test rounds
  's.uppklarnande.1', 's.urladdning.1', 's.frostig.1', 's.tränga-undan.1',
  // 0.43 (Extremväder), after two blind-test rounds
  's.insnöad.1', 's.hemberedskap.1',
  // 0.43 (Klimatzoner), after two blind-test rounds
  's.arid.1', 's.sträng.2', 's.polar.1',
  // 0.43 (Klimatförändringar), after two blind-test rounds
  's.uppvärmning.2', 's.påverkan.2', 's.global-uppvärmning.1', 's.beräkna.1', 's.självförstärkande.1', 's.klimatmål.1', 's.fossilfri.1',
  // 0.44 (Däggdjur), after two blind-test rounds
  's.parningstid.1', 's.anpassning.2', 's.varmblodig.1',
  // 0.44 (Fåglar), after two blind-test rounds
  's.övervintra.1', 's.flyttande.1', 's.flygfärdig.1',
  // 0.44 (Kräldjur & groddjur), after two blind-test rounds
  's.frostfri.1', 's.trög.1', 's.yttre-befruktning.1',
  // 0.44 (Djurens beteenden), after two blind-test rounds
  's.revirhävdande.1', 's.monogam.1', 's.dominant.1', 's.migration.2', 's.instinkt.1',
  // 0.45 (Träd & buskar), after two blind-test rounds
  's.frodas.1',
  // 0.45 (Blommor & örter), after two blind-test rounds
  's.släkte.1', 's.växtfamilj.1',
  // 0.45 (Gräs & mossor), after two blind-test rounds
  's.indikatorart.1',
  // 0.45 (Svampriket), after two blind-test rounds
  's.förväxlingsrisk.1', 's.livsfarlig.1', 's.murken.1', 's.vid-minsta-tvekan.1', 's.tumregel.1',
  // 0.45 (Växters liv), after two blind-test rounds
  's.fosfor.1', 's.förökning.1', 's.avge.1',
  // 0.45 (Trädgård & odling), after two blind-test rounds
  's.hålla-sig.1',
  // 0.46 (Ekosystemets grunder), after two blind-test rounds
  's.talrik.1', 's.förekomma.1', 's.rubba.1', 's.samexistera.1',
  // 0.46 (Biologisk mångfald), after two blind-test rounds
  's.artfattig.1', 's.artrikedom.1', 's.ärva.2', 's.genetisk.1', 's.nära-hotad.1', 's.hotad.1', 's.dö-ut.1', 's.utrota.1', 's.främmande-art.1', 's.invasiv.1', 's.inhemsk.1', 's.naturvård.1', 's.naturhänsyn.1', 's.återställa.1',
  // 0.46 (Föroreningar & avfall), after two blind-test rounds
  's.förorenad.1', 's.nedbrytbar.1', 's.materialåtervinning.1',
  // 0.46 (Hållbar resursanvändning), after two blind-test rounds
  's.bioenergi.1', 's.ta-slut.1', 's.outtömlig.1', 's.knapphet.1', 's.klimatavtryck.1', 's.livscykel.2',
  // 0.46 (Miljöpolitik & samhälle), after two blind-test rounds
  's.miljökvalitetsmål.1', 's.indikator.1', 's.föreläggande.1', 's.försiktighetsprincip.1', 's.vite.1', 's.miljösanktionsavgift.1', 's.skyddat-område.1', 's.inrätta.1', 's.skötselplan.1', 's.utsläppshandel.1', 's.utsläppsrätt.1', 's.miljökonsekvensbeskrivning.1', 's.sakägare.1', 's.miljökonsekvensbedömning.1', 's.exploatör.1', 's.miljömärkning.1',
  // 0.47 (Europa), after two blind-test rounds
  's.gränsa-till.1', 's.dvärgstat.1', 's.areal.1', 's.regeringssäte.1', 's.nordbo.1',
  // 0.47 (Kartor & orientering), after two blind-test rounds
  's.sydlig.1', 's.i-verkligheten.1', 's.position.1',
  // 0.48 Tal & räkning: abstrakt substantiv, kan inte skiljas från rimlig
  's.rimlighet.1',
  // 0.48 Tal & räkning: förväxlas med synonym eller samma ordfamilj efter två blindomgångar
  's.delbar.2', 's.storleksordning.1', 's.addition.1', 's.subtraktion.1', 's.överslag.1',
  // 0.48 Bråk & decimaler: kan inte skiljas från avrunda respektive prisökning
  's.avrundning.1', 's.procentuell.1',
  // 0.48 Bråk & decimaler: förväxlas efter två blindomgångar
  's.närmevärde.1', 's.procent.1', 's.andel.2', 's.minskning.1', 's.ökning.1',
  // 0.48 Algebraiska uttryck: kan inte skiljas från enhet
  's.storhet.1',
  // 0.48 Algebraiska uttryck: förväxlas med synonym eller samma ordfamilj efter två blindomgångar
  's.variera.1', 's.potens.1', 's.ordningsföljd.1', 's.isolera.2', 's.olikhet.1',
  // 0.48 Funktioner & grafer: abstrakt, kan inte skiljas från funktionsvärde/motsvara
  's.funktion.2', 's.bero-på.2',
  // 0.48 Funktioner & grafer: förväxlas efter två blindomgångar
  's.linjär.2', 's.i-takt-med.1', 's.samband.1', 's.proportionalitet.1',
  // 0.48 Statistikens grunder: abstrakta fackord som förväxlas med synonym eller samma ordfamilj
  's.data.1', 's.datamängd.1', 's.i-tabellform.1', 's.föra-in.1', 's.lägesmått.1', 's.förekomma.2', 's.korrelation.1', 's.relativ-frekvens.1', 's.jämnt-fördelad.1', 's.i-genomsnitt.1', 's.skilja-sig-åt.1', 's.mittersta.1', 's.spridningsmått.1', 's.spridning.2',
  // 0.48 Statistikens grunder: förväxlas efter två blindomgångar
  's.utspridd.1', 's.population.2',
  // 0.48 Geometrins grundformer: förväxlas med ord ur samma ordfamilj efter två blindomgångar
  's.symmetrilinje.1', 's.rektangulär.1', 's.rund.1', 's.area.1', 's.kvadratdecimeter.1',
  // 0.49 Analys & derivata: förväxlas med lutning respektive högsta/lägsta värde
  's.derivata.1', 's.förändringshastighet.1', 's.extremvärde.2',
  // 0.49 Linjär algebra: förväxlas med startpunkt, sätta in respektive faktor
  's.nollvektor.1', 's.substitutionsmetod.1', 's.egenvärde.1',
  // 0.49 Analys & derivata: förväxlas med derivata respektive tangent efter två blindomgångar
  's.derivera.1', 's.tangeringspunkt.1',
  // 0.49 Linjär algebra: förväxlas med riktning respektive koordinat efter två blindomgångar
  's.vektor.1', 's.komponent.1',
  // 0.49 Integraler & differentialekvationer: kan inte skiljas från integrera, konstant, sträcka respektive villkor
  's.primitiv-funktion.1', 's.integrationskonstant.1', 's.tillryggalagd.1', 's.begynnelsevillkor.1',
  // 0.49 Sannolikhetsteori: abstrakta fackord som förväxlas med synonym eller samma ordfamilj
  's.slumpförsök.1', 's.komplementhändelse.1', 's.permutation.1', 's.kombinatorik.1', 's.sannolikhetsfördelning.1', 's.väntevärde.1', 's.varians.1',
  // 0.49 Sannolikhetsteori: förväxlas med sannolikhet efter två blindomgångar
  's.osannolik.1',
  // 0.49 Diskret matematik: abstrakta fackord som förväxlas med närliggande ord
  's.implikation.1', 's.omvändning.1', 's.motsägelsebevis.1', 's.direkt-bevis.1', 's.axiom.1', 's.graf.2', 's.träd.2', 's.komplexitet.1',
  // 0.49 Diskret matematik: förväxlas med linjär sökning respektive räkna baklänges efter två blindomgångar
  's.sökning.1', 's.föregående.1',
  // 0.49 Matematikens specialområden: förväxlas med närliggande fackord
  's.noggrannhet.2', 's.numerisk.1', 's.startvärde.1', 's.målfunktion.1', 's.kryptografi.1', 's.öppen-nyckel.1',
  // 0.49 Matematikens specialområden: förväxlas med töja, noggrannhet respektive kryptera efter två blindomgångar
  's.deformera.1', 's.exakt.1', 's.chiffer.1',
  // 0.50 Mekanik: förväxlas med närliggande ord i samma modul
  's.förflyttning.1', 's.rörelse.1', 's.momentanhastighet.1', 's.retardation.1', 's.newton.1', 's.motkraft.1', 's.energiomvandling.1', 's.vridmoment.1',
  // 0.50 Ljus & optik: förväxlas med reflektera respektive lupp
  's.reflektion.2', 's.förstoring.1',
  // 0.50 Ljus & optik: förväxlas med konkav/konvex efter två blindomgångar
  's.spridningslins.1', 's.samlingslins.1',
  // 0.50 Vågor & ljud: förväxlas med vibration, frekvens respektive regelbunden
  's.svängning.1', 's.hertz.1', 's.periodisk.1',
  // 0.50 Elektricitet & magnetism: förväxlas med motstånd
  's.resistans.1',
  // 0.50 Värmelära & termodynamik: abstrakta fackord som förväxlas med närliggande ord
  's.tillföra.1', 's.värmeförlust.1', 's.termodynamik.1', 's.inre-energi.1', 's.energiprincipen.1', 's.entropi.1', 's.diffusion.1', 's.oordning.1',
  // 0.50 Värmelära & termodynamik: förväxlas med smälta efter två blindomgångar
  's.smältpunkt.1',
  // 0.50 Modern fysik: abstrakta fackord som förväxlas med närliggande ord
  's.kvantum.1', 's.kvanttal.1', 's.spektrallinje.1', 's.sönderfall.1', 's.kvantmekanik.1', 's.partikelstråle.1',
  // 0.50 Modern fysik: förväxlas med kvantum efter två blindomgångar
  's.foton.1',
  // 0.51 Molekyler & kemiska bindningar: förväxlas med huvudordet eller samma ordfamilj
  's.positiv-jon.1', 's.negativ-jon.1', 's.laddad.1', 's.leda-ström.1', 's.vinklad.1', 's.bindningsvinkel.1', 's.flyktig.1', 's.intermolekylär-kraft.1', 's.van-der-Waals-kraft.1',
  // 0.51 Molekyler & kemiska bindningar: förväxlas med kristall respektive lösa sig efter två blindomgångar
  's.gitter.1', 's.fettlöslig.1',
  // 0.51 Kemiska reaktioner: förväxlas med reaktion, rost respektive hastighet
  's.kemisk-förändring.1', 's.bildas.1', 's.oxidation.1', 's.reaktionshastighet.1',
  // 0.51 Atomer & periodiska systemet: förväxlas med närliggande ord
  's.nukleon.1', 's.reaktiv.1', 's.deuterium.1', 's.instabil.2', 's.fullt-skal.1',
  // 0.51 Atomer & periodiska systemet: förväxlas med grupp efter två blindomgångar
  's.halogen.1',
]);

export function validateContent(repo: ContentRepository): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const add = (where: string, message: string) => issues.push({ where, message });
  const ja = (where: string, text: string | undefined) => {
    if (text === undefined) return;
    for (const i of checkFurigana(text)) add(where, i.message);
  };

  // Unique ids
  const seen = new Set<string>();
  const unique = (id: string, where: string) => { if (seen.has(id)) add(where, `Dubblett-ID ${id}`); seen.add(id); };

  for (const e of repo.entries) {
    unique(e.id, e.id);
    const infl = e.inflection;
    if (infl.kind === 'noun' && infl.indefSg !== e.lemma) add(e.id, 'indefSg måste vara lika med uppslagsordet');
    if (infl.kind === 'verb') {
      if (infl.infinitive !== e.lemma) add(e.id, 'infinitive måste vara lika med uppslagsordet');
      if (infl.particle)
        for (const f of [infl.infinitive, infl.present, infl.past, infl.supine, infl.imperative])
          if (!f.endsWith(` ${infl.particle}`)) add(e.id, `Partikelverbsformen "${f}" slutar inte på partikeln`);
    }
    if (infl.kind === 'adjective' && infl.common !== e.lemma) add(e.id, 'common måste vara lika med uppslagsordet');
    if (e.pos !== infl.kind && infl.kind !== 'none') add(e.id, `Ordklass ${e.pos} matchar inte böjningstyp ${infl.kind}`);
    for (const s of e.senses) {
      unique(s.id, s.id);
      if (!s.id.startsWith(`s.${e.id.slice(2)}.`)) add(s.id, `Betydelse-ID ska börja med s.${e.id.slice(2)}.`);
      ja(`${s.id}.ja`, s.ja);
      // The Japanese gloss and definition are recall prompts: the Swedish answer must not appear in them (0.5).
      for (const [k, t] of [['ja', s.ja], ['defJa', s.defJa]] as const)
        if (entryOccursIn(t, e)) add(`${s.id}.${k}`, 'Den japanska texten innehåller det svenska ordet (svaret syns i frågan) – flytta konstruktionen till usageNote');
      ja(`${s.id}.defJa`, s.defJa);
      s.examples.forEach((x, i) => ja(`${s.id}.examples[${i}]`, x.ja));
      ja(`${s.id}.usageNote`, s.usageNote?.ja);
      ja(`${s.id}.explanation`, s.explanation?.ja);
      if (s.explanation) {
        if (s.explanation.sv.trim() === s.defSv.trim()) add(`${s.id}.explanation`, 'Förklaringen får inte bara upprepa definitionen');
        if (s.explanation.sv.length < 60) add(`${s.id}.explanation`, 'Förklaringen är för kort – förklara vad ordet betyder i praktiken och när det används');
      }
      for (const r of s.synonyms ?? []) {
        if (!repo.getSense(r.senseId)) add(s.id, `Synonym pekar på okänd betydelse ${r.senseId}`);
        ja(`${s.id}.synonyms`, r.noteJa);
      }
      for (const g of s.grammarNotes ?? []) if (!repo.getGrammarNote(g)) add(s.id, `Okänd grammatiknotering ${g}`);
      // "reviewed" is a human statement: it needs who and when. AI tools never set it.
      if (s.quality.status === 'reviewed' && (!s.quality.reviewer || !s.quality.date)) add(s.id, 'Status reviewed kräver reviewer och date (mänsklig granskning)');
    }
  }

  for (const n of repo.grammarNotes) {
    unique(n.id, n.id);
    ja(n.id, n.titleJa); ja(n.id, n.bodyJa);
    n.examples.forEach((x) => ja(n.id, x.ja));
  }
  for (const c of repo.comparisons) {
    unique(c.id, c.id);
    ja(c.id, c.titleJa); ja(c.id, c.summaryJa);
    for (const it of c.items) {
      if (!repo.getSense(it.senseId)) add(c.id, `Okänd betydelse ${it.senseId}`);
      ja(c.id, it.noteJa);
    }
  }
  for (const c of repo.categories) {
    unique(c.id, c.id);
    ja(c.id, c.nameJa);
    if (c.parentId && !repo.getCategory(c.parentId)) add(c.id, `Okänd förälder ${c.parentId}`);
    if (repo.categoryPath(c.id).length >= 20) add(c.id, 'Kategorihierarkin innehåller en cykel');
  }
  for (const m of repo.modules) {
    unique(m.id, m.id);
    ja(m.id, m.titleJa); ja(m.id, m.descriptionJa);
    // Legacy c.* category or (0.4) a catalog category ID; the catalog placement itself is checked by catalog:validate.
    if (!repo.getCategory(m.categoryId) && !/^R\d{2}(-A\d{2}(-T\d{2})?)?$/.test(m.categoryId)) add(m.id, `Okänd kategori ${m.categoryId}`);
    for (const p of [...m.prerequisites, ...m.related]) if (!repo.getModule(p)) add(m.id, `Okänd modul ${p}`);
    const senseIds = new Set<string>();
    const body = repo.getLoadedModuleBody(m.id);
    if (!body) { add(m.id, 'Lektionskroppen är inte laddad (validera med toolingRepository())'); continue; }
    const fullText = body.reading.paragraphs.join('\n');
    for (const w of m.words) {
      if (senseIds.has(w.senseId)) add(m.id, `Målordet ${w.senseId} förekommer två gånger`);
      senseIds.add(w.senseId);
      const ref = repo.getSense(w.senseId);
      if (!ref) { add(m.id, `Okänd betydelse ${w.senseId}`); continue; }
      if (needsExplanation(ref.entry.level) && !ref.sense.explanation)
        add(m.id, `"${ref.entry.lemma}" (${ref.entry.level}) är svårt för en genomsnittlig elev i årskurs 9 och behöver en förklaring (explanation) på ${w.senseId}`);
      if (!entryOccursIn(fullText, ref.entry)) add(m.id, `Målordet "${ref.entry.lemma}" saknas i lästexten (ingen känd böjningsform hittades)`);
    }
    for (const q of body.reading.questions) {
      if (q.kind === 'choice' && q.correctIndex >= q.options.length) add(`${m.id}.${q.id}`, 'correctIndex utanför alternativen');
      ja(`${m.id}.${q.id}`, q.explanationJa);
    }
  }
  for (const p of repo.placementItems) {
    unique(p.id, p.id);
    ja(p.id, p.promptJa);
    p.options?.forEach((o) => ja(p.id, o));
    if (p.kind === 'meaning' && !(p.options ?? []).includes(p.answers[0]!)) add(p.id, 'Rätt svar saknas bland alternativen');
  }
  // Word images (0.6)
  const imageSeen = new Set<string>();
  for (const img of allWordImages()) {
    const w = `bild ${img.senseId}`;
    if (imageSeen.has(img.senseId)) add(w, 'Betydelsen har flera bilder');
    imageSeen.add(img.senseId);
    if (!repo.getSense(img.senseId)) add(w, 'Okänd betydelse');
    for (const c of img.confusableWith ?? []) if (!repo.getSense(c)) add(w, `confusableWith pekar på okänd betydelse ${c}`);
    if (img.symbol && img.quiz) add(w, 'En symbolbild får inte användas i bildövningar (quiz)');
    if (img.kind === 'animation' && img.quiz && plannedVisual(img.senseId)?.kind === 'symbol') add(w, 'En symbolisk scen (glosa) får inte användas i bildövningar (quiz)');
  }
  // Visual plan (0.12): every module word has a planned kind; every row points at a known sense
  for (const m of repo.modules) for (const wd of m.words) if (!plannedVisual(wd.senseId)) add(`${m.id} › ${wd.senseId}`, 'Visualiseringsplan saknas – kör npm run visuals:plan');
  for (const id of Object.keys(allPlannedVisuals())) if (!repo.getSense(id)) add(`visualiseringsplan ${id}`, 'Okänd betydelse');
  // Every module word has a visualisation (0.29, product owner's rule)
  for (const m of repo.modules) for (const wd of m.words) {
    if (VISUAL_EXCEPTIONS_BEFORE_0_29.has(wd.senseId) || VISUAL_MISSING_AFTER_BLIND_TEST.has(wd.senseId)) continue;
    if (!imageFor(wd.senseId)) add(`${m.id} › ${wd.senseId}`, 'Ordet saknar bild, animation eller symbol – från 0.29 ska varje modulord ha en visualisering');
    if (plannedVisual(wd.senseId)?.kind === 'none') add(`${m.id} › ${wd.senseId}`, 'Planen säger "ingen bild" – från 0.29 får nya modulord inte sakna visualisering');
  }

  return issues;
}
