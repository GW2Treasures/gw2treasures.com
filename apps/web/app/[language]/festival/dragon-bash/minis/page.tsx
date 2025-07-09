import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { MiniTable } from '@/components/Mini/MiniTable';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import { getTranslate } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

const miniIds: number[] = [
  158, // Mini Holographic Axe-Wielding Destroyer
  160, // Mini Holographic Colossus
  161, // Mini Holographic Risen Knight
  162, // Mini Helmed Moa Racer
  157, // Mini Holographic Branded Minotaur
  159, // Mini Holographic Corrupted Wolf
  820, // Mini Destroyer of the Last King
  888, // Mini Longhorn Sheep
  771, // Mini Dragon Gourdon
  819, // Mini Jhavi Jorasdottir
  871, // Mini Husky Dog
  870, // Mini Brown Tabby Cat
  889, // Mini Duckling
  924, // Mini Mystical Blue Orb
  968, // Mini Golden Labrador
];

const loadData = cache(async function loadData() {
  const [minis] = await Promise.all([
    db.mini.findMany({
      where: { id: { in: miniIds }},
      include: { icon: true },
    })
  ]);

  return { minis };
}, ['dragon-bash-minis'], { revalidate: 60 * 60 });


export default async function DragonBashAchievementsPage() {
  const { minis } = await loadData();
  await pageView('festival/dragon-bash/minis');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.minis.login"/>} authorizationMessage={<Trans id="festival.minis.authorize"/>}/>

      <MiniTable minis={minis}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.dragon-bash.minis.description"/></Description>
            {table}
          </>
        )}
      </MiniTable>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('minis'),
    description: t('festival.dragon-bash.minis.description'),
    url: 'festival/dragon-bash/minis',
  };
});
