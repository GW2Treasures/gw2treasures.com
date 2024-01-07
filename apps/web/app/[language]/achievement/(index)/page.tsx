import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { localizedName } from '@/lib/localizedName';
import { Fragment } from 'react';
import type { Gw2Api } from 'gw2-api-types';
import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import type { Language } from '@gw2treasures/database';
import { remember } from '@/lib/remember';
import { ResetTimer } from './reset-timer';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import Link from 'next/link';
import { pageView } from '@/lib/pageView';

const getAchivementGroups = remember(60, async function getAchivementGroups(language: string) {
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
    orderBy: [{ removedFromApi: 'asc' }, { order: 'asc' }]
  });

  return groups;
});

export default async function AchievementPage({ params: { language }}: { params: { language: Language }}) {
  const groups = await getAchivementGroups(language);
  await pageView('achievement');

  return (
    <HeroLayout hero={<Headline id="achievements" actions={<ResetTimer/>}>Achievements</Headline>} color="#663399" toc>
      {groups.map((group) => {
        const data: Gw2Api.Achievement.Group = JSON.parse(group[`current_${language}`].data);

        return (
          <Fragment key={group.id}>
            <Headline id={group.id}>{localizedName(group, language)}</Headline>
            {group.removedFromApi && (
              <RemovedFromApiNotice type="achievement group"/>
            )}
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

      <Headline id="uncategorized">Uncategorized</Headline>
      <p>Achievements that are currently not assigned to any category.</p>
      <Link href="/achievement/uncategorized">Uncategorized Achievements</Link>
    </HeroLayout>
  );
};

export const metadata = {
  title: 'Achievements'
};
