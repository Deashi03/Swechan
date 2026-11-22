# Anteckningar för det manuella bildspåret

Flyttat från `PROJECT_STATUS.md` (avsnittet *Saknade bilder*) 2026-11-19, kvalitetsplanen A5. Vilka ord som väntar står nu i planen (`status: "manual"` i `src/content/data/images/visualPlan.json`) och i kön `npm run audit:content -- --backlog` (`quality/backlog/ord-utan-bild.json`). Här finns det som är värt att veta när bilden görs om för hand: vilka ord bilden förväxlades med i blindtesten.

## Historik (till och med 0.53)

Dessa modulord underkändes i två blindtest. De hade tidigare planstatus `none`; sedan A5 har de `status: "manual"`.

- **Före 0.29 (14 ord):**
  - `s.en-bit.1`, `s.extremt.1`, `s.frasighet.1`, `s.ha-det-trevligt.1`, `s.knaprig.1`
  - `s.leverans.1`, `s.motion.1`, `s.otrogen.1`, `s.så-fort.1`, `s.varifrån.1`
  - `s.veckovis.1`, `s.vänligen.1`, `s.ödmjuk.1`, `s.ömsint.1`
  - (Tidigare i `VISUAL_EXCEPTIONS_BEFORE_0_29`, nu borttagen.)
- **Från 0.29:** `s.demenssjuk.1` (*Minnesförändringar*).
- **Från 0.30 (20 ord):**
  - Demokratins grundbegrepp: `s.rösträtt.1`, `s.utöva.1`, `s.statsmakt.1`, `s.medborgerlig.1`, `s.representera.1`, `s.institution.1`, `s.ansvarig.1`
  - Svensk politik: `s.politisk.1`, `s.bereda.1`, `s.debattera.1`
  - Val & folkomröstningar: `s.valkampanj.1`, `s.valkrets.1`
  - Kommuner & regioner: `s.regional.1`, `s.motivering.1`
  - Internationell politik: `s.diplomatisk.1`, `s.åtagande.1`, `s.samarbete.1`
  - Politiska idéer: `s.liberal.1`, `s.liberalism.1`, `s.socialistisk.1`
- **Från 0.31 (45 ord):**
  - Rättens grunder: `s.utfärda.1`, `s.föreskrift.1`, `s.enligt-lag.1`, `s.författning.1`, `s.lagstadgad.1`, `s.rätt.2`, `s.skyldig.3`, `s.plikt.1`, `s.åligga.1`, `s.privatperson.1`, `s.offentlig-rätt.1`
    - *utfärda*, *föreskrift* och *enligt lag* ritades av misstag aldrig om efter första omgången. De kan vara värda ett nytt försök om produktägaren tillåter det.
  - Brott & straff: `s.gärning.1`, `s.straffbar.1`, `s.brottslig.1`, `s.uppsåt.1`, `s.vårdslös.1`, `s.avsiktlig.1`, `s.uppsåtlig.1`, `s.oaktsamhet.1`, `s.anstiftan.1`, `s.straff.1`, `s.individualprevention.1`
  - Polis & brottsutredning: `s.skäligen-misstänkt.1`, `s.anhållande.1`, `s.försvåra.1`
  - Domstolar & rättegång: `s.rättegång.1`, `s.yrkande.2`, `s.yrka.1`, `s.åtalsplikt.1`, `s.åtal.1`, `s.stämning.1`, `s.yttra-sig.1`, `s.överklagande.1`, `s.frikänna.1`, `s.fria.2`
  - Civilrätt i vardagen: `s.sakliga-skäl.1`
  - Förvaltning & myndigheter: `s.handlägga.1`, `s.ansökan.1`, `s.sekretessbelagd.1`, `s.sekretessmarkering.1`, `s.sekretess.1`, `s.konfidentiell.1`, `s.serviceskyldighet.1`, `s.service.2`, `s.vägledning.1`
- **Från 0.32 (25 ord):**
  - Privatekonomi: `s.inflation.1`, `s.räntekostnad.1`, `s.låneränta.1`, `s.inkomstskatt.1`, `s.skattepliktig.1`, `s.hushålla.1`
  - Arbetsplatsens vardag: `s.ha-hand-om.1`, `s.tjänstledighet.1`, `s.kränkande-särbehandling.1`
  - Jobbsökande & anställning: `s.befattning.1`
  - Företagande: `s.F-skatt.1`, `s.vinst.1`, `s.förlust.1`, `s.marknadsföring.1`, `s.bolag.1`
  - Marknadsekonomi: `s.stiga.1`, `s.konkurrent.1`, `s.sektor.1`, `s.effektivisera.1`, `s.arbetsmarknad.1`, `s.finanspolitik.1`, `s.penningpolitik.1`
  - Banker & investeringar: `s.obligation.1`, `s.sprida-riskerna.1`, `s.riskspridning.1`
  - *vinst* och *förlust* förväxlades med *gå med vinst*/*gå med förlust*, och *riskspridning*/*sprida riskerna* med *diversifiera*. Produktägaren kan överväga att markera dem som synonymer och testa igen.
