import { AchievementTable } from '@/components/Achievement/AchievementTable';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import type { PageProps } from '@/lib/next';
import { db } from '@/lib/prisma';
import type { AchievementFlags } from '@gw2api/types/data/achievement';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import { getTranslate } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

const achievementIds = [
  6031, // The Goldclaw Holiday Collection
  5005, // Festival Frequenter
];
const achievementCategoryIds = [
  199, // Dragon Ball
  200, // New Year's Customs
  201, // Daily Lunar New Year
  202, // Lunar New Year
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
}, ['lunar-new-year'], { revalidate: 60 * 60 });

export default async function LunarNewYearAchievementsPage({ params }: PageProps) {
  const { language } = await params;
  const { achievements, dailyAchievements } = await loadData();
  await pageView('festival/lunar-new-year/achievements');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.achievements.login"/>} authorizationMessage={<Trans id="festival.achievements.authorize"/>}/>

      <AchievementTable achievements={achievements} language={language}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.lunar-new-year.achievements.description"/></Description>
            {table}
          </>
        )}
      </AchievementTable>

      <AchievementTable achievements={dailyAchievements} language={language} collapsed="historic" sort>
        {(table, columnSelect) => (
          <>
            <Headline actions={columnSelect} id="daily">Daily Achievements</Headline>
            {table}
          </>
        )}
      </AchievementTable>
    </PageLayout>
  );
}

export const generateMetadata = createMetadata(async ({ params }) => {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('navigation.achievements'),
    url: 'festival/lunar-new-year/achievements',
  };
});
