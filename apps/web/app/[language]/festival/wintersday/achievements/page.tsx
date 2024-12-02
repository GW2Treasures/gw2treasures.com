import { AchievementTable } from '@/components/Achievement/AchievementTable';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import type { AchievementFlags } from '@gw2api/types/data/achievement';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import type { Metadata } from 'next';

const achievementIds = [
  5005,
  2030,
  5069,
  2028,
  2768,
  2029,
  6031,
  2765,
  2049,
  2792,
  2048,
];
const achievementCategoryIds = [
  98,
  150,
  197,
  198,
];

const dailyFlags: AchievementFlags[] = ['Daily', 'Weekly', 'Monthly'];

const loadData = cache(async function loadData() {
  const [allAchievements] = await Promise.all([
    db.achievement.findMany({
      where: {
        OR: [
          { id: { in: achievementIds }},
          { achievementCategoryId: { in: achievementCategoryIds }}
        ]
      },
      include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}},
    })
  ]);

  const groupedAchievements = allAchievements.reduce<{ achievements: typeof allAchievements, dailyAchievements: typeof allAchievements }>((grouped, achievement) => {
    const isDaily = dailyFlags.some((flag) => achievement.flags.includes(flag));
    grouped[isDaily ? 'dailyAchievements' : 'achievements'].push(achievement);
    return grouped;
  }, { achievements: [], dailyAchievements: [] });

  return { ...groupedAchievements };
}, ['wintersday'], { revalidate: 60 * 60 });

export default async function WintersdayAchievementsPage({ params }: PageProps) {
  const { language } = await params;
  const { achievements, dailyAchievements } = await loadData();

  return (
    <PageLayout>
      <AchievementTable achievements={achievements} language={language} includeRewardsColumns>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.wintersday.achievements.description"/></Description>
            {table}
          </>
        )}
      </AchievementTable>

      <AchievementTable achievements={dailyAchievements} language={language}>
        {(table, columnSelect) => (
          <>
            <Headline actions={columnSelect} id="daily">Daily Achievements</Headline>
            <Notice>The Guild Wars 2 API does not report progress for daily achievements.</Notice>
            {table}
          </>
        )}
      </AchievementTable>
    </PageLayout>
  );
}

export const metadata: Metadata = {
  title: 'Achievements'
};