- **Från 0.33 (26 ord):**
  - Svensk skola: `s.friskola.1`, `s.bedömning.1`, `s.specialpedagog.1`, `s.särskilt-stöd.1`, `s.ämnesplan.1`, `s.antagning.1`
  - Universitet & högskola: `s.utexaminerad.1`
  - Studieteknik: `s.förförståelse.1`, `s.visualisera.1`, `s.studiesvårighet.1`
  - Pedagogik: `s.pedagogik.1`, `s.lärande.1`, `s.förmåga.1`, `s.respons.1`, `s.förutsättning.2`
  - Forskning & akademi: `s.vetenskaplig.1`, `s.publikation.1`, `s.källkritisk.1`, `s.referera.1`, `s.empirisk.1`, `s.etisk.1`, `s.fabricera.1`, `s.tes.1`, `s.motargument.1`
  - Utbildningssystem i världen: `s.skolgång.1`, `s.yrkeshögskola.1`
  - *visualisera* förväxlades med *inre bild*, *antagning* med *urval* (av sökande), *respons* med *kamratrespons*/*återkoppling* och *bedömning* med *bedöma*. Produktägaren kan överväga synonymmarkering och ett nytt test.
- **Från 0.34 (9 ord):**
  - Stadens platser: `s.trivsam.1`
  - Offentliga byggnader: `s.myndighet.1`
  - Samhällsservice: `s.medborgarservice.1`
  - Bostads- & stadsplanering: `s.framkomlighet.1`
  - Befolkning & migration: `s.vara-skriven.1`, `s.befolkning.1`, `s.utflyttning.2`, `s.ursprungsland.2`
  - Civilsamhälle: `s.välgörenhet.1`
  - *trivsam* förväxlades med *mysig*/*charmig*, *myndighet* med *statlig*/*förvaltning*, *medborgarservice* med *kontaktcenter*/*medborgarkontor*, *framkomlighet* med *busskörfält*/*trafikflöde*, *befolkning* med *folkmängd*/*invånarantal*, *utflyttning* (från en ort) med *avfolkning*/*urbanisering*, *ursprungsland* med *hemland* och *välgörenhet* med *välgörenhetsorganisation*/*skänka*. Produktägaren kan överväga synonymmarkering och ett nytt test.
- **Från 0.35 (25 ord):**
  - Nyhetsmedier: `s.sensation.1`
  - Källkritik: `s.värdeladdad.1`, `s.faktagranskning.1`, `s.myt.1`, `s.ensidig.1`, `s.vinkla.1`, `s.framställa.1`, `s.tendens.1`
  - Sociala medier: `s.trend.1`, `s.sprida-sig.1`
  - Reklam & påverkan: `s.image.1`
  - Debatt & opinion: `s.ledarskribent.1`, `s.argumentation.1`, `s.ta-debatten.1`, `s.saklighet.1`, `s.polariserad.1`
  - Yttrandefrihet & medierätt: `s.inskränkning.1`, `s.åsiktsfrihet.1`, `s.pressfrihet.1`, `s.ensamansvar.1`, `s.upphovsrätt.1`, `s.förtal.1`, `s.förtala.1`, `s.nedsättande.1`, `s.kränkande.1`
  - Många förväxlades med ett närliggande ord ur samma ordfamilj eller en nära synonym: *saklighet/saklig*, *förtal/förtala*, *kränkande/kränka*, *nedsättande/kränkande*, *pressfrihet/tryckfrihet/meddelarfrihet*, *åsiktsfrihet/yttrandefrihet*, *ensamansvar/ansvarig utgivare*, *polariserad/splittrad/läger*, *vinkla/ensidig/framställa*, *trend/trendig/sprida sig/viral*, *sensation/nyhetsvärde*. Från 0.35 underkändes också medelsäkra rätta svar när granskaren uttryckligen skrev att två ord förväxlas. Produktägaren kan överväga synonymmarkering och ett nytt test.
- **Från 0.36 (20 ord):**
  - Antiken: `s.ofri.1`, `s.ståthållare.1`, `s.kejsardöme.1`, `s.klassisk.2`
  - Medeltiden: `s.helig.1`
  - Tidigmodern tid: `s.humanism.1`, `s.kolonialism.1`, `s.prakt.1`, `s.praktfull.1`
  - Revolutioner & industrialisering: `s.beskatta.1`, `s.facklig.1`, `s.socialdemokrati.1`
  - 1900-tal till nutid: `s.fascism.1`, `s.depression.1`, `s.nazism.1`, `s.folkmord.1`, `s.civil-olydnad.1`, `s.välfärdssamhälle.1`, `s.socialförsäkring.1`, `s.världsomspännande.1`
  - Förväxlingarna gällde mest närliggande begrepp: *fascism/nazism/diktator*, *välfärdssamhälle/välfärdsstat/folkhemmet*, *socialförsäkring/sjukförsäkring*, *prakt/praktfull/lyx*, *kejsardöme/rike/kejsare*, *ofri/slav*, *humanism/humanist*, *kolonialism/kolonialmakt*, *beskatta/skatt/tull*.
- **Från 0.37 (16 ord):**
  - Forntida krigföring: `s.beriden.1`, `s.befäl.1`, `s.taktik.1`
  - Medeltida slott & fästningar: `s.hålla-stånd.1`, `s.försvarsverk.1`, `s.befästa.1` (ord från den ursprungliga modulen *Medeltida borgar*)
  - Medeltida belägringar: `s.strategisk.1`, `s.övertag.1`, `s.isolerad.2`, `s.kringvärn.1`, `s.kapitulation.1`
  - Tidiga moderna arméer: `s.menig.1`, `s.segerrik.1`
  - Världskrigen: `s.offensiv.1`
  - Modern krigföring: `s.terrorism.1`, `s.krigets-lagar.1`
  - Förväxlingarna gällde mest närliggande ord: *beriden/ryttare/kavalleri*, *befäl/befälhavare*, *taktik/strategi/slagordning*, *kapitulation/kapitulera*, *kringvärn/cirkumvallation*, *menig/rekryt*, *segerrik/segrare*, *offensiv/genombrott*, *krigets lagar/folkrätt/konvention*.
