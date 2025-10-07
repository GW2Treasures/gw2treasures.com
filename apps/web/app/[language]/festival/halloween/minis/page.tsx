import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { MiniTable } from '@/components/Mini/MiniTable';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import { getLanguage, getTranslate } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

const miniIds: number[] = [
  196, // Mini Bloody Prince Thorn
  202, // Mini Candy-Corn Elemental
  302, // Mini Gwynefyrdd
  345, // Mini Husk-o-Lantern
  353, // Mini Spooky Moa
  356, // Mini Devil Dog
  417, // Mini Charles the Hellfire Skeleton
  418, // Mini Oxidecimus the Shadow Raven
  300, // Mini Zuzu, Cat of Darkness
  301, // Mini Candy Corn Ghoulemental
  729, // Mini Pumpkin Jack O'
  732, // Mini Pumpkin Jack O' Lantern
  416, // Mini Thailog the Gargoyle
  200, // Mini Ghost Carlotta
  733, // Mini Pumpkin Jack
  833, // Mini Madam Cookie
  834, // Mini Spectral Palawa Joko
  731, // Mini Svelicht the Fog Raven
  603, // Mini Halloween Gourdon
  607, // Mini Failed Attempt
  614, // Mini Gustav the Caramel Corn Elemental
  600, // Mini Bradford the Skeleton Ghost
  608, // Mini Lord Humphrey Faren
  876, // Mini Black Labrador
  730, // Mini Haunted Candle
  783, // Mini Mad Memoires
  910, // Mini Derlitz the Candy Raven
  786, // Mini Mad Memories: Complete Ignition
  874, // Mini Fluffy Black Cat
  784, // Mini Mad Memories: Complete Edition
  787, // Mini Altosius the Flame Raven
  936, // Mini Pummel Spider
  982, // Mini Candy Core Golem
];

const loadData = cache(async function loadData() {
  const [minis] = await Promise.all([
    db.mini.findMany({
      where: { id: { in: miniIds }},
      include: { icon: true },
    })
  ]);

  return { minis };
}, ['halloween-minis'], { revalidate: 60 * 60 });


export default async function HalloweenMiniPage() {
  const { minis } = await loadData();
  await pageView('festival/halloween/minis');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.minis.login"/>} authorizationMessage={<Trans id="festival.minis.authorize"/>}/>

      <MiniTable minis={minis}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.halloween.minis.description"/></Description>
            {table}
          </>
        )}
      </MiniTable>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('minis'),
    description: t('festival.halloween.minis.description'),
    url: 'festival/halloween/minis',
  };
});
