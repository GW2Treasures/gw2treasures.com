import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Achievement, AchievementCategory, AchievementGroup, Language, Revision } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import { getIconUrl } from '@/components/Item/ItemIcon';
import { Gw2Api } from 'gw2-api-types';
import { localizedName } from '../../../lib/localizedName';
import { Headline } from '@/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { formatNumber, FormatNumber } from '@/components/Format/FormatNumber';
import { Separator } from '@/components/Layout/Separator';
import Icon from '../../../icons/Icon';
import { WithIcon, WithOptional } from '../../../lib/with';

export interface AchievementPageProps {
  achievement: WithOptional<WithIcon<Achievement>, {
    achievementCategory: WithOptional<AchievementCategory, {
      achievementGroup: AchievementGroup
    }>,
  }>;
  revision: Revision;
}

type FallbackProps<T> = T | { [P in keyof T]: undefined }

const AchievementPage: NextPage<FallbackProps<AchievementPageProps>> = ({ achievement, revision }) => {
  const router = useRouter();

  if(!achievement) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Gw2Api.Achievement = JSON.parse(revision.data);

  return (
    <DetailLayout title={data.name} icon={achievement.icon && getIconUrl(achievement.icon, 64) || undefined} breadcrumb={`Achievements › ${achievement.achievementCategory?.achievementGroup ? localizedName(achievement.achievementCategory?.achievementGroup, router.locale as Language) : 'Unknown Group'} › ${achievement.achievementCategory ? localizedName(achievement.achievementCategory, router.locale as Language) : 'Unknown Category'}`}>
      <p>{data.description}</p>


      <Headline id="objectives">Objectives</Headline>
      {data.requirement.replace('  ', ` ${formatNumber(data.tiers[data.tiers.length - 1].count)} `)}

      <Headline id="tiers">Tiers</Headline>
      {data.tiers.map((tier) => (
        <div key={tier.count}>{tier.points} <Icon icon="achievementPoints"/>: <FormatNumber value={tier.count}/> objectives completed</div>
      ))}
      <Separator/>
      <div>Total: {data.tiers.reduce((total, tier) => total + tier.points, 0)} <Icon icon="achievementPoints"/></div>

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