- **Från 0.38 (17 ord):**
  - Religiösa grundbegrepp: `s.tro.1`, `s.from.1`, `s.bön.1`, `s.tillbe.1`, `s.högtidlighålla.1`
  - Kristendomens historia: `s.protestantisk.1`
  - Islamisk historia & kultur: `s.sunna.1`
  - Asiatiska religioner: `s.nirvana.1`, `s.theravadabuddhism.1`, `s.renhet.1`, `s.medmänsklighet.1`
  - Judendom & andra traditioner: `s.jiddisch.1`, `s.bud.2`, `s.animism.1`
  - Idéernas historia: `s.meningen-med-livet.1`, `s.existentiell.1`, `s.ateism.1`
  - Förväxlingarna gällde mest närliggande ord: *tro/tro på/troende/religiös/from*, *bön/be/mantra*, *tillbe/be/tacksamhet*, *protestantisk/reformation*, *renhet/rening*, *nirvana/återfödelse/upplysning*, *theravadabuddhism/riktning*, *bud/budord*, *animism/besjälad*, *meningen med livet/livsfråga/existentiell* och *ateism/ateist/agnostiker*.
- **Från 0.39 (48 ord):**
  - Filosofins grundord: `s.term.1`, `s.utsaga.1`, `s.otänkbar.1`, `s.tänka-sig.1`, `s.filosofisk.1`, `s.samtalsledare.1`
  - Kunskapsteori: `s.förmoda.1`, `s.tro.2`, `s.tvivla-på.1`, `s.skepticism.1`, `s.evidens.1`, `s.rättfärdiga.1`, `s.rättfärdigande.1`, `s.på-goda-grunder.1`, `s.hålla-för-sant.1`, `s.synsätt.1`, `s.gåta.1`
  - Etik & moral: `s.omoralisk.1`, `s.pliktetik.1`, `s.maxim.1`, `s.nytta.1`, `s.rättvisa.1`, `s.lika-möjligheter.1`
  - Politisk filosofi: `s.tvång.1`, `s.stat.1`, `s.lydnad.1`, `s.maktposition.1`, `s.individuell.1`, `s.fördelningsrättvisa.1`
  - Medvetande & identitet: `s.medvetenhet.1`, `s.inifrån.1`, `s.förnimmelse.1`, `s.handling.1`
  - Existens & verklighet: `s.finnas-till.1`, `s.existens.1`, `s.varande.1`, `s.väsen.1`, `s.nödvändigtvis.1`, `s.overklig.1`, `s.sken.1`, `s.idealism.1`, `s.ha-något-att-leva-för.1`, `s.meningslöshet.1`, `s.livsuppgift.1`, `s.hängivenhet.1`, `s.ändlighet.1`, `s.ond-tro.1`, `s.existentialism.1`
  - Abstrakta filosofiord var svåra att skilja från ord ur samma familj eller närliggande begrepp: *existens/existera/varande*, *sken/skenbar/skenet bedrar*, *ändlighet/ändlig/dödlig*, *rättvisa/jämlikhet/likabehandling*, *rättfärdiga/rättfärdigande/underbygga/välgrundad*, *tvång/tvinga/inskränka*, *stat/rättsstat*, *nytta/gynna*, *meningslöshet/tomhet/meningslös*, *idealism/inbillning*. Många underkändes för att granskaren svarade rätt men med låg säkerhet. Produktägaren kan överväga synonymmarkering och ett nytt test, eller andra visualiseringar än symbolbilder för de mest abstrakta orden.
- **Från 0.40 (14 ord):**
  - Arkeologins metoder: `s.arkeologisk.1`, `s.arkeologi.1`, `s.lösfynd.1`, `s.datering.1`, `s.tyda-på.1`
  - Historiska föremål: `s.skriftlig-källa.1`, `s.avsedd.1`, `s.funktion.1`
  - Museer & samlingar: `s.konservering.1`
  - Byggnadshistoria: `s.kulturhistorisk.1`
  - Historisk forskning: `s.förstahandsuppgift.1`, `s.tendentiös.1`, `s.historieskrivning.1`, `s.historiesyn.1`
  - Förväxlingarna gällde mest närliggande ord: *arkeologisk/arkeologi/arkeolog/utgrävning*, *datering/datera/absolut datering*, *tyda på/tolka/vittna om*, *skriftlig källa/urkund/tyda*, *funktion/rituell/avsedd*, *konservering/restaurera/bevara*, *kulturhistorisk/byggnadsminne/k-märkt*, *förstahandsuppgift/primärkälla*, *tendentiös/partisk*, *historieskrivning/historiesyn/historiker* och *historiesyn/perspektiv*. *tendentiös/partisk* och *förstahandsuppgift/primärkälla* ligger nära synonymer; produktägaren kan överväga synonymmarkering och ett nytt test.
- **Från 0.41 (18 ord):**
  - Nordens historia: `s.rikssamling.1`, `s.befrielsekrig.1`, `s.landvinning.1`, `s.representationsreform.1`, `s.neutralitetspolitik.1`
  - Östasiens historia: `s.shogunat.1`, `s.ståndssamhälle.1`, `s.kolonialstyre.1`, `s.folkrepublik.1`
  - Sydasiens historia: `s.civilisation.1`, `s.sanskrit.1`, `s.blomstra.1`, `s.storslagen.1`, `s.sultanat.1`
  - Mellanösterns historia: `s.expansion.1`, `s.mandat.2`
  - Afrikas historia: `s.indirekt-styre.1`
  - Amerikas & Oceaniens historia: `s.arbetsplikt.1`
  - Förväxlingarna gällde mest närliggande ord: *rikssamling/kungadöme*, *befrielsekrig/självständighet/uppror*, *landvinning/erövra*, *representationsreform/tvåkammarriksdag*, *neutralitetspolitik/neutralitet/alliansfri*, *shogunat/shogun*, *ståndssamhälle/stånd*, *kolonialstyre/ockupera/annektera*, *folkrepublik/kommunism/demokratisering*, *civilisation/flodkultur/citadell*, *sanskrit/helig skrift/hymn*, *blomstra/guldålder*, *storslagen/mausoleum*, *sultanat/sultan*, *expansion/erövring*, *mandat/ockupation/Nationernas förbund*, *indirekt styre/kolonialstyre* och *arbetsplikt/knutskrift/vägnät*. *befrielsekrig*, *civilisation* och *sultanat* används också av senare grupper och saknar bild där.
