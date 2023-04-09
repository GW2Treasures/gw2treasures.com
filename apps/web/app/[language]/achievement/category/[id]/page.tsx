import { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { Gw2Api } from 'gw2-api-types';
import { ItemList } from '@/components/ItemList/ItemList';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { localizedName } from '@/lib/localizedName';
import { Headline } from '@/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { Tip } from '@/components/Tip/Tip';
import { notFound } from 'next/navigation';
import Icon from 'icons/Icon';
import { remember } from '@/lib/remember';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';

export const dynamic = 'force-dynamic';

const getData = remember(60, async function getData(id: number, language: Language) {
  const [achievementCategory, revision] = await Promise.all([
    db.achievementCategory.findUnique({
      where: { id },
      include: {
        icon: true,
        achievements: { include: { icon: true }},
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

async function AchievementCategoryPage({ params: { language, id }}: { params: { language: Language, id: string }}) {
  const achievementCategoryId = Number(id);

  if(isNaN(achievementCategoryId)) {
    notFound();
  }

  const { achievementCategory, revision } = await getData(achievementCategoryId, language);

  const data: Gw2Api.Achievement.Category = JSON.parse(revision.data);

  const historicAchievements = achievementCategory.achievements.filter(({ historic }) => historic);

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
      <ItemList>
        {achievementCategory.achievements.filter(({ historic }) => !historic).map((achievement) => (
          <li key={achievement.id}><AchievementLink achievement={achievement}/></li>
        ))}
      </ItemList>

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
