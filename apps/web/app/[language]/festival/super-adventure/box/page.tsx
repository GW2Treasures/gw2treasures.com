import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { getLanguage, getTranslate, translateMany } from '@/lib/translate';
import { SabAccounts } from './page.client';
import { pageView } from '@/lib/pageView';
import ogImage from './og.png';
import { createMetadata } from '@/lib/metadata';


export default async function SuperAdventureFestivalCharactersPage() {
  const language = await getLanguage();

  const translations = translateMany([
    'festival.super-adventure.sab.hideEmpty',
    'festival.super-adventure.sab.character',
    'festival.super-adventure.sab.upgrades',
    'festival.super-adventure.sab.songs',
    'festival.super-adventure.sab.mode.infantile',
    'festival.super-adventure.sab.mode.normal',
    'festival.super-adventure.sab.mode.tribulation',
    'festival.super-adventure.sab.unlock.chain_stick',
    'festival.super-adventure.sab.unlock.slingshot',
    'festival.super-adventure.sab.unlock.bow',
    'festival.super-adventure.sab.unlock.whip',
    'festival.super-adventure.sab.unlock.boomerang',
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
    'festival.super-adventure.sab.unlock.bauble_backpack',
    'festival.super-adventure.sab.unlock.moto_breath',
    'festival.super-adventure.sab.unlock.moto_finger',
    'festival.super-adventure.sab.unlock.health_vessel_1',
    'festival.super-adventure.sab.unlock.health_vessel_2',
    'festival.super-adventure.sab.unlock.medium_health_potion',
    'festival.super-adventure.sab.unlock.missingInApi',
    'festival.super-adventure.sab.song.secret_song',
    'festival.super-adventure.sab.song.gatekeeper_lullaby',
    'festival.super-adventure.sab.song.shatter_serenade',
  ], language);

  await pageView('festival/super-adventure/box');

  return (
    <PageLayout>
      <Description>
        <Trans id="festival.super-adventure.sab.description"/>
      </Description>

      <SabAccounts translations={translations}/>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('festival.super-adventure.sab'),
    description: t('festival.super-adventure.sab.description'),
    url: 'festival/super-adventure/box',
    image: ogImage,
  };
});
