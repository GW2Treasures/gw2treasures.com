import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { MiniTable } from '@/components/Mini/MiniTable';
import { cache } from '@/lib/cache';
import { db } from '@/lib/prisma';
import type { Metadata } from 'next';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';

const miniIds = [
  115, // Mini Princess Doll
  116, // Mini Toy Ventari
  117, // Mini Toy Soldier
  118, // Mini Toy Golem
  119, // Mini Plush Griffon
  120, // Mini Infinirarium
  121, // Mini Snowman
  122, // Mini Foostivoo the Merry
  123, // Mini Festive Golem
  213, // Mini Ho-Ho-Tron
  310, // Mini Skritta Claws
  381, // Mini Gift Skritt
  382, // Mini Charitable Gift Skritt
  385, // Mini Munificent Gift Skritt
  428, // Mini Large Snowball
  433, // Mini Snowball
  434, // Mini Tiny Snowball
  625, // Mini Toxx
  626, // Mini Tiny Angry Snowball
  628, // Mini Large Angry Snowball
  632, // Mini Tixx
  634, // Mini Angry Snowball
  636, // Mini Gift Box Gourdon
  735, // Mini Angry Snowman
  737, // Mini Freezie
  738, // Mini Freezie's Heart
  791, // Mini Magical Reindeer
  794, // Mini Mystical Snowflake
  836, // Mini Wintersday Cheer Freezie
  880, // Mini Calico Cat
  881, // Mini Corgi
  916, // Mini Plush Cuckoo
];

const loadData = cache(async function loadData() {
  const [minis] = await Promise.all([
    db.mini.findMany({
      where: { id: { in: miniIds }},
      include: { icon: true },
    })
  ]);

  return { minis };
}, ['wintersday-minis'], { revalidate: 60 * 60 });


export default async function WintersdayAchievementsPage() {
  const { minis } = await loadData();
  await pageView('festival/wintersday/minis');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.wintersday.minis.login"/>} authorizationMessage={<Trans id="festival.wintersday.minis.authorize"/>}/>

      <MiniTable minis={minis}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.wintersday.minis.description"/></Description>
            {table}
          </>
        )}
      </MiniTable>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Minis'
};
