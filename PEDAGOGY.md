# Pedagogik

Swechan är primärt ett **ordförrådsprogram** för en japansktalande vuxen. Grammatik behandlas bara i den mån den behövs för att förstå, böja och använda orden.

Nedan skiljs tydligt mellan **forskningsstödda principer** och **designval/experimentella funktioner**. Referenserna är översiktliga; de är inte en fullständig litteraturgenomgång.

## Forskningsstödda principer och hur de är implementerade

| Princip | Stöd (urval) | Implementation |
|---|---|---|
| **Aktiv framplockning** (retrieval practice) | Roediger & Karpicke (2006); Karpicke & Roediger (2008) | Nästan alla moment kräver att man plockar fram svaret (val, skrivning, böjning) i stället för att bara läsa. |
| **Utspridd repetition** (spacing) | Cepeda m.fl. (2006), metaanalys | FSRS schemalägger varje kort individuellt utifrån svarshistorik (`repetition/`). |
| **Separata aspekter av ordkunskap** (form, betydelse, användning; receptiv vs produktiv) | Nation (2013), *Learning Vocabulary in Another Language* | Separata kort för betydelse, stavning och böjning; aktiva vs passiva ord. |
| **Ord i meningsfulla sammanhang** | Nation (2013); Webb & Nation (2017) | Exempelmeningar, kontextövningar, sammanhängande lästext där alla målord förekommer. |
| **Hög textförståelse för läsning** (~95–98 % kända ord) | Laufer (1989); Hu & Nation (2000) | Automatisk kontroll (`vocabularyCheck.ts`): lästexter och frågor får bara innehålla grundord, förkunskapsord och modulens målord. |
| **Begränsat definitionsordförråd** | Inlärarordböcker som *Longman* och *Oxford Advanced Learner's* definierar med ~2 000–3 000 vanliga ord; en definition med okända ord hjälper inte | Definitioner får bara använda grundordförrådet och redan inlärda ord; ordningen i modulen är inlärningsordningen. |
| **Återkoppling som hjälper vidare** | Hattie & Timperley (2007); Shute (2008) | Fel svar → uppmuntran + ledtråd, *inte* direkt facit; andra felet → rätt svar + förklaring. Specifik återkoppling för å/ä/ö, fel böjningsform och stavfel. |
| **Explicit undervisning av ord + förklaring av begrepp** | Nation (2013) | Ordintroduktion med definition på svenska och japanska; begreppsord (`concept: true`) får fylligare förklaring. |
| **Modersmålsstöd för förståelse** | Nation (2013) om L1-glosor för betydelse | Japanska glosor och förklaringar med furigana; frivilliga japanska grammatiknoteringar om skillnader (genus, bestämd form, partikelverb …). |

## Inlärningskedjor (0.2)

Moduler kan bygga på varandra (`prerequisites`). En förkunskapsmodul lär ut de ord som en svårare modul behöver för sina förklaringar och texter (t.ex. *Material och ämnen* → *Atomer och molekyler*). Kedjan är en **rekommendation**: *Dagens modul* följer den, men alla moduler kan öppnas när som helst (spec 12.4). Ord från tidigare moduler som förekommer i förklaringar går att trycka på för uppslagning.

## Designval (rimliga men inte direkt bevisade i just denna form)

- **15–20 ord per modul och förlopp per del** (0.3.1): användaren upplevde 25 ord och "32/122" som demoraliserande. Kortare moduler och en stapel som bara visar den aktuella delen (~5 ord) gör framstegen tydligare utan att minska antalet repetitioner per ord.

