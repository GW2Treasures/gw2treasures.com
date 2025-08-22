import 'server-only';
import { Language } from '@gw2treasures/database';

import de from '../translations/de.json';
import en from '../translations/en.json';
import es from '../translations/es.json';
import fr from '../translations/fr.json';
import { headers } from 'next/headers';
import { unstable_rootParams } from 'next/server';

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

export async function getLanguage(): Promise<Language> {
  // TODO: replace with `next/rootParams`
  const { language } = await unstable_rootParams();

  return isValidLanguage(language)
    ? language
    : getFallbackLanguageFromHeaders();
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
