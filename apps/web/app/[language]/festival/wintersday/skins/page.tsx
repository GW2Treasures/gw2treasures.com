import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SkinTable } from '@/components/Skin/SkinTable';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import type { Metadata } from 'next';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import type { PageProps } from '@/lib/next';
import { getTranslate } from '@/lib/translate';

const skinIds = [
  // weapons
  11177, // Call of Cheer
  10217, // Custom Candy Cane Hammer
  10185, // Dwayna's Promise
  11181, // Greatcracker's Legend
  10208, // Grenth's Vow
  11947, // Ornamented Staff
  101379, // Ornamented Shield
  11949, // Ornamented Focus
  11190, // Silent Forest's Bell
  10194, // Wintergreen Custom Candy Cane Hammer
  12791, // Ginger Shortbread Shortbow
  12757, // Wintersday Bash
  12755, // Gingerbread Speargun

  // armor
  7991, // Eggnog Helmet
  7970, // Eggnog Helmet
  7966, // Eggnog Helmet
  10218, // Embellished Wintersday Gift Bag
  1021, // Festive Hat
  1020, // Festive Hat
  975, // Festive Hat
  9062, // Festive Sweater
  9087, // Festive Sweater
  9089, // Festive Sweater
  9765, // Festive Winter Hood
  9742, // Festive Winter Hood
  9731, // Festive Winter Hood
  2382, // Light of Dwayna
  9063, // Rime-Rimmed Mariner's Rebreather
  9083, // Rime-Rimmed Mariner's Rebreather
  9071, // Rime-Rimmed Mariner's Rebreather
  2383, // Shadow of Grenth
  2375, // Toymaker's Bag
  11952, // Winter Fur Shoulders
  11961, // Winter Fur Shoulders
  11957, // Winter Fur Shoulders
  6577, // Winter's Presence
  6583, // Winter's Presence
  6586, // Winter's Presence
  11179, // Wintersday Snow Boots
  11184, // Wintersday Snow Boots
  11171, // Wintersday Snow Boots
  12786, // Winter Mittens
  12765, // Winter Mittens
  12748, // Winter Mittens
];

const skinSetNames = [
  'Wrapped weapons',
  'Rimed Verdant weapons',
  'Candy Cane weapons',
  'Wintergreen weapons',
  'Toy weapon skins',
  'Sparkling Wrapped weapons',
  'Sacred Solstice weapons',
  'Snowdrift weapons',
  'Plush weapons'
];

const loadData = cache(async function loadData() {
  const [skins, sets] = await Promise.all([
    db.skin.findMany({
      where: { id: { in: skinIds }},
      include: { icon: true },
    }),
    db.skinSet.findMany({
      where: { name_en: { in: skinSetNames }},
      include: { skins: { include: { icon: true }}},
    })
  ]);

  return { skins, sets };
}, ['wintersday-skins'], { revalidate: 60 * 60 });

export default async function WintersdayAchievementsPage() {
  const { skins, sets } = await loadData();
  await pageView('festival/wintersday/skins');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.skins.login"/>} authorizationMessage={<Trans id="festival.skins.authorize"/>}/>

      <SkinTable skins={skins}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.wintersday.skins.description"/></Description>
            {table}
          </>
        )}
      </SkinTable>

      {sets.map((set) => (
        <SkinTable key={set.id} skins={set.skins} headlineId={set.id} headline={set.name_en}/>
      ))}
    </PageLayout>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('navigation.skins')
  };
}
