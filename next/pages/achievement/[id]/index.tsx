import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Achievement, AchievementCategory, AchievementGroup, Icon as DbIcon, Language, Revision } from '@prisma/client';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import { getIconUrl } from '../../../components/Item/ItemIcon';
import { Gw2Api } from 'gw2-api-types';
import { localizedName } from '../../../lib/localizedName';
import { Headline } from '../../../components/Headline/Headline';
import { Json } from '../../../components/Format/Json';

export interface AchievementPageProps {
  achievement: Achievement & {
    icon?: DbIcon | null,
    achievementCategory?: (AchievementCategory & {
      achievementGroup?: AchievementGroup | null
    }) | null,
  };
  revision: Revision;
}

const AchievementPage: NextPage<AchievementPageProps> = ({ achievement, revision }) => {
  const router = useRouter();

  if(!achievement) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={achievement.icon && getIconUrl(achievement.icon, 64) || undefined} breadcrumb={`Achievements › ${achievement.achievementCategory?.achievementGroup ? localizedName(achievement.achievementCategory?.achievementGroup, router.locale as Language) : 'Unknown Group'} › ${achievement.achievementCategory ? localizedName(achievement.achievementCategory, router.locale as Language) : 'Unknown Category'}`}>
      <p>{data.description}</p>

      <Headline id="data">Data</Headline>
      <Json data={data}/>
    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<AchievementPageProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  const [achievement, revision] = await Promise.all([
    db.achievement.findUnique({
      where: { id },
      include: {
        icon: true,
        achievementCategory: { include: { achievementGroup: true }},
      }
    }),
    db.revision.findFirst({ where: { [`currentAchievement_${language}`]: { id }}})
  ]);

  if(!achievement || !revision) {
    return {
      notFound: true
    };
  }

  return {
    props: { achievement, revision },
    revalidate: 600 /* 10 minutes */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withSuperProps(AchievementPage);
