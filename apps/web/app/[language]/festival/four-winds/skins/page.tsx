import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SkinTable } from '@/components/Skin/SkinTable';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import { getTranslate } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

const skinIds: number[] = [
  2353, // Fervid Censer
  8209, // Wind-Blessed Zephyrite Gloves
  2357, // Slickpack
  2020, // Monocle
  2018, // Monocle
  2354, // Sclerite Karka Shell
  8196, // Sun-Touched Zephyrite Gloves
  8223, // Grand Wind Catcher
  8212, // Sun-Touched Zephyrite Gloves
  8210, // Lightning-Touched Zephyrite Gloves
  8226, // Lightning-Touched Zephyrite Gloves
  2019, // Monocle
  8190, // Sun-Touched Zephyrite Gloves
  8198, // Lightning-Blessed Zephyrite Gloves
  8204, // Lightning-Blessed Zephyrite Gloves
  8189, // Lightning-Touched Zephyrite Gloves
  8216, // Grand Sun Catcher
  8193, // Wind-Blessed Zephyrite Gloves
  8211, // Wind-Blessed Zephyrite Gloves
  8227, // Sun-Blessed Zephyrite Gloves
  8191, // Wind-Touched Zephyrite Gloves
  8202, // Sun-Blessed Zephyrite Gloves
  8207, // Wind-Touched Zephyrite Gloves
  8199, // Sun-Blessed Zephyrite Gloves
  8218, // Grand Lightning Catcher
  8229, // Wind-Touched Zephyrite Gloves
  8214, // Lightning-Blessed Zephyrite Gloves
  9544, // Sun-Blessed Vision
  9546, // Sun-Blessed Vision
  9555, // Sun-Blessed Vision
  12321, // Beach Trunks
  12310, // Beach Trunks
  12347, // Beach Trunks
  2349, // Desert Rose
  2024, // Gas Mask
  2026, // Gas Mask
  2025, // Gas Mask
  2348, // Lightning Catcher
  2029, // Mask of the Night
  2027, // Mask of the Night
  2028, // Mask of the Night
  2347, // Sun Catcher
  2346, // Wind Catcher
  8861, // Winged Lantern
  2350, // Zephyr Rucksack
  11567, // Zephyrite Headband
  11559, // Zephyrite Headband
  11562, // Zephyrite Headband
  10923, // Zephyrite Shawl
  10930, // Zephyrite Shawl
  10959, // Zephyrite Shawl
  10102, // Zephyrite Traveling Boots
  10107, // Zephyrite Traveling Boots
  10103, // Zephyrite Traveling Boots
];

const skinSetNames: string[] = [
  'Bazaar-Traded weapons',
  'Divine Sovereign weapons',
  'Sandswept weapons',
  'Sovereign weapons',
  'Sun-Blessed Zephyrite weapons',
  'Sun-Grown weapons',
  'Watchwork weapons',
  'Zephyrite weapons',
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
}, ['four-winds-skins'], { revalidate: 60 * 60 });

export default async function FourWindsAchievementsPage() {
  const { skins, sets } = await loadData();
  await pageView('festival/four-winds/skins');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.skins.login"/>} authorizationMessage={<Trans id="festival.skins.authorize"/>}/>

      <SkinTable skins={skins}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.four-winds.skins.description"/></Description>
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

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('navigation.skins'),
    description: t('festival.four-winds.skins.description'),
    url: 'festival/four-winds/skins',
  };
});