- **Från 0.42 (21 ord):**
  - Landskapets former: `s.sträcka-sig.1`, `s.vidsträckt.1`, `s.klippig.1`, `s.naturskön.1`
  - Bergarter & mineral: `s.sedimentär.1`, `s.metamorf.1`, `s.hårdhet.1`, `s.geologisk.1`
  - Jordens inre: `s.oceanisk.1`, `s.kontinental.1`, `s.tektonisk.1`, `s.plattektonik.1`, `s.vulkanisk.1`, `s.erosion.1`
  - Floder, sjöar & hav: `s.nedströms.1`, `s.mild.2`
  - Is & istider: `s.osorterad.1`
  - Mark & jordarter: `s.sandig.1`, `s.lerig.1`, `s.lucker.1`, `s.omkomma.1`
  - Förväxlingarna gällde mest adjektiv mot substantivet de bygger på eller närliggande processer: *sträcka sig/vidsträckt*, *klippig/stenstrand*, *naturskön/utsikt/orörd*, *sedimentär/avlagring*, *metamorf/gnejs/omvandla*, *hårdhet/densitet/hårdhetsskala*, *geologisk/geologi*, *oceanisk/havsbotten*, *kontinental/kontinent/tjocklek*, *tektonisk/plattektonik/plattgräns*, *vulkanisk/vulkan/lava*, *erosion/vittra*, *nedströms/uppströms*, *mild/klimat*, *osorterad/morän*, *sandig/sand*, *lerig/lera/kladdig*, *lucker/gräva/bördig* och *omkomma/olycka/katastrof*. *erosion* används också av senare grupper och saknar bild där.
- **Från 0.43 (30 ord):**
  - Vädrets vardagsord: `s.mulen.1`, `s.strålande.1`, `s.regnig.1`, `s.halt-adj.1`, `s.blåsig.1`, `s.dimmig.1`, `s.disig.1`, `s.hundkall.1`, `s.växlande-molnighet.1`
  - Atmosfären: `s.lufttryck.2`, `s.hektopascal.1`, `s.avdunstning.1`, `s.kondensation.1`, `s.relativ-luftfuktighet.1`
  - Nederbörd & moln: `s.uppklarnande.1`, `s.urladdning.1`, `s.frostig.1`, `s.tränga-undan.1`
  - Extremväder: `s.insnöad.1`, `s.hemberedskap.1`
  - Klimatzoner: `s.arid.1`, `s.sträng.2`, `s.polar.1`
  - Klimatförändringar: `s.uppvärmning.2`, `s.påverkan.2`, `s.global-uppvärmning.1`, `s.beräkna.1`, `s.självförstärkande.1`, `s.klimatmål.1`, `s.fossilfri.1`
  - Förväxlingarna gällde adjektiv mot substantiv/verb ur samma familj (*halt/halka*, *blåsig/blåst*, *dimmig/dimma*, *disig/dis*, *frostig/rimfrost*, *polar/polarområde*), substantiv mot verb (*avdunstning/avdunsta*, *kondensation/kondensera*, *beräkna/beräkning*) och nära synonymer (*mulen/gråväder*, *strålande/solig*, *hektopascal/lufttryck*, *hemberedskap/krisberedskap*, *insnöad/snödriva*, *global uppvärmning/uppvärmning/temperaturökning*, *självförstärkande/återkoppling*, *klimatmål/utsläppsminskning*, *fossilfri/fasa ut/förnybar*). Produktägaren kan överväga synonymmarkering för några av paren.
- **Från 0.44 (14 ord):**
  - Däggdjur: `s.parningstid.1`, `s.anpassning.2`, `s.varmblodig.1`
  - Fåglar: `s.övervintra.1`, `s.flyttande.1`, `s.flygfärdig.1`
  - Kräldjur & groddjur: `s.frostfri.1`, `s.trög.1`, `s.yttre-befruktning.1`
  - Djurens beteenden: `s.revirhävdande.1`, `s.monogam.1`, `s.dominant.1`, `s.migration.2`, `s.instinkt.1`
  - Förväxlingarna gällde mest närliggande ord: *övervintra/vinterkvarter/stannfågel*, *flyttande/flyttfågel/flytta*, *flygfärdig/lämna boet*, *frostfri/övervintringsplats*, *trög/stel*, *yttre befruktning/befruktning/grodrom*, *revirhävdande/revirsång/markera revir/hotfull*, *monogam/trogen*, *dominant/ledare*, *migration/migrera/vandra* och *instinkt/medfödd*. Senare grupper som återanvänder orden (t.ex. *övervintra* i Kräldjur) saknar bild där också.
- **Från 0.45 (13 ord):**
  - Träd & buskar: `s.frodas.1`
  - Blommor & örter: `s.släkte.1`, `s.växtfamilj.1`
  - Gräs & mossor: `s.indikatorart.1`
  - Svampriket: `s.förväxlingsrisk.1`, `s.livsfarlig.1`, `s.murken.1`, `s.vid-minsta-tvekan.1`, `s.tumregel.1`
  - Växters liv: `s.fosfor.1`, `s.förökning.1`, `s.avge.1`
  - Trädgård & odling: `s.hålla-sig.1`
  - Förväxlingarna gällde mest närliggande ord: *frodas/tillväxt*, *släkte/växtfamilj/art*, *indikatorart/skägglav/luftförorening*, *förväxlingsrisk/förväxla*, *livsfarlig/dödlig/giftig*, *murken/röta/förmultna*, *vid minsta tvekan/ta det säkra före det osäkra*, *fosfor/växtnäring/kalium*, *förökning/föröka sig/fortplantning*, *avge/avdunsta* och *hålla sig/förvara/lagra*. *livsfarlig* och *dödlig* är markerade som synonymer; *dödlig* (.2) har bild.
