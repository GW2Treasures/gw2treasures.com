import type { Language } from '@gw2treasures/database';
import { db } from '@/lib/prisma';
import { ItemList } from '@/components/ItemList/ItemList';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { remember } from '@/lib/remember';
import { AchievementPoints } from '@/components/Achievement/AchievementPoints';
import { Icon } from '@gw2treasures/ui';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { linkProperties } from '@/lib/linkProperties';
import { format } from 'gw2-tooltip-html';
import { localizedName } from '@/lib/localizedName';
import { ItemLink } from '@/components/Item/ItemLink';
import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from '@/components/Achievement/AccountAchievementProgress';
import { PageLayout } from '@/components/Layout/PageLayout';
import { ColumnSelect } from '@/components/Table/ColumnSelect';

const getUncategorizedAchievements = remember(60, async function getData(language: Language) {
  const achievements = await db.achievement.findMany({
    where: { achievementCategoryId: null },
    include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}
  });

  return { achievements };
});

async function AchievementUncategorizedPage({ params: { language }}: { params: { language: Language }}) {
  const { achievements } = await getUncategorizedAchievements(language);

  const UncategorizedAchievements = createDataTable(achievements, ({ id }) => id);

  return (
    <PageLayout>
      <Headline id="achievements" actions={<ColumnSelect table={UncategorizedAchievements}/>}>Uncategorized Achievements</Headline>

      <p>Achievements that are currently not assigned to any category.</p>

      <UncategorizedAchievements.Table>
        <UncategorizedAchievements.Column id="id" title="ID" sortBy="id" hidden small align="right">
          {({ id }) => id}
        </UncategorizedAchievements.Column>
        <UncategorizedAchievements.Column id="achievement" title="Achievement" sortBy={`name_${language}`}>
          {(achievement) => <AchievementLink achievement={achievement}/>}
        </UncategorizedAchievements.Column>
        <UncategorizedAchievements.Column id="points" align="right" title="AP" sortBy="points">
          {({ points }) => <AchievementPoints points={points}/>}
        </UncategorizedAchievements.Column>
        <UncategorizedAchievements.Column id="mastery" title={<><Icon icon="mastery"/> Mastery</>} sortBy="mastery">
          {({ mastery }) => mastery === 'Unknown' ? 'EoD / SotO' : mastery}
        </UncategorizedAchievements.Column>
        <UncategorizedAchievements.Column id="title" title={<><Icon icon="title"/> Title</>} sortBy={({ rewardsTitle }) => rewardsTitle.length}>
          {({ rewardsTitle }) => rewardsTitle.map((title) => <span key={title.id} dangerouslySetInnerHTML={{ __html: format(localizedName(title, language)) }}/>)}
        </UncategorizedAchievements.Column>
        <UncategorizedAchievements.Column id="items" title="Items" sortBy={({ rewardsItem }) => rewardsItem.length}>
          {({ rewardsItem }) => rewardsItem.length > 0 && (
            <ItemList singleColumn>
              {rewardsItem.map((item) => (
                <li key={item.id}><ItemLink item={item} icon={32}/></li>
              ))}
            </ItemList>
          )}
        </UncategorizedAchievements.Column>
        <UncategorizedAchievements.DynamicColumns headers={<AccountAchievementProgressHeader/>}>
          {({ id }) => <AccountAchievementProgressRow achievementId={id}/>}
        </UncategorizedAchievements.DynamicColumns>
      </UncategorizedAchievements.Table>
    </PageLayout>
  );
};

export default AchievementUncategorizedPage;

export const metadata = {
  title: 'Uncategorized Achievements'
};
