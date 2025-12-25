import 'server-only';
import { Language } from '@gw2treasures/database';

import de from '../translations/de.json';
import en from '../translations/en.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';
import { headers } from 'next/headers';
import { language as getLanguageParam } from 'next/root-params';

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

export function getLanguage(): Promise<Language> {
  try {
    // for some reason await does not work with root params here (they will always return `undefined`)
    // so we just use good old `.then()` to check that the root param contains a valid language and fallback to headers if not
    return getLanguageParam().then((language: string) =>
      isValidLanguage(language)
        ? language
        : getFallbackLanguageFromHeaders()
    );
  } catch {
    // route handlers don't support root params yet and will throw when using `getLanguageParam`
    // we just fallback to getting the language from headers
    return getFallbackLanguageFromHeaders();
  }
}

async function getFallbackLanguageFromHeaders(): Promise<Language> {
  // get language from internal `x-gw2t-lang` header
  const language = (await headers()).get('x-gw2t-lang');

  if(isValidLanguage(language)) {
    return language;
  }

  throw new Error('Could not detect language');
}

function isValidLanguage(language: unknown): language is Language {
  return !!language && typeof language === 'string' && language in Language;
}