- **Från 0.46 (43 ord):**
  - Ekosystemets grunder: `s.talrik.1`, `s.förekomma.1`, `s.rubba.1`, `s.samexistera.1`
  - Biologisk mångfald: `s.artfattig.1`, `s.artrikedom.1`, `s.ärva.2`, `s.genetisk.1`, `s.nära-hotad.1`, `s.hotad.1`, `s.dö-ut.1`, `s.utrota.1`, `s.främmande-art.1`, `s.invasiv.1`, `s.inhemsk.1`, `s.naturvård.1`, `s.naturhänsyn.1`, `s.återställa.1`
  - Föroreningar & avfall: `s.förorenad.1`, `s.nedbrytbar.1`, `s.materialåtervinning.1`
  - Hållbar resursanvändning: `s.bioenergi.1`, `s.ta-slut.1`, `s.outtömlig.1`, `s.knapphet.1`, `s.klimatavtryck.1`, `s.livscykel.2`
  - Miljöpolitik & samhälle: `s.miljökvalitetsmål.1`, `s.indikator.1`, `s.föreläggande.1`, `s.försiktighetsprincip.1`, `s.vite.1`, `s.miljösanktionsavgift.1`, `s.skyddat-område.1`, `s.inrätta.1`, `s.skötselplan.1`, `s.utsläppshandel.1`, `s.utsläppsrätt.1`, `s.miljökonsekvensbeskrivning.1`, `s.miljökonsekvensbedömning.1`, `s.sakägare.1`, `s.exploatör.1`, `s.miljömärkning.1`
  - Förväxlingarna gällde nästan alltid närliggande ord i samma modul: *talrik/population/bestånd*, *rubba/jämvikt*, *artrikedom/artrik/mångfald*, *artfattig/monokultur*, *hotad/nära hotad/utrotningshotad/sårbar*, *dö ut/utrota/utdöd*, *främmande art/invasiv/inhemsk/införa*, *återställa/restaurering*, *förorenad/vattenförorening*, *nedbrytbar/bryta ner*, *materialåtervinning/återvunnen*, *ta slut/förbruka*, *outtömlig/förnybar*, *bioenergi/biobränsle*, *klimatavtryck/ekologiskt fotavtryck*, *livscykel/från vagga till grav*, *miljömål/miljökvalitetsmål*, *vite/föreläggande/miljösanktionsavgift*, *utsläppsrätt/utsläppshandel*, *miljökonsekvensbedömning/-beskrivning*, *exploatör/exploatera*, *miljömärkning/miljömärkt*. Ordpar som *utsläppsrätt/utsläppshandel* och *vite/föreläggande* är inte synonymer; de behöver andra visualiseringar (t.ex. animationer) eller en annan ordfördelning mellan modulerna.
- **Från 0.47 (8 ord):**
  - Kartor & orientering: `s.sydlig.1`, `s.i-verkligheten.1`, `s.position.1`
  - Europa: `s.gränsa-till.1`, `s.dvärgstat.1`, `s.areal.1`, `s.regeringssäte.1`, `s.nordbo.1`
  - Förväxlingarna: *sydlig/söderläge*, *i verkligheten/motsvara/skala*, *position/koordinat/du är här*, *gränsa till/gräns/grannland*, *dvärgstat/furstendöme/enklav*, *areal/kvadratkilometer*, *regeringssäte/huvudstad* och *nordbo/nordisk*.
- **Från 0.48 (46 ord):**
  - Tal & räkning: `s.rimlighet.1`, `s.delbar.2`, `s.storleksordning.1`, `s.addition.1`, `s.subtraktion.1`, `s.överslag.1`
  - Bråk & decimaler: `s.avrundning.1`, `s.procentuell.1`, `s.närmevärde.1`, `s.procent.1`, `s.andel.2`, `s.ökning.1`, `s.minskning.1`
  - Algebraiska uttryck: `s.storhet.1`, `s.variera.1`, `s.potens.1`, `s.ordningsföljd.1`, `s.isolera.2`, `s.olikhet.1`
  - Geometrins grundformer: `s.symmetrilinje.1`, `s.rektangulär.1`, `s.rund.1`, `s.area.1`, `s.kvadratdecimeter.1`
  - Funktioner & grafer: `s.funktion.2`, `s.bero-på.2`, `s.linjär.2`, `s.i-takt-med.1`, `s.samband.1`, `s.proportionalitet.1`
  - Statistikens grunder: `s.data.1`, `s.datamängd.1`, `s.i-tabellform.1`, `s.föra-in.1`, `s.lägesmått.1`, `s.förekomma.2`, `s.korrelation.1`, `s.relativ-frekvens.1`, `s.jämnt-fördelad.1`, `s.i-genomsnitt.1`, `s.skilja-sig-åt.1`, `s.mittersta.1`, `s.spridningsmått.1`, `s.spridning.2`, `s.utspridd.1`, `s.population.2`
  - Förväxlingarna: *addition/lägga ihop*, *subtraktion/dra ifrån*, *överslag/uppskattning*, *delbar/delare*, *storleksordning/tiopotens*, *rimlighet/rimlig*, *avrundning/avrunda*, *närmevärde/avrunda*, *procent/procentform*, *andel/majoritet*, *ökning/fördubbla*, *minskning/halvera*, *storhet/enhet*, *variera/rörlig*, *potens/exponent*, *ordningsföljd/steg för steg*, *isolera/flytta över*, *olikhet/olikhetstecken*, *symmetrilinje/symmetrisk*, *rektangulär/rektangel*, *rund/cirkel*, *area/sammansatt figur*, *kvadratdecimeter/kvadratcentimeter*, *linjär/rak*, *samband/i takt med/proportionalitet*, *data/datamängd*, *median/mittersta*, *spridning/utspridd*, *variationsbredd/spridningsmått*, *korrelation/orsakssamband*. Granskaren valde ofta rätt ord men med medelsäkerhet och nämnde synonymen som lika bra; *addition*, *subtraktion* och *procent* kan produktägaren välja att godkänna ändå.
