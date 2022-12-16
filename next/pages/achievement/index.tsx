import { AchievementCategory, AchievementGroup, Language, Revision } from '@prisma/client';
import { NextPage } from 'next';
import { db } from '../../lib/prisma';
import { Headline } from '@/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { getServerSideSuperProps, withSuperProps } from '../../lib/superprops';
import { HeroLayout } from '@/components/Layout/HeroLayout';
import { localizedName } from '../../lib/localizedName';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { Gw2Api } from 'gw2-api-types';
import { AchievementCategoryLink } from '@/components/Achievement/AchievementCategoryLink';
import { WithIcon } from '../../lib/with';

interface AchievementPageProps {
  groups: (AchievementGroup & {
    achievementCategories: WithIcon<AchievementCategory>[];
    current_de: Revision;
    current_en: Revision;
    current_es: Revision;
    current_fr: Revision;
  })[]
};

const AchievementPage: NextPage<AchievementPageProps> = ({ groups }) => {
  const { locale } = useRouter();

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

export const getServerSideProps = getServerSideSuperProps<AchievementPageProps>(async ({ locale }) => {
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

  return {
    props: { groups },
  };
});

export default withSuperProps(AchievementPage);

