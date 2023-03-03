import { Language } from '@prisma/client';
import { cache } from 'react';

import en from '../../translations/en.json';
export type TranslationId = keyof typeof en;

const dictionaries: Record<Exclude<Language, 'en'>, () => Promise<Partial<Record<TranslationId, string>>>> = {
  de: () => import('../../translations/de.json').then((module) => module.default),
  es: () => import('../../translations/es.json').then((module) => module.default),
  fr: () => import('../../translations/fr.json').then((module) => module.default),
};

const getDictionary = cache(async (language: Language): Promise<Record<TranslationId, string>> => {
  if(language === 'en') {
    return en;
  }

  const dict = await dictionaries[language]();

  return { ...en, ...dict };
});

export async function getTranslate(language: Language) {
  const messages = await getDictionary(language);

  return (id: TranslationId) => {
    return messages[id];
  };
}

export async function translate(language: Language, id: TranslationId) {
  const messages = await getDictionary(language);

  return messages[id] ?? '[Missing translation: ' + id + ']';
}
