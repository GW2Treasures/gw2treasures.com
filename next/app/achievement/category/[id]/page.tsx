import { Language } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { getIconUrl } from '@/lib/getIconUrl';
import { Gw2Api } from 'gw2-api-types';
import { ItemList } from '@/components/ItemList/ItemList';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { localizedName } from '@/lib/localizedName';
import { Headline } from '@/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { Tip } from '@/components/Tip/Tip';
import { notFound } from 'next/navigation';
import Icon from 'icons/Icon';
import { cookies } from 'next/headers';

async function getData(id: number, language: Language) {
  // force dynamic rendering, because the db is not availabe at build time
  cookies();

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
};

async function AchievementCategoryPage({ params }: { params: { id: string }}) {
  const locale = 'en'; // TODO
  const id: number = Number(params.id);
  const language = (locale ?? 'en') as Language;

  if(isNaN(id)) {
    notFound();
  }

  const { achievementCategory, revision } = await getData(id, language);

  const data: Gw2Api.Achievement.Category = JSON.parse(revision.data);

  const historicAchievements = achievementCategory.achievements.filter(({ historic }) => historic);

  return (
    <DetailLayout
      title={data.name}
      icon={achievementCategory.icon && getIconUrl(achievementCategory.icon, 64) || undefined}
      breadcrumb={`Achievements › ${achievementCategory.achievementGroup ? localizedName(achievementCategory.achievementGroup, locale as Language) : 'Unknown Group'}`}
    >
      <p>{data.description}</p>

      <Headline id="achievements">Achievements</Headline>
      <ItemList>
        {achievementCategory.achievements.filter(({ historic }) => !historic).map((achievement) => (
          <li key={achievement.id}><AchievementLink achievement={achievement}/></li>
        ))}
      </ItemList>

      {historicAchievements.length > 0 && (
        <>
          <Headline id="historic" actions={<Tip tip={<p>Historic achievements have either been removed from the game or are part of a rotation.</p>}><Icon icon="info"/></Tip>}>Historic</Headline>
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