- **Från 0.49 (41 ord):**
  - Analys & derivata: `s.derivata.1`, `s.derivera.1`, `s.förändringshastighet.1`, `s.extremvärde.2`, `s.tangeringspunkt.1`
  - Integraler & differentialekvationer: `s.primitiv-funktion.1`, `s.integrationskonstant.1`, `s.tillryggalagd.1`, `s.begynnelsevillkor.1`
  - Linjär algebra: `s.vektor.1`, `s.nollvektor.1`, `s.komponent.1`, `s.substitutionsmetod.1`, `s.egenvärde.1`
  - Sannolikhetsteori: `s.slumpförsök.1`, `s.osannolik.1`, `s.komplementhändelse.1`, `s.permutation.1`, `s.kombinatorik.1`, `s.sannolikhetsfördelning.1`, `s.väntevärde.1`, `s.varians.1`
  - Diskret matematik: `s.implikation.1`, `s.omvändning.1`, `s.motsägelsebevis.1`, `s.direkt-bevis.1`, `s.axiom.1`, `s.graf.2`, `s.träd.2`, `s.sökning.1`, `s.föregående.1`, `s.komplexitet.1`
  - Matematikens specialområden: `s.deformera.1`, `s.exakt.1`, `s.noggrannhet.2`, `s.numerisk.1`, `s.startvärde.1`, `s.målfunktion.1`, `s.chiffer.1`, `s.kryptografi.1`, `s.öppen-nyckel.1`
  - Förväxlingarna: *derivata/derivera/lutning*, *tangeringspunkt/tangent/nudda*, *primitiv funktion/integrera*, *integrationskonstant/konstant*, *tillryggalagd/sträcka*, *begynnelsevillkor/villkor*, *vektor/riktning*, *komponent/koordinat*, *egenvärde/faktor*, *osannolik/sannolikhet*, *komplementhändelse/händelse*, *permutation/ordningsföljd*, *väntevärde/medelvärde*, *varians/spridning*, *implikation/tillräckligt villkor*, *omvändning/nödvändigt villkor*, *motsägelsebevis/motsägelse*, *graf/nätverk*, *träd/hierarki*, *sökning/linjär sökning*, *deformera/töja*, *exakt/noggrannhet*, *chiffer/kryptera/kryptografi*, *målfunktion/maximera*. Högskolematematikens fackord ligger ofta i par (verb/substantiv, begrepp/metod) som inte går att skilja i en stillbild.
- **Från 0.50 (32 ord):**
  - Mekanik: `s.förflyttning.1`, `s.rörelse.1`, `s.momentanhastighet.1`, `s.retardation.1`, `s.newton.1`, `s.motkraft.1`, `s.energiomvandling.1`, `s.vridmoment.1`
  - Vågor & ljud: `s.svängning.1`, `s.hertz.1`, `s.periodisk.1`
  - Ljus & optik: `s.reflektion.2`, `s.förstoring.1`, `s.samlingslins.1`, `s.spridningslins.1`
  - Elektricitet & magnetism: `s.resistans.1`
  - Värmelära & termodynamik: `s.smältpunkt.1`, `s.tillföra.1`, `s.värmeförlust.1`, `s.termodynamik.1`, `s.inre-energi.1`, `s.energiprincipen.1`, `s.entropi.1`, `s.diffusion.1`, `s.oordning.1`
  - Modern fysik: `s.foton.1`, `s.kvantum.1`, `s.kvanttal.1`, `s.spektrallinje.1`, `s.sönderfall.1`, `s.kvantmekanik.1`, `s.partikelstråle.1`
  - Förväxlingarna: *retardation/bromsa*, *newton/tyngd*, *vridmoment/hävstång*, *energiomvandling/omvandla*, *svängning/vibration*, *hertz/frekvens*, *periodisk/regelbunden*, *reflektion/reflektera*, *förstoring/lupp*, *samlings-/spridningslins/konvex/konkav*, *resistans/motstånd*, *smältpunkt/smälta*, *värmeförlust/värmeöverföring*, *inre energi/värme*, *energiprincipen/verkningsgrad*, *oordning/kaos*, *diffusion/blandning*, *foton/kvantum*, *kvanttal/elektronskal*, *spektrallinje/spektrum*, *sönderfall/alfastrålning*, *partikelstråle/partikelaccelerator*.
- **Från 0.51 (27 ord):**
  - Atomer & periodiska systemet: `s.nukleon.1`, `s.reaktiv.1`, `s.deuterium.1`, `s.instabil.2`, `s.fullt-skal.1`, `s.halogen.1`
  - Molekyler & kemiska bindningar: `s.positiv-jon.1`, `s.negativ-jon.1`, `s.laddad.1`, `s.leda-ström.1`, `s.vinklad.1`, `s.bindningsvinkel.1`, `s.flyktig.1`, `s.intermolekylär-kraft.1`, `s.van-der-Waals-kraft.1`, `s.gitter.1`, `s.fettlöslig.1`
  - Kemiska reaktioner: `s.kemisk-förändring.1`, `s.bildas.1`, `s.oxidation.1`, `s.reaktionshastighet.1`
  - Syror, baser & lösningar: `s.pH-värde.1`, `s.försurning.1`, `s.ta-ut-varandra.2`, `s.lösning.3`, `s.koncentration.2`
  - Organisk kemi: `s.förtvålning.1`
  - Förväxlingarna: *positiv/negativ jon/jon*, *laddad/laddning*, *leda ström/ledare*, *vinklad/bindningsvinkel/vinkel*, *flyktig/avdunsta*, *intermolekylär kraft/van der Waals-kraft*, *gitter/kristall*, *fettlöslig/lösa sig*, *kemisk förändring/reaktion*, *oxidation/rost*, *reaktionshastighet/hastighet*, *nukleon/atomkärna*, *reaktiv/reagera*, *deuterium/isotop*, *instabil/sönderfall*, *fullt skal/elektronskal*, *halogen/klor/grupp*, *pH-värde/pH-mätare*, *försurning/surt regn*, *lösning/lösa sig*, *koncentration/koncentrerad*, *förtvålning/tvål*. Granskaren nämnde ofta huvudordet i en sammansättning (*jon*, *vinkel*, *hastighet*) som lika bra.
