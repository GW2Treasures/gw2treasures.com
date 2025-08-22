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
import ogImage from './og.png';
import { createMetadata } from '@/lib/metadata';

const skinIds: number[] = [
  10028, // Holographic Dragon Gloves
  10021, // Holographic Dragon Gloves
  10026, // Holographic Dragon Gloves
  10866, // Holographic Dragon Greaves
  10851, // Holographic Dragon Greaves
  10875, // Holographic Dragon Greaves
  9457, // Holographic Dragon Shoulders
  9460, // Holographic Dragon Shoulders
  9472, // Holographic Dragon Shoulders
  12262, //  Holographic Dragon Cuisses
  12245, //  Holographic Dragon Cuisses
  12216, //  Holographic Dragon Cuisses
  8833, // Victorious Holographic Wings
  8817, // Holographic Dragon Helm
  8829, // Holographic Dragon Helm
  8826, // Holographic Dragon Helm
  11510, // Holographic Dragon Plate
  11484, // Holographic Dragon Plate
  11486, // Holographic Dragon Plate
  2351, // Holographic Dragon Wings
  2352, // Holographic Shattered Dragon Wings
  2014, // Horns of the Dragon
  2016, // Horns of the Dragon
  2013, // Horns of the Dragon
  13029, // Uncrowned Legend's Greatsword
  13031, // Uncrowned Legend's Warhorn
  13079, // Uncrowned Legend's Trident
  13051, // Raven-Blessed Visage
  13064, // Raven-Blessed Visage
  13069, // Raven-Blessed Visage
];

const skinSetNames: string[] = [
  'Dragon Bash Weapon Chest weapons',
  'Dragonbone weapons',
  'Dragonrender weapons',
  'Holographic weapons',
  'Imbued Holographic weapons',
  'Sacred Crystal weapons',
  'Sacred Raven\'s weapons'
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
}, ['dragon-bash-skins'], { revalidate: 60 * 60 });

export default async function DragonBashAchievementsPage() {
  const { skins, sets } = await loadData();
  await pageView('festival/dragon-bash/skins');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.skins.login"/>} authorizationMessage={<Trans id="festival.skins.authorize"/>}/>

      <SkinTable skins={skins}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.dragon-bash.skins.description"/></Description>
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
    description: t('festival.dragon-bash.skins.description'),
    url: 'festival/dragon-bash/skins',
    image: ogImage,
  };
});
