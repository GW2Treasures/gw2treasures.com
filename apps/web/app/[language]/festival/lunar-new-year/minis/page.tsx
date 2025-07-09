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

const miniIds = [
  317, // Mini Ram
  435, // Mini Celestial Rooster
  654, // Mini Lucky Lantern Puppy
  745, // Mini Fortunate Lantern
  746, // Mini Glowing Lantern
  748, // Mini Festive Lantern
  647, // Mini Lunar "Horse"
  650, // Mini Lunar Shepherd
  651, // Mini Lunar Gourdog
  798, // Mini Essence of Luck
  917, // Mini Amnytas Stormscale
  837, // Mini Lunar Tiger
  883, // Mini Tortoiseshell Cat
  797, // Mini Lunar Rat
  882, // Mini Dachshund
  958, // Mini Snake
];

const loadData = cache(async function loadData() {
  const [minis] = await Promise.all([
    db.mini.findMany({
      where: { id: { in: miniIds }},
      include: { icon: true },
    })
  ]);

  return { minis };
}, ['lunar-new-year-minis'], { revalidate: 60 * 60 });


export default async function LunarNewYearAchievementsPage() {
  const { minis } = await loadData();
  await pageView('festival/lunar-new-year/minis');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.minis.login"/>} authorizationMessage={<Trans id="festival.minis.authorize"/>}/>

      <MiniTable minis={minis}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.lunar-new-year.minis.description"/></Description>
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
    title: t('festival.lunar-new-year.minis'),
    url: 'festival/lunar-new-year/minis',
  };
});