- **Från 0.52 (11 ord):**
  - Cellbiologi: `s.passiv-transport.1`
  - Genetik & arv: `s.kopieringsfel.1`, `s.genuttryck.1`, `s.genmodifierad.1`, `s.skadlig.1`
  - Evolution: `s.gren.2`, `s.sexuell-selektion.1`, `s.förstenad.1`, `s.ståtlig.1`
  - Ekologi & organismvärlden: `s.tertiärkonsument.1`, `s.massförökning.1`
  - Förväxlingarna: *passiv transport/transportprotein*, *kopieringsfel/mutation*, *genuttryck/slå på*, *genmodifierad/genteknik*, *skadlig/miljögift*, *gren/stamträd*, *sexuell selektion/uppvaktning*, *förstenad/fossil*, *ståtlig/hane*, *tertiärkonsument/topprovdjur*, *massförökning/lämmelår*.
- **Från 0.53 (8 ord):**
  - Solens system: `s.livlös.1`, `s.kollisionskurs.1`
  - Himlens rörelser: `s.månförmörkelse.1`, `s.vårpunkt.1`, `s.soltid.1`
  - Galaxer & universum: `s.mörk-energi.1`, `s.blåförskjutning.1`
  - Astronomins metoder: `s.spektroskopi.1`
  - Förväxlingarna: *livlös/den röda planeten*, *kollisionskurs/kollision/jordnära*, *månförmörkelse/kärnskugga*, *vårpunkt/vårdagjämning*, *soltid/solur*, *mörk energi/expandera/accelerera*, *blåförskjutning/dopplereffekt*, *spektroskopi/spektrum/streckkod*.
- (Tidigare i `VISUAL_MISSING_AFTER_BLIND_TEST`, nu borttagen.)


## 0.55 (Datorer & internet)

Dessa 17 ord underkändes två gånger i 0.54-produktionen och ritades om för hand i 0.55. Alla utom *mobildata* klarade matchningstestet.

- Förväxlingarna i blindtesten: *prestanda/uppgradera*, *lagringsutrymme/rymma*, *testversion/licens*, *operativsystem/drivrutin*, *cache/lagra*, *ligga nere/driftstörning*, *driftstörning/krångla*, *uppkopplad/uppkoppling*, *svarstid/fördröjning*, *bandbredd/kapacitet*, *täckning/räckvidd*, *tappa uppkopplingen/avbrott*, *VPN/kryptera*, *byta lösenord/lösenord*, *säkerhetsrisk/sårbarhet*, *frånvaromeddelande/skicka vidare*.
- Det som fungerade för hand: kapplöpning (snabb dator mot snigel) för *prestanda*; tomt utrymme i en mobil där ett nytt foto får plats för *lagringsutrymme*; skyltfönster med neddragen rullgardin för *ligga nere* och flera mobiler som hackar samtidigt för *driftstörning*; motorväg med datapaket som bilar för *bandbredd*; karta med färgat område och vita fläckar för *täckning*; solstol och automatiskt svarskuvert för *frånvaromeddelande*.
- *Mobildata* förväxlades med *surfzon* och *surf* också i två handritade försök (mobil med pilar, buss med GB-räknare). Ordet är inte längre modulord i *Mobildata* (produktägarens beslut 0.55).

## B5 – manuellt spår, Avancerad matematik (2026-11-20)

58 ord ritades för hand i `src/ui/wordArt/manualMath.ts` (prefix `manm.`). Notation som ledtråd (f′, ≈, =, ⇒, +C, σ², E(X)), kontrastpar i samma layout och bildserier. 54 klarade matchningstestet (medelsvar med rätt bild godtogs när granskaren inte skrev att en annan bild passade lika bra, som för `accept.py`). Arken för rörliga motiv visade först startbilden i stället för affischbilden; `art-blind.ts` visar nu `posterOf`, och de orden fick en ny första omgång.

**Till produktägaren** – fyra ord klarade inte två omgångar. Motiven finns kvar i filen men är inte registrerade, och planen har `status: "manual"`:
- `s.egenvärde.1` (`manm.egenvärde`, v och 3v på samma linje med ×3 och λ): förväxlas med *karakteristisk ekvation*, som visar λ = 2, λ = 3. Egenvärdet är ett tal, och modulens andra bilder visar också λ eller skalning.
- `s.numerisk.1` (`manm.numerisk`, staplar under en kurva ≈ 2,67 i stället för en överstruken formel): förväxlas med *iteration*, *miniräknare* och *startvärde*. ”Med siffror i stället för en formel” är ett sätt att räkna och syns inte i en enda bild.
- `s.slumpförsök.1` (`manm.slumpförsök`, tärning, mynt och lyckohjul med frågetecken i en ram): förväxlas med *tärningskast*. Modulen har sju bilder av olika slumpförsök, så överbegreppet sticker inte ut.
- `s.sökning.1` (`manm.sökning`, förstoringsglas över lista, bok och skärm): förväxlas med *sökmotor*, *linjär sökning* och *binär sökning*. Samma problem med överbegrepp.
Förslag: låt de fyra ha en enkel symbolbild som godkänns utan blindtest (`waiver`), eller ta bort dem som modulord i de moduler där ett mer specifikt ord redan bär betydelsen.

## B5 – manuellt spår, Filosofi & etik (2026-11-20)

59 ord ritades för hand i `src/ui/wordArt/manualPhilosophy.ts` (prefix `manf.`). 41 klarade matchningstestet. Fem av dem räknas som synonymer, eftersom paren är äkta synonymer och nu är markerade som förväxlingsbara (`confusableWith`): *avsiktlig/med avsikt*, *finnas till/existera*, *på goda grunder/välgrundad*, *plikt/skyldighet* och *ändlighet/ändlig*.

