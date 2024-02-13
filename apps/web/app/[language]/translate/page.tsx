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
import { ExternalLink } from '@gw2treasures/ui/components/Link/ExternalLink';
import { Code } from '@/components/Layout/Code';
import type { Metadata } from 'next';
import { List } from '@gw2treasures/ui/components/Layout/List';
import Link from 'next/link';

const dictionaries = { de, en, es, fr };
const legacyDictionaries = { de: deLegacy, en: enLegacy, es: esLegacy, fr: frLegacy };

export default function TranslatePage() {
  const keys = Object.keys(dictionaries.en) as TranslationId[];

  return (
    <PageLayout>
      <Headline id="translations">Translations</Headline>

      <List numbered>
        <li>
          Edit translations by clicking on them.
          <List>
            <li>Missing translations are displayed in italics and gray.</li>
            <li>Translations you changed are bold and blue.</li>
          </List>
        </li>
        <li>
          Once you have made your changes to the translations, you need to export them.
          <List>
            <li>Click the &quot;Export&quot; button at the top of the table. This will download a JSON file containing all translations of that language.</li>
            <li>If you have edited multiple languages, export all languages you have changed.</li>
          </List>
        </li>
        <li>
          Submit your changes.
          <List>
            <li>If you now how to use GitHub, you can create a Pull Request with your changes (<ExternalLink href="https://github.com/GW2Treasures/gw2treasures.com/tree/main/apps/web/translations">GitHub translations directory</ExternalLink>).</li>
            <li>Otherwise send the file with your changes on <ExternalLink href="https://discord.gg/gvx6ZSE">Discord</ExternalLink> (channel <Code inline>#gw2treasures</Code>) or in an email to <a href="mailto:support@gw2treasures.com">support@gw2treasures.com</a>.</li>
          </List>
        </li>
      </List>

      <p>If you found a wrong text on the site that is not listed here, it is probably not translated yet. Check the <Link href="/about">About page</Link> on how to report this or contribute the changes yourself.</p>

      <TranslationEditor dictionaries={dictionaries} legacyDictionaries={legacyDictionaries}/>
    </PageLayout>
  );
}

export const metadata = {
  title: 'Translate'
};
