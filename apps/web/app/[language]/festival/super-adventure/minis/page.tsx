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
  183, // Mini Moto
  184, // Mini Princess Miya
  749, // Mini Super Adventure Gourdon
  810, // Mini Super Ooze
  811, // Mini Super Choya Miner
  886, // Mini Adventure Boxer
  887, // Mini Blue Bauble
  918, // Mini Super Green Ooze
  962, // Mini Super Yellow Ooze
];

const loadData = cache(async function loadData() {
  const [minis] = await Promise.all([
    db.mini.findMany({
      where: { id: { in: miniIds }},
      include: { icon: true },
    })
  ]);

  return { minis };
}, ['super-adventure-box-minis'], { revalidate: 60 * 60 });


export default async function SuperAdventureFestivalAchievementsPage() {
  const { minis } = await loadData();
  await pageView('festival/super-adventure/minis');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.minis.login"/>} authorizationMessage={<Trans id="festival.minis.authorize"/>}/>

      <MiniTable minis={minis}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.super-adventure.minis.description"/></Description>
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
    description: t('festival.super-adventure.minis.description'),
  };
});