**Till produktägaren** – 18 ord klarade inte två omgångar. Motiven finns kvar i filen och planen har `status: "manual"`. Orsaken är nästan alltid densamma: modulerna i Filosofi & etik har redan bilder för ett närliggande ord, ofta samma begrepp i en annan ordklass eller som ett specifikt exempel, och granskaren valde den bilden.
- `s.tro.2` → *villfarelse* och *tro på* (tankebubbla med bock)
- `s.empirisk.1` → *empirism* (sinnen → kunskap)
- `s.tvivla-på.1` → *skeptisk*
- `s.evidens.1` → *bevisning*
- `s.rättfärdiga.1` och `s.rättfärdigande.1` → *skäl* och varandra (verb och substantiv går inte att skilja i en bild)
- `s.omoralisk.1` → *ondska*
- `s.lika-möjligheter.1` → *likabehandling*
- `s.tvång.1` → *påtvinga* och *tvinga*
- `s.förnimmelse.1` → *smärta* och *perception*
- `s.medvetenhet.1` → *medvetande*
- `s.handling.1` → *med flit* (överbegrepp bland specifika handlingar)
- `s.varande.1` → *existera*, *existens*
- `s.sken.1` → *skenet bedrar*, *sinnesvilla*
- `s.livsuppgift.1` → *livsmål*
- `s.ha-något-att-leva-för.1` → *tacksamhet* och andra hjärtbilder
- `s.existentialism.1` → *existensen föregår essensen*
- `s.ond-tro.1` → *ångest* och *spela en roll*
Förslag: produktägaren avgör om paren ska räknas som synonymer (`conf.py`), om det specifikare ordet räcker som modulord, eller om de abstraktaste orden (*varande*, *handling*, *existentialism*) får en symbolbild med `waiver`.

### Produktägarens beslut (2026-11-21)

Alla tre förslagen är godkända och genomförda för de 22 orden:
- **Synonymer** (`confusableWith`, resultat `synonym`): *empirisk/empirism*, *tvivla på/skeptisk*, *evidens/bevisning*, *lika möjligheter/likabehandling*, *tvång/påtvinga/tvinga*, *medvetenhet/medvetande*, *varande/existera*, *sken/skenet bedrar*, *livsuppgift/livsmål* och *existentialism/existensen föregår essensen*.
- **Undantag** (`blindTest.result: "waived"` med skäl, bara för symbolbilder utan bildövning): *tro* (`s.tro.2`), *rättfärdiga*, *rättfärdigande*, *omoralisk*, *förnimmelse*, *handling*, *ha något att leva för*, *ond tro*, *egenvärde*, *numerisk*, *slumpförsök* och *sökning*.
- **Det specifikare ordet som modulord**: inget ord togs bort ur sin modul. Undantaget täcker samma fall utan att ändra modulerna eller elevernas repetitionsdata.

## 0.56 – Programmering & artificiell intelligens

- **Underkända i första omgången, godkända omritade i andra:** *undantag*, *ramverk*, *modul*, *API*, *auktorisering*, *produktionsmiljö*, *översikt*, *statistisk* (punktmoln med trendlinje lästes som regression; nu histogram med klockkurva, folkmassa och %) och *stil* (samma träd i tre stilar förväxlades med *motiv* (`s.motiv.2`, samma motiv i olika stilar); nu samma scen i akvarell med pensel och som linjeteckning med blyerts).
- **Manuellt spår:** *kvadratisk* godkänd ("2× fler → 4× mer arbete").
- **Underkänd också i det manuella spåret:** *programmering* (`s.programmering.1`). Omgång 1 och 2 förväxlades med *programmerare*; den handritade bilden (veckoschema med programmeringslektionen ringad) förväxlades med *programmerare*/*koda*. Ämnet är svårt att skilja från handlingen och personen. Ordet är borttaget som modulord (produktägaren lät integratören avgöra 2026-11-21; samma lösning som *mobildata* i 0.55).

## 0.57 – Elektronik & energi

Alla 39 symbolbilder godkändes i första omgången. Granskaren nämnde närliggande bilder (bevakas vid omarbetning):
- *elinstallation* (kopplingsschema) ↔ elektriker med certifikat; *strömförande* ↔ spänningsprovare vid uttag
- *transformatorstation* ↔ *nätstation* (skillnaden är storleken); *synkron* ↔ rytm; *mörklagd* ↔ mörkt hus med blixt
- *vattenburen* ↔ värmesystem med rör; *energitjuv* ↔ tv i standby
- *signal* ↔ mätdata till skärm; *börvärde* ↔ termometrar med referenslinje; *styrsystem* ↔ kontrollrum; *precision* ↔ gripklo med ägg; *stabil* ↔ balansvåg

## 0.58 – Maskiner & tillverkning

- **Omritad i omgång 2:** *korrosion* (rostfläckar på plåt förväxlades med *rost*; nu tre metaller – järn, koppar, aluminium – som angrips av regn och salt, med en frisk metallbit som kontrast).
- **Synonympar:** *additiv tillverkning* ↔ *3D-utskrift* (`conf.py`), äkta synonymer.
- **Godkända men nära andra bilder (bevakas):** *slak* ↔ *hoppa av*; *noggrann* ↔ "mät två gånger"; *slät* ↔ *blank*; *hård* (läses som slagtest), *seg* ↔ *formbar*, *eldfast* ↔ brännugn, *lätt* ↔ glas/fjäder/sten, *hållfasthet* ↔ dragprov/bro; *defekt* ↔ *spricka*, *kvalitetssäkring* ↔ kvalitetskontroll på band; *skalenlig* ↔ skala-bilder, *plus minus*/*tolerans* ↔ ±-intervall, *revision* ↔ appuppdatering.
