import { AchievementTable } from '@/components/Achievement/AchievementTable';
import { Gw2Accounts } from '@/components/Gw2Api/Gw2Accounts';
import { Trans } from '@/components/I18n/Trans';
import { Description } from '@/components/Layout/Description';
import { PageLayout } from '@/components/Layout/PageLayout';
import { cache } from '@/lib/cache';
import { linkProperties } from '@/lib/linkProperties';
import { db } from '@/lib/prisma';
import type { AchievementFlags } from '@gw2api/types/data/achievement';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import { getLanguage, getTranslate } from '@/lib/translate';
import { createMetadata } from '@/lib/metadata';

const achievementIds = [
  6031, // The Goldclaw Holiday Collection
  5005, // Festival Frequenter
  5004, // Royal Flame Weapons
  3920, // Lunatic Court's Finery
  4998, // Mad Armory: Carapace of Chaos
  5003, // Mad Armory: Last Rites
  1777, // Tricks and Treats
];
const achievementCategoryIds: number[] = [
  79, // Halloween Daily
  191, // Halloween Rituals
  193, // Shadow of the Mad King
  192, // Lunatic Wardrobe
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
}, ['halloween-achievements'], { revalidate: 60 * 60 });

export default async function HalloweenAchievementsPage() {
  const language = await getLanguage();
  const { achievements, dailyAchievements } = await loadData();
  await pageView('festival/halloween/achievements');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.achievements.login"/>} authorizationMessage={<Trans id="festival.achievements.authorize"/>}/>

      <AchievementTable achievements={achievements} language={language}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.halloween.achievements.description"/></Description>
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

export const generateMetadata = createMetadata(async () => {
  const language = await getLanguage();
  const t = getTranslate(language);

  return {
    title: t('navigation.achievements'),
    description: t('festival.halloween.achievements.description'),
    url: 'festival/halloween/achievements'
  };
});
