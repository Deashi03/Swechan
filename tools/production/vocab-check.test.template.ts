import { test } from 'vitest';
import { checkVocabulary, CoreVocabularyFile } from '../../src/content/vocabularyCheck';
import { toolingRepository } from '../../src/content/tooling';
import core from '../../src/content/data/core/coreVocabulary.json';
test('x', () => { for (const i of checkVocabulary(toolingRepository(), CoreVocabularyFile.parse(core))) console.log(i.where, '=>', i.unknown.join(', ')); });
