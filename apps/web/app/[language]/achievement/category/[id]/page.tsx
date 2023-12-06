import type { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import type { Gw2Api } from 'gw2-api-types';
import { ItemList } from '@/components/ItemList/ItemList';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { compareLocalizedName, localizedName } from '@/lib/localizedName';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { notFound } from 'next/navigation';
import { Icon } from '@gw2treasures/ui';
import { remember } from '@/lib/remember';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import type { Metadata } from 'next';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { linkProperties } from '@/lib/linkProperties';
import { ItemLink } from '@/components/Item/ItemLink';
import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from '@/components/Achievement/AccountAchievementProgress';
import { AchievementPoints } from '@/components/Achievement/AchievementPoints';
import { format } from 'gw2-tooltip-html';
import { createDataTable } from '@gw2treasures/ui/components/Table/DataTable';
import { ColumnSelect } from '@/components/Table/ColumnSelect';

export interface AchievementCategoryPageProps {
  params: {
    language: Language;
    id: string;
  }
}

const getData = remember(60, async function getData(id: number, language: Language) {
  const [achievementCategory, revision] = await Promise.all([
    db.achievementCategory.findUnique({
      where: { id },
      include: {
        icon: true,
        achievements: { include: { icon: true, rewardsItem: { select: linkProperties }, rewardsTitle: { select: { id: true, name_de: true, name_en: true, name_es: true, name_fr: true }}}},
        achievementGroup: true,
      }
    }),
    db.revision.findFirst({ where: { [`currentAchievementCategory_${language}`]: { id }}})
  ]);

  if(!achievementCategory || !revision) {
    notFound();
  }

  return { achievementCategory, revision };
});

async function AchievementCategoryPage({ params: { language, id }}: AchievementCategoryPageProps) {
  const achievementCategoryId = Number(id);

  if(isNaN(achievementCategoryId)) {
    notFound();
  }

  const { achievementCategory, revision } = await getData(achievementCategoryId, language);

  const data: Gw2Api.Achievement.Category = JSON.parse(revision.data);

  const achievements = achievementCategory.achievements.sort(compareLocalizedName(language));
  const [currentAchievements, historicAchievements] = achievements.reduce<[typeof achievements, typeof achievements]>(
    ([current, historic], achievement) => achievement.historic
      ? [current, [...historic, achievement]]
      : [[...current, achievement], historic],
    [[], []]
  );

  const CurrentAchievements = createDataTable(currentAchievements, ({ id }) => id);

  return (
    <DetailLayout
      color={achievementCategory.icon?.color ?? undefined}
      title={data.name}
      icon={achievementCategory.icon}
      breadcrumb={`Achievements › ${achievementCategory.achievementGroup ? localizedName(achievementCategory.achievementGroup, language) : 'Unknown Group'}`}
    >
      {achievementCategory.removedFromApi && (
        <RemovedFromApiNotice type="achievement category"/>
      )}

      {data.description && (
        <p>{data.description}</p>
      )}

      <Headline id="achievements" actions={<ColumnSelect table={CurrentAchievements}/>}>Achievements</Headline>
      <CurrentAchievements.Table>
        <CurrentAchievements.Column id="id" title="ID" sortBy="id" hidden small align="right">
          {({ id }) => id}
        </CurrentAchievements.Column>
        <CurrentAchievements.Column id="achievement" title="Achievement" sortBy={`name_${language}`}>
          {(achievement) => <AchievementLink achievement={achievement}/>}
        </CurrentAchievements.Column>
        <CurrentAchievements.Column id="points" align="right" title="AP" sortBy="points">
          {({ points }) => <AchievementPoints points={points}/>}
        </CurrentAchievements.Column>
        <CurrentAchievements.Column id="mastery" title={<><Icon icon="mastery"/> Mastery</>} sortBy="mastery">
          {({ mastery }) => mastery === 'Unknown' ? 'EoD / SotO' : mastery}
        </CurrentAchievements.Column>
        <CurrentAchievements.Column id="title" title={<><Icon icon="title"/> Title</>} sortBy={({ rewardsTitle }) => rewardsTitle.length}>
          {({ rewardsTitle }) => rewardsTitle.map((title) => <span key={title.id} dangerouslySetInnerHTML={{ __html: format(localizedName(title, language)) }}/>)}
        </CurrentAchievements.Column>
        <CurrentAchievements.Column id="items" title="Items" sortBy={({ rewardsItem }) => rewardsItem.length}>
          {({ rewardsItem }) => rewardsItem.length > 0 && (
            <ItemList singleColumn>
              {rewardsItem.map((item) => (
                <li key={item.id}><ItemLink item={item} icon={32}/></li>
              ))}
            </ItemList>
          )}
        </CurrentAchievements.Column>
        <CurrentAchievements.DynamicColumns headers={<AccountAchievementProgressHeader/>}>
          {({ id }) => <AccountAchievementProgressRow achievementId={id}/>}
        </CurrentAchievements.DynamicColumns>
      </CurrentAchievements.Table>

      {historicAchievements.length > 0 && (
        <>
          <Headline id="historic">Historic <Tip tip={<p>Historic achievements have either been removed from the game or are part of a rotation.</p>}><Icon icon="info"/></Tip></Headline>
          <ItemList>
            {historicAchievements.map((achievement) => (
              <li key={achievement.id}><AchievementLink achievement={achievement}/></li>
            ))}
          </ItemList>
        </>
      )}

      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};

export default AchievementCategoryPage;

export async function generateMetadata({ params }: AchievementCategoryPageProps): Promise<Metadata> {
  const id = Number(params.id);

  const achievementCategory = await db.achievementCategory.findUnique({
    where: { id },
    select: { name_de: true, name_en: true, name_es: true, name_fr: true }
  });

  if(!achievementCategory) {
    notFound();
  }

  return {
    title: localizedName(achievementCategory, params.language)
  };
}
