import { Language } from '@prisma/client';
import { db } from '../../lib/prisma';
import { Headline } from '@/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { localizedName } from '../../lib/localizedName';
import { Fragment } from 'react';
import { Gw2Api } from 'gw2-api-types';
import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import { cookies } from 'next/headers';

async function getAchivementGroups(locale: string) {
  // force dynamic rendering, because the db is not availabe at build time
  cookies();

  const groups = await db.achievementGroup.findMany({
    include: {
      achievementCategories: {
        orderBy: { order: 'asc' },
        include: { icon: true }
      },
      current_de: locale === 'de',
      current_en: locale === 'en',
      current_es: locale === 'es',
      current_fr: locale === 'fr',
    },
    orderBy: { order: 'asc' }
  });

  return groups;
}

async function AchievementPage() {
  const locale = 'en'; // TODO
  const groups = await getAchivementGroups(locale);

  return (
    <HeroLayout hero={<Headline id="skins">Achievements</Headline>} color="#663399" toc>
      {groups.map((group) => {
        const data: Gw2Api.Achievement.Group = JSON.parse(group[`current_${locale as Language}`].data);

        return (
          <Fragment key={group.id}>
            <Headline id={group.id}>{localizedName(group, locale as Language)}</Headline>
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

