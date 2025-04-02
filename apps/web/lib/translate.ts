import 'server-only';
import type { Language } from '@gw2treasures/database';

import de from '../translations/de.json';
import en from '../translations/en.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';
import { headers } from 'next/headers';

export type TranslationId = keyof typeof en;

export type TranslationSubset<T extends TranslationId> = Record<T, string>;

const dictionaryDe: Record<TranslationId, string> = { ...en, ...de };
const dictionaryEs: Record<TranslationId, string> = { ...en, ...es };
const dictionaryFr: Record<TranslationId, string> = { ...en, ...fr };

const getDictionary = (language: Language): Record<TranslationId, string> => {
  switch(language) {
    case 'de': return dictionaryDe;
    case 'en': return en;
    case 'es': return dictionaryEs;
    case 'fr': return dictionaryFr;
  }
};

export function getTranslate(language: Language) {
  const messages = getDictionary(language);

  return (id: TranslationId) => {
    return messages[id] ?? '[Missing translation: ' + id + ']';
  };
}

export function translate(id: TranslationId, language: Language) {
  const translate = getTranslate(language);

  return translate(id);
}

export function translateMany<T extends TranslationId>(ids: T[], language: Language): TranslationSubset<T> {
  const translate = getTranslate(language);

  return Object.fromEntries(ids.map((id) => [id, translate(id)])) as TranslationSubset<T>;
}

export async function getLanguage() {
  // TODO: use getRootParams once those are supported
  const language = (await headers()).get('x-gw2t-lang') as Language;

  return language;
}
