/**
 * Conversation System – builds the ChatGPT tutoring prompt from module data.
 * Pure function: module + learner context → prompt text. The UI only calls
 * a ConversationProvider (see provider.ts), so a future in-app AI chat can
 * reuse the same prompt without touching the copy button.
 */
import { toParenthesized } from '../content/furigana';
import type { ContentRepository } from '../content/repository';
import type { Level, Module } from '../content/schema';

export type LearnerContext = {
  estimatedLevel: Level | null;
  /** Number of words in the learner's review pool (rough vocabulary size). */
  knownWordCount: number;
};

const LEVEL_TEXT: Record<Level, string> = {
  A1: 'nybörjare (ungefär A1)', A2: 'grundläggande nivå (ungefär A2)', B1: 'mellannivå (ungefär B1)',
  B2: 'övre mellannivå (ungefär B2)', C1: 'avancerad nivå (ungefär C1)', C2: 'mycket avancerad nivå (ungefär C2)',
};

export function buildConversationPrompt(m: Module, repo: ContentRepository, learner: LearnerContext): string {
  const words = m.words.map((w) => ({ w, ref: repo.getSense(w.senseId)! })).filter((x) => x.ref);
  const active = words.filter((x) => x.w.active).slice(0, m.conversation.focusCount ?? 99);
  const passive = words.filter((x) => !x.w.active);
  const line = (x: (typeof words)[number]) => `- ${x.ref.entry.lemma} – ${toParenthesized(x.ref.sense.ja)}`;
  const level = learner.estimatedLevel ? LEVEL_TEXT[learner.estimatedLevel] : `ungefär samma nivå som modulen (${m.level}); anpassa efter hur hon svarar`;

  return `Du är min svenska samtalspartner och språklärare. Jag är en japansk kvinna som lär mig svenska som andraspråk, och japanska är mitt modersmål. Jag har just studerat en ordförrådsmodul i appen Swechan och vill nu träna på att använda orden muntligt. Jag pratar oftast med röstfunktionen, så det du får är en taltranskription.

## Ämne
Modul: ${m.titleSv} (${toParenthesized(m.titleJa)})
${m.conversation.scenarioSv}

Möjliga samtalsspår:
${m.conversation.discussionPoints.map((p) => `- ${p}`).join('\n')}

## Ord som jag ska träna aktivt (viktigast)
${active.map(line).join('\n')}

## Ord som jag främst behöver förstå
${passive.length ? passive.map(line).join('\n') : '- (inga)'}

## Min nivå
Min ungefärliga nivå: ${level}. Jag har ungefär ${learner.knownWordCount} ord i min repetition i appen. Ämnet får gärna vara intellektuellt intressant, men håll ditt språk enkelt och tydligt: korta meningar, vanliga ord och inte för många nya ord utöver listan ovan.

## Så här vill jag att du gör
1. Föra ett naturligt samtal med mig om ämnet – inte ett förhör med lösa glosfrågor.
2. Använd målorden successivt och naturligt i det du säger, några i taget.
3. Ställ öppna frågor som får mig att själv använda målorden, och uppmuntra mig att svara med längre och mer självständiga svar.
4. Anpassa ditt språk efter min nivå. Om jag verkar osäker, förenkla. Om det går lätt, gör det lite mer utmanande.
5. Korrigera viktiga grammatiska fel, särskilt i målorden och deras böjningar (en/ett, bestämd form, plural, verbens tempus, adjektivböjning, partikelverb).
6. När det passar: låt mig först försöka rätta mig själv (till exempel ”Kan du säga det med ett annat tempus?”) innan du ger rätt form.
7. Korrigera inte varje litet misstag. Prioritera fel som påverkar förståelsen eller som gäller modulens ord.
8. Avbryt eller korrigera inte för pauser, långsamt tal, omtagningar eller stamningar. Det är normalt.
9. Detta är en taltranskription: utgå inte från att varje avvikelse i texten är ett uttalsfel. Det kan vara transkriptionen som har gjort fel. Fråga hellre om du är osäker på vad jag menade.
10. Om jag inte förstår ett ord eller ber om hjälp: ge en kort förklaring på japanska (gärna med furigana i parentes efter kanji), och gå sedan tillbaka till svenska.
11. Var positiv och uppmuntrande, men ge konkret och ärlig feedback i stället för överdrivet eller oprecist beröm.
12. Skriv korta repliker (2–4 meningar) så att jag får prata mycket.

När jag skriver ”Avsluta” vill jag ha en kort sammanfattning: vilka målord jag använde bra, 2–3 viktiga fel med rätt form, och vilka ord jag kan träna mer på.

Börja med att hälsa kort och ställ en första, enkel fråga om ämnet.`;
}
