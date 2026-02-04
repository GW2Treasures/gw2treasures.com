import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SkinTable } from '@/components/Skin/SkinTable';
import { cache } from '@/lib/cache';
import { createMetadata } from '@/lib/metadata';
import { pageView } from '@/lib/pageView';
import { db } from '@/lib/prisma';
import { getLanguage, getTranslate } from '@/lib/translate';
import { requiredScopes } from '../helper';

const skinIds = [
  // weapons
  11233, // Lucky Envelope
  11227, // Moon Rabbit's Guidance
  11222, // First Night's Spark
  10195, // Gatherer's Fortune
  8769, // Crescent Steel
  10226, // Inherited Flame
  11994, // Lucky Dragon Short Bow
  11991, // Lucky Dragon Hammer
  11993, // Lucky Dragon Speargun
  12827, // Jade Serpent Rifle
  12831, // Jade Serpent Spear
  12824, // Jade Serpent Dagger

  // armor
  10168, // Primal Tiger Hood
  10175, // Primal Tiger Hood
  10216, // Primal Tiger Hood
  9845, // Lunar-Enchanted Scale Gloves
  9876, // Lunar-Enchanted Feathered Gloves
  9880, // Lunar-Enchanted Prowler Gloves
  11992, // Dragon Descendant's Helm
  11990, // Dragon Descendant's Helm
  11995, // Dragon Descendant's Helm
  9108, // Fireworks Spaulders
  9101, // Fireworks Spaulders
  9111, // Fireworks Spaulders
  11212, // Embellished Rabbit Vest
  11205, // Embellished Rabbit Vest
  11226, // Embellished Rabbit Vest
  12819, // Snaketail Breeches
  12814, // Snaketail Breeches
  12820, // Snaketail Breeches
  7065, // Lucky Rooster Lantern
  10206, // Lucky Tiger Lantern
  11206, // Lucky Great Rabbit Lantern
  5856, // Lucky Ram Lantern
  5857, // Lucky Great Ram Lantern
  6619, // Lucky Monkey Lantern
  6620, // Lucky Great Monkey Lantern
  7069, // Lucky Great Rooster Lantern
  8006, // Lucky Dog Lantern
  8014, // Lucky Great Dog Lantern
  8623, // Lucky Boar Lantern
  8624, // Lucky Great Boar Lantern
  9097, // Lucky Rat Lantern
  9120, // Lucky Great Rat Lantern
  9838, // Lucky Great Ox Lantern
  9883, // Lucky Ox Lantern
  10183, // Lucky Great Tiger Lantern
  11209, // Lucky Rabbit Lantern
  12003, // Lucky Dragon Lantern
  12007, // Lucky Great Dragon Lantern
  12828, // Lucky Great Snake Lantern
  13691, // Hoofed Shoes
  13724, // Hoofed Shoes
  13705, // Hoofed Shoes
  13257, // Plush Mordy Backpack
  13725, // Lucky Great Horse Lantern
];

const skinSetNames = [
  'Fortune-Shining Aureate weapons',
  'Refitted Aureate weapons',
  'Shining Aureate weapons',
  'Firework weapons',
  'Fortunate weapons',
  'Lantern weapons',
  'Celestial\'s Firework weapons',
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
}, ['lunar-new-year-skins'], { revalidate: 60 * 60 });

export default async function LunarNewYearAchievementsPage() {
  const { skins, sets } = await loadData();
  await pageView('festival/lunar-new-year/skins');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.skins.login"/>} authorizationMessage={<Trans id="festival.skins.authorize"/>}/>

      <SkinTable skins={skins}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.lunar-new-year.skins.description"/></Description>
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

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('navigation.skins'),
    url: 'festival/lunar-new-year/skins',
  };
});
