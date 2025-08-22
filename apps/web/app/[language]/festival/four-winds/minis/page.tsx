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
  925, // Mini Sea Turtle
  291, // Mini Panda
  202, // Mini Candy-Corn Elemental
  206, // Mini Toxic Nimross
  872, // Mini Siamese Cat
  831, // Mini Prisca
  700, // Mini Watchknight Mk II
  701, // Mini Beach Gourdon
  873, // Mini Rottweiler
  832, // Mini Efram Greetsglory
  891, // Mini Pack Bull
  167, // Mini Evon Gnashblade
  168, // Mini Ellen Kiel
  169, // Mini Watchknight
  170, // Mini Liadri the Concealing Dark
  971, // Mini Garenhoff Coon Cat
];

const loadData = cache(async function loadData() {
  const [minis] = await Promise.all([
    db.mini.findMany({
      where: { id: { in: miniIds }},
      include: { icon: true },
    })
  ]);

  return { minis };
}, ['four-winds-minis'], { revalidate: 60 * 60 });


export default async function FourWindsMiniPage() {
  const { minis } = await loadData();
  await pageView('festival/four-winds/minis');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.minis.login"/>} authorizationMessage={<Trans id="festival.minis.authorize"/>}/>

      <MiniTable minis={minis}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.four-winds.minis.description"/></Description>
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
    description: t('festival.four-winds.minis.description'),
    url: 'festival/four-winds/minis',
  };
});
