import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { SkinTable } from '@/components/Skin/SkinTable';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import { getLanguage, getTranslate } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

const skinIds = [
  2360, // Storm Wizard Backpack Cover
  2362, // Super Backpack Cover
  6668, // Kaiser Snake Backpack Cover
  7201, // Crimson Assassin Backpack Cover
  9349, // Virtual Box
  9355, // Virtual Box
  9357, // Virtual Box
  10770, // Reality Rig Mk3
  10778, // Reality Rig Mk3
  10779, // Reality Rig Mk3
  10781, // Reality Rig Mk2
  10782, // Reality Rig Mk2
  10790, // Reality Rig Mk1
  10792, // Reality Rig Mk2
  10795, // Reality Rig Mk1
  10797, // Reality Rig Mk1
  12106, // Powered Shoulders
  12116, // Powered Shoulders
  12117, // Powered Shoulders
  12988, // Powered Boots
  12993, // Powered Boots
  12996, // Powered Boots
];

const skinSetNames = [
  'Crimson Assassin weapons',
  'Crimson Vanquisher weapons',
  'Generation One weapons',
  'Glitched Adventure weapons',
  'Golem-Buster weapons',
  'Hardlight weapons',
  'Kaiser Snake weapons',
  'King Toad\'s weapons',
  'Retro-Forged weapons',
  'Storm Wizard\'s weapons',
  'Super Rainbow Cloud weapons',
  'Super weapons',
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
}, ['super-adventure-box-skins'], { revalidate: 60 * 60 });

export default async function SuperAdventureFestivalAchievementsPage() {
  const { skins, sets } = await loadData();
  await pageView('festival/super-adventure/skins');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.skins.login"/>} authorizationMessage={<Trans id="festival.skins.authorize"/>}/>

      <SkinTable skins={skins}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.super-adventure.skins.description"/></Description>
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
    description: t('festival.super-adventure.skins.description'),
  };
});
