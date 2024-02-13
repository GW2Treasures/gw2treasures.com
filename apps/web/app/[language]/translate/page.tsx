import { PageLayout } from '@/components/Layout/PageLayout';
import { type TranslationId } from '@/lib/translate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { TranslationEditor } from './translation-editor';

import de from '../../../translations/de.json';
import en from '../../../translations/en.json';
import es from '../../../translations/es.json';
import fr from '../../../translations/fr.json';

import deLegacy from '../../../translations/legacy/de.json';
import enLegacy from '../../../translations/legacy/en.json';
import esLegacy from '../../../translations/legacy/es.json';
import frLegacy from '../../../translations/legacy/fr.json';

const dictionaries = { de, en, es, fr };
const legacyDictionaries = { de: deLegacy, en: enLegacy, es: esLegacy, fr: frLegacy };

export default function TranslatePage() {
  const keys = Object.keys(dictionaries.en) as TranslationId[];

  return (
    <PageLayout>
      <Headline id="translations">Translations</Headline>

      <TranslationEditor dictionaries={dictionaries} legacyDictionaries={legacyDictionaries}/>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Translate'
};
