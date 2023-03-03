import { db } from '@/lib/prisma';
import { Headline } from '@/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { localizedName } from '@/lib/localizedName';
import { Fragment } from 'react';
import { Gw2Api } from 'gw2-api-types';
import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import { getLanguage } from '@/components/I18n/getLanguage';

export const dynamic = 'force-dynamic';

async function getAchivementGroups(language: string) {
  const groups = await db.achievementGroup.findMany({
    include: {
      achievementCategories: {
        orderBy: { order: 'asc' },
        include: { icon: true }
      },
      current_de: language === 'de',
      current_en: language === 'en',
      current_es: language === 'es',
      current_fr: language === 'fr',
    },
    orderBy: { order: 'asc' }
  });

  return groups;
}

async function AchievementPage() {
  const language = getLanguage();
  const groups = await getAchivementGroups(language);

  return (
    <HeroLayout hero={<Headline id="achievements">Achievements</Headline>} color="#663399" toc>
      {groups.map((group) => {
        const data: Gw2Api.Achievement.Group = JSON.parse(group[`current_${language}`].data);

        return (
          <Fragment key={group.id}>
            <Headline id={group.id}>{localizedName(group, language)}</Headline>
            <p>{data.description}</p>
            <ItemList>
              {group.achievementCategories.map((category) => (
                <li key={category.id}>
                  <AchievementCategoryLink achievementCategory={category}/>
                </li>
              ))}
            </ItemList>
          </Fragment>
        );
      })}
    </HeroLayout>
  );
};

export default AchievementPage;

