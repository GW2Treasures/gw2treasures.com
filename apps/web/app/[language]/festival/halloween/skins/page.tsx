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

const skinIds: number[] = [
  979, // Witch's Hat (Light)
  980, // Witch's Hat (Heavy)
  981, // Witch's Hat (Medium)
  1235, // Paper Bag Helm (Blush) (Heavy)
  1236, // Paper Bag Helm (Blush) (Light)
  1237, // Paper Bag Helm (Blush) (Medium)
  1238, // Paper Bag Helm (Angry) (Heavy)
  1239, // Paper Bag Helm (Angry) (Light)
  1240, // Paper Bag Helm (Angry) (Medium)
  1241, // Paper Bag Helm (Happy) (Heavy)
  1242, // Paper Bag Helm (Happy) (Light)
  1243, // Paper Bag Helm (Happy) (Medium)
  1244, // Paper Bag Helm (Sad) (Heavy)
  1245, // Paper Bag Helm (Sad) (Light)
  1246, // Paper Bag Helm (Sad) (Medium)
  2027, // Mask of the Night (Medium)
  2028, // Mask of the Night (Light)
  2029, // Mask of the Night (Heavy)
  2336, // Mad Memoires
  2338, // Mad Memoires: Complete Edition
  4686, // Arachnophobia
  4688, // The Mad Moon
  4692, // The Crossing
  6152, // Nest
  6161, // Nightfury (Medium)
  6216, // Nightwing
  6217, // Karka Helm (Medium)
  6249, // Karka Helm (Heavy)
  6252, // Nightfury (Light)
  6273, // Shackles of Madness (Light)
  6306, // Nightfury (Heavy)
  6312, // Vassago
  6390, // Smasher
  6414, // Shackles of Madness (Heavy)
  6487, // Shackles of Madness (Medium)
  6493, // Karka Helm (Light)
  6977, // Jailbroken
  6991, // Onus
  6994, // Grim Pact
  7757, // Lunatic Templar Gauntlets (Heavy)
  7759, // Lunatic Acolyte Coat (Light)
  7760, // Mad Memoires: Complete Superstition
  7763, // Lunatic Acolyte Mantle (Light)
  7766, // Lunatic Templar Greaves (Heavy)
  7768, // Lunatic Templar Tassets (Heavy)
  7770, // Lunatic Noble Mask (Medium)
  7771, // Lunatic Templar Pauldrons (Heavy)
  7773, // Lunatic Templar Helm (Heavy)
  7774, // Lunatic Noble Pants (Medium)
  7775, // Mad Memoires: Complete Ignition
  7776, // Lunatic Acolyte Mask (Light)
  7778, // Sikandar
  7780, // Lunatic Acolyte Pants (Light)
  7781, // Lunatic Noble Coat (Medium)
  7787, // Touch of Madness
  7789, // Lunatic Templar Breastplate (Heavy)
  7792, // Lunatic Acolyte Gloves (Light)
  7793, // Lunatic Acolyte Boots (Light)
  7796, // Lunatic Noble Shoulders (Medium)
  7797, // Bloodstained Lunatic Noble  (Medium)
  7798, // Bloodstained Lunatic Noble  (Medium)
  7799, // Lunatic Noble Gloves (Medium)
  7802, // Antonina
  7803, // Lunatic Noble Boots (Medium)
  8435, // The Cure
  8440, // Soul Conductor
  8441, // Revenge
  8454, // Touch of Fog
  8964, // Pumpkin Crown (Medium)
  8965, // Last Rites
  8966, // Pumpkin Crown (Light)
  8968, // Pumpkin Crown (Heavy)
  8984, // Ghostly Racing Scarf (Medium)
  8995, // Ghostly Racing Scarf (Heavy)
  8999, // Carapace of Chaos
  9005, // Ghostly Racing Scarf (Light)
  9638, // Lunatic Court Cape
  10121, // Corroding Abyss
  10122, // Grasping Gaze Shoulders (Heavy)
  10128, // Grasping Gaze Shoulders (Medium)
  10130, // Barbed Refuge
  10132, // Luminous Wings
  10134, // Grasping Gaze Shoulders (Light)
  11053, // Clawing Shadow Gloves (Medium)
  11055, // Pale Light's
  11062, // Nightmare Splitter
  11065, // Clawing Shadow Gloves (Heavy)
  11069, // Clawing Shadow Gloves (Light)
  11071, // Harvest's Grin
  11850, // Heralded Executioner
  11857, // Clawing Shadow Greaves (Light)
  11858, // Sanctioned Executioner
  11862, // Guided Executioner
  11865, // Clawing Shadow Greaves (Heavy)
  11867, // Clawing Shadow Greaves (Medium)
  12600, // Sanguine Shield
  12601, // Clawing Shadow Plate (Light)
  12613, // Sanguine Focus
  12614, // Sanguine Staff
  12616, // Clawing Shadow Plate (Heavy)
  12617, // Clawing Shadow Plate (Medium)
  13242, // Lunatic Jester's Trousers (Medium)
  13260, // Lunatic Jester's Trousers (Light)
  13234, // Lunatic Jester's Trousers (Heavy)
  13255, // Plush Zhaia Backpack
];

const skinSetNames: string[] = [
  'Candy Core weapons',
  'Chained weapons',
  'Demon-Haunted weapons',
  'Grim Machine weapons',
  'Haunted weapons',
  'Royal Flame weapons',
  'Unchained weapons',
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
}, ['halloween-skins'], { revalidate: 60 * 60 });

export default async function HalloweenSkinsPage() {
  const { skins, sets } = await loadData();
  await pageView('festival/halloween/skins');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.skins.login"/>} authorizationMessage={<Trans id="festival.skins.authorize"/>}/>

      <SkinTable skins={skins}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.halloween.skins.description"/></Description>
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
    description: t('festival.halloween.skins.description'),
    url: 'festival/halloween/skins',
  };
});
