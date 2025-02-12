import type { Falsy } from '@gw2treasures/helper/is';
import { LocalizedObject } from './types';

type Names = {
  name_de: string,
  name_en: string,
  name_es: string,
  name_fr: string,
};

export function getNamesWithFallback({ de, en, es, fr }: LocalizedObject<{ name?: string }>, fallback?: string | Falsy): Names {
  return {
    name_de: de.name?.trim() ? de.name : (fallback || ''),
    name_en: en.name?.trim() ? en.name : (fallback || ''),
    name_es: es.name?.trim() ? es.name : (fallback || ''),
    name_fr: fr.name?.trim() ? fr.name : (fallback || ''),
  };
}
