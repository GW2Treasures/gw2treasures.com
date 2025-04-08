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
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import type { Metadata } from 'next';
import { requiredScopes } from '../helper';
import { pageView } from '@/lib/pageView';
import { getTranslate } from '@/lib/translate';
import { getAlternateUrls } from '@/lib/url';

const achievementIds = [
  6031, // The Goldclaw Holiday Collection
  5005, // Festival Frequenter

  3393, // The Crimson Assassin
  5240, // The Glitched Adventure
  2867, // The Kaiser
  2880, // The King Toad
  2860, // The Storm Wizard
  2875, // The Super Adventure
];
const achievementCategoryIds = [
  162, // Daily Super Adventure Festival
  22, // Super Adventure Box: World 1
  45, // Super Adventure Box: World 2
  46, // Super Adventure Box: Tribulation Mode
  205, // Super Adventure Box: Nostalgia
  351, // Super Adventure Box: Quality Testing
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
}, ['super-adventure-box'], { revalidate: 60 * 60 });

export default async function SuperAdventureFestivalAchievementsPage({ params }: PageProps) {
  const { language } = await params;
  const { achievements, dailyAchievements } = await loadData();
  await pageView('festival/super-adventure/achievements');

  return (
    <PageLayout>
      <Gw2Accounts requiredScopes={requiredScopes} loading={null} loginMessage={<Trans id="festival.achievements.login"/>} authorizationMessage={<Trans id="festival.achievements.authorize"/>}/>

      <AchievementTable achievements={achievements} language={language}>
        {(table, ColumnSelect) => (
          <>
            <Description actions={ColumnSelect}><Trans id="festival.super-adventure.achievements.description"/></Description>
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const t = getTranslate(language);

  return {
    title: t('navigation.achievements'),
    alternates: getAlternateUrls('festival/super-adventure/achievements', language),
  };
}

