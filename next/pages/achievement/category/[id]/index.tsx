import { GetStaticPaths, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Achievement, AchievementCategory, AchievementCategoryHistory, AchievementGroup, Language, Revision } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { db } from '../../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../../lib/superprops';
import { getIconUrl } from '@/components/Item/ItemIcon';
import { Gw2Api } from 'gw2-api-types';
import { ItemList } from '@/components/ItemList/ItemList';
import { AchievementLink } from '@/components/Achievement/AchievementLink';
import { localizedName } from '../../../../lib/localizedName';
import { Headline } from '@/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { Tip } from '@/components/Tip/Tip';
import Icon from '../../../../icons/Icon';
import { WithIcon } from '../../../../lib/with';
import { Table } from '@/components/Table/Table';
import Link from 'next/link';
import { FormatDate } from '@/components/Format/FormatDate';

export interface AchievementCategoryPageProps {
  achievementCategory: WithIcon<AchievementCategory> & {
    achievements: WithIcon<Achievement>[],
    achievementGroup?: AchievementGroup | null,
    history: (AchievementCategoryHistory & {
      revision: {
        id: string;
        buildId: number;
        createdAt: Date;
        description: string | null;
        language: Language;
      };
    })[],
  };
  revision: Revision;
}

const AchievementCategoryPage: NextPage<AchievementCategoryPageProps> = ({ achievementCategory, revision }) => {
  const router = useRouter();

  if(!achievementCategory) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Gw2Api.Achievement.Category = JSON.parse(revision.data);

  const historicAchievements = achievementCategory.achievements.filter(({ historic }) => historic);

  return (
    <DetailLayout
      title={data.name}
      icon={achievementCategory.icon && getIconUrl(achievementCategory.icon, 64) || undefined}
      breadcrumb={`Achievements › ${achievementCategory.achievementGroup ? localizedName(achievementCategory.achievementGroup, router.locale as Language) : 'Unknown Group'}`}
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

      <Headline id="history">History</Headline>

      <Table>
        <thead>
          <tr><th {...{ width: 1 }}>Build</th><th {...{ width: 1 }}>Language</th><th>Description</th><th {...{ width: 1 }}>Date</th></tr>
        </thead>
        <tbody>
          {achievementCategory.history.map((history) => (
            <tr key={history.revisionId}>
              <td>{history.revisionId === revision.id ? <b>{history.revision.buildId || '-'}</b> : history.revision.buildId || '-'}</td>
              <td>{history.revision.language}</td>
              <td><Link href={`/achievement/category/${achievementCategory.id}/${history.revisionId}`}>{history.revision.description}</Link></td>
              <td><FormatDate date={history.revision.createdAt} relative/></td>
            </tr>
          ))}
        </tbody>
      </Table>

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
        history: {
          include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
          where: { revision: { language }},
          orderBy: { revision: { createdAt: 'desc' }}
        },
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
