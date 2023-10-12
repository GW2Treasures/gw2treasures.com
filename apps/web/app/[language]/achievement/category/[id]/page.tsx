import { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { Gw2Api } from 'gw2-api-types';
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
import { Metadata } from 'next';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { linkProperties } from '@/lib/linkProperties';
import { ItemLink } from '@/components/Item/ItemLink';
import { AccountAchievementProgressHeader, AccountAchievementProgressRow } from '@/components/Achievement/AccountAchievementProgress';
import { AchievementPoints } from '@/components/Achievement/AchievementPoints';

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
        achievements: { include: { icon: true, rewardsItem: { select: linkProperties }}},
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

  return (
    <DetailLayout
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

      <Headline id="achievements">Achievements</Headline>
      <Table>
        <thead>
          <tr>
            <Table.HeaderCell>Achievement</Table.HeaderCell>
            <Table.HeaderCell align="right">AP <Icon icon="achievement_points"/></Table.HeaderCell>
            <Table.HeaderCell>Mastery <Icon icon="mastery"/></Table.HeaderCell>
            <Table.HeaderCell small>Items</Table.HeaderCell>
            <AccountAchievementProgressHeader/>
          </tr>
        </thead>
        <tbody>
          {currentAchievements.map((achievement) => (
            <tr key={achievement.id}>
              <td><AchievementLink achievement={achievement}/></td>
              <td align="right"><AchievementPoints points={achievement.points}/></td>
              <td>{achievement.mastery === 'Unknown' ? 'EoD / SotO' : achievement.mastery}</td>
              <td>{achievement.rewardsItem.length > 0 && (
                <ItemList>
                  {achievement.rewardsItem.map((item) => (
                    <li key={item.id}><ItemLink item={item} icon={32}/></li>
                  ))}
                </ItemList>
              )}
              </td>
              <AccountAchievementProgressRow achievementId={achievement.id}/>
            </tr>
          ))}
        </tbody>
      </Table>

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
