import { db } from '@/lib/prisma';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { localizedName } from '@/lib/localizedName';
import { Fragment } from 'react';
import type { AchievementGroup } from '@gw2api/types/data/achievement-group';
import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import Link from 'next/link';
import { pageView } from '@/lib/pageView';
import { cache } from '@/lib/cache';
import { ResetTimer } from '@/components/Reset/ResetTimer';
import { createMetadata } from '@/lib/metadata';
import { getLanguage } from '@/lib/translate';

const getAchievementGroups = cache(async (language: string) => {
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
}, ['achievement-groups'], { revalidate: 60 });

export default async function AchievementPage() {
  const language = await getLanguage();
  const groups = await getAchievementGroups(language);
  await pageView('achievement');

  return (
    <HeroLayout hero={<Headline id="achievements" actions={<span>Reset: <ResetTimer/></span>}>Achievements</Headline>} color="#663399" toc>
      {groups.map((group) => {
        const data: AchievementGroup = JSON.parse(group[`current_${language}`].data);
        const [active, historic] = group.achievementCategories.reduce<[typeof group.achievementCategories, typeof group.achievementCategories]>(
          ([a, h], category) => category.removedFromApi ? [a, [...h, category]] : [[...a, category], h],
          [[], []]
        );

        return (
          <Fragment key={group.id}>
            <Headline id={group.id}>{localizedName(group, language)}</Headline>
            {group.removedFromApi && (
              <RemovedFromApiNotice type="achievement group"/>
            )}
            <p>{data.description}</p>
            {active.length > 0 && (
              <ItemList>
                {active.map((category) => (
                  <li key={category.id}>
                    <AchievementCategoryLink achievementCategory={category}/>
                  </li>
                ))}
              </ItemList>
            )}
            {historic.length > 0 && (
              <>
                {!group.removedFromApi && (<p>The following achievement categories are currently not available in the Guild Wars 2 API.</p>)}
                <ItemList>
                  {historic.map((category) => (
                    <li key={category.id}>
                      <AchievementCategoryLink achievementCategory={category}/>
                    </li>
                  ))}
                </ItemList>
              </>
            )}
          </Fragment>
        );
      })}

      <Headline id="uncategorized">Uncategorized</Headline>
      <p>Achievements that are currently not assigned to any category.</p>
      <Link href="/achievement/uncategorized">Uncategorized Achievements</Link>
    </HeroLayout>
  );
}

export const generateMetadata = createMetadata({
  title: 'Achievements'
});
