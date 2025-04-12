import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import type { PageProps } from '@/lib/next';
import { getTranslate, translateMany } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';
import type { Metadata } from 'next';
import { SabAccounts } from './page.client';


export default async function SuperAdventureFestivalCharactersPage({ params }: PageProps) {
  const { language } = await params;

  const translations = translateMany([
    'festival.super-adventure.sab.mode.infantile',
    'festival.super-adventure.sab.mode.normal',
    'festival.super-adventure.sab.mode.tribulation',
    'festival.super-adventure.sab.unlock.chain_stick',
    'festival.super-adventure.sab.unlock.slingshot',
    'festival.super-adventure.sab.unlock.whip',
    'festival.super-adventure.sab.unlock.mini_bomb',
    'festival.super-adventure.sab.unlock.mega_bomb',
    'festival.super-adventure.sab.unlock.candle',
    'festival.super-adventure.sab.unlock.torch',
    'festival.super-adventure.sab.unlock.wooden_whistle',
    'festival.super-adventure.sab.unlock.digger',
    'festival.super-adventure.sab.unlock.nice_scoop',
    'festival.super-adventure.sab.unlock.glove_of_wisdom',
    'festival.super-adventure.sab.unlock.bauble_purse',
    'festival.super-adventure.sab.unlock.bauble_tote_bag',
    'festival.super-adventure.sab.unlock.moto_breath',
    'festival.super-adventure.sab.unlock.moto_finger',
    'festival.super-adventure.sab.unlock.health_vessel_1',
    'festival.super-adventure.sab.unlock.health_vessel_2',
    'festival.super-adventure.sab.unlock.medium_health_potion',
    'festival.super-adventure.sab.song.secret_song',
    'festival.super-adventure.sab.song.gatekeeper_lullaby',
    'festival.super-adventure.sab.song.shatter_serenade',
  ], language);

  return (
    <PageLayout>
      <Description>
        <Trans id="festival.super-adventure.characters.description"/>
      </Description>

      <SabAccounts translations={translations}/>
    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('festival.super-adventure.characters'),
    description: t('festival.super-adventure.characters.description'),
    alternates: getAlternateUrls('festival/super-adventure/characters', language),
  };
}