- **Batchar om 5 ord i steg 1** med introduktion → igenkänning → kontext/produktion → form/nyans. Varierade övningstyper och omkastad ordning så att samma ord inte kommer två gånger i rad (inspirerat av forskning om varierad övning/interleaving, men effekten för just ordinlärning i detta format är inte fastställd).
- **Initialt FSRS-betyg från steg 1**: första-försöket-rätt → *Good*, rätt efter ledtråd → *Hard*, fel → *Again*. Ord som inte övats i en dimension får *Hard*.
- **Max 2 försök** innan facit visas (konfigurerbart i `learnConfig.maxAttempts`), samt alltid möjlighet att välja "Visa svaret".
- **Tidig repetition** när färre än dagens mål är förfallna: FSRS får den verkliga förflutna tiden och ökar stabiliteten mindre än vid en repetition i tid (algoritmens egen hantering).
- **Svåra ord prioriteras** i urvalet (≥2 lapses, eller ≥40 % fel med minst 3 försök) – per dimension, så ett ord man stavar fel får fler stavningsuppgifter.
- **Sammanblandade ord**: om samma par blandas ihop ≥2 gånger visas en jämförelse.
- **Konversation med ChatGPT**: prompten styr mot naturligt samtal, självkorrigering, prioriterade korrigeringar och tålamod med pauser – i linje med forskning om interaktion och korrigerande feedback, men själva upplägget är inte utvärderat.

## Experimentella funktioner (motivation)

- **Streak, streak freeze och firande** är inspirerade av Duolingo. Forskningen om spelifiering i språkinlärning är blandad; streaks kan öka regelbundenhet men också skapa stress. Därför: inga skuldbeläggande meddelanden, freezes skyddar automatiskt, och missade dagar visas neutralt.
- **Avatar-reaktioner** är rent motiverande.

## Kunskapsnivåer (dokumenterade kriterier)

Implementerat i `src/learning/knowledge.ts`:

| Nivå | Kriterium |
|---|---|
| Introducerat | Ordet har mötts (introduktion eller övning). |
| Förstått | Minst ett betydelsesvar rätt på första försöket. |
| Aktivt behärskat | Förstått + stavning rätt på första försöket, och böjning rätt på första försöket om ordet har ett böjningskort. Gäller bara aktiva ord (passiva ord har inget stavningskort). |
| Långsiktigt befäst | Alla ordets kort har FSRS-stabilitet ≥ 21 dagar **och** ett rätt svar i repetition minst 21 dagar efter att ordet kom in i repetitionen. |

Swechan påstår aldrig att ett ord är "permanent inlärt". Statistiken är kumulativ (ett aktivt behärskat ord räknas också som förstått och introducerat).

## Repetitionstakt och repetitionsskuld

25 nya ord per dag ger på sikt fler förfallna kort än 25 repetitioner per dag hinner med. Swechan:
- visar **repetitionsskuld** (förfallna kort som inte ryms i dagens obligatoriska repetition),
- erbjuder **extra repetition** (10 åt gången, mest brådskande först),
- visar en **rekommendation** när skulden passerar en tröskel (`sessionConfig.debtWarningThreshold`),
- **minskar aldrig** antalet nya ord eller ändrar takten utan användarens godkännande.

## Nivåtestet

15 frågor (A1–C1 × betydelse/stavning/böjning). Uppskattningen = högsta nivå i en obruten följd nerifrån med ≥ 2/3 rätt. Används för modulrekommendation, nivå i samtalsprompten och kortare introduktion av ord minst två nivåer under uppskattningen. Det är **ingen validerad CEFR-bedömning**, vilket också sägs i appen.

## Referenser
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin*, 132(3).
- Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1).
- Hu, M., & Nation, I. S. P. (2000). Unknown vocabulary density and reading comprehension. *Reading in a Foreign Language*, 13(1).
- Karpicke, J. D., & Roediger, H. L. (2008). The critical importance of retrieval for learning. *Science*, 319.
- Laufer, B. (1989). What percentage of text-lexis is essential for comprehension?
- Nation, I. S. P. (2013). *Learning Vocabulary in Another Language* (2nd ed.). Cambridge University Press.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science*, 17(3).
- Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research*, 78(1).
- Webb, S., & Nation, P. (2017). *How Vocabulary Is Learned*. Oxford University Press.
- FSRS: open-spaced-repetition, https://github.com/open-spaced-repetition (ts-fsrs).
