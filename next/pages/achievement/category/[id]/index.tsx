import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Achievement, AchievementCategory, AchievementGroup, Icon as DbIcon, Language, Revision } from '@prisma/client';
import DetailLayout from '../../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../../components/Skeleton/Skeleton';
import { db } from '../../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../../lib/superprops';
import { getIconUrl } from '../../../../components/Item/ItemIcon';
import { Gw2Api } from 'gw2-api-types';
import { ItemList } from '../../../../components/ItemList/ItemList';
import { AchievementLink } from '../../../../components/Achievement/AchievementLink';
import { localizedName } from '../../../../lib/localizedName';
import { Headline } from '../../../../components/Headline/Headline';
import { Json } from '../../../../components/Format/Json';

export interface AchievementCategoryPageProps {
  achievementCategory: AchievementCategory & {
    icon?: DbIcon | null,
    achievements: (Achievement & { icon?: DbIcon | null })[],
    achievementGroup?: AchievementGroup | null,
  };
  revision: Revision;
}

const AchievementCategoryPage: NextPage<AchievementCategoryPageProps> = ({ achievementCategory, revision }) => {
  const router = useRouter();

  if(!achievementCategory) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Gw2Api.Achievement.Category = JSON.parse(revision.data);

  return (
    <DetailLayout
      title={data.name}
      icon={achievementCategory.icon && getIconUrl(achievementCategory.icon, 64) || undefined}
      breadcrumb={`Achievements › ${achievementCategory.achievementGroup ? localizedName(achievementCategory.achievementGroup, router.locale as Language) : 'Unknown Group'}`}
    >
      <p>{data.description}</p>

      <Headline id="achievements">Achievements</Headline>
      <ItemList>
        {achievementCategory.achievements.map((achievement) => (
          <li key={achievement.id}><AchievementLink achievement={achievement}/></li>
        ))}
      </ItemList>

      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<AchievementCategoryPageProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

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
    return {
      notFound: true
    };
  }

  return {
    props: { achievementCategory, revision },
    revalidate: 600 /* 10 minutes */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withSuperProps(AchievementCategoryPage);
