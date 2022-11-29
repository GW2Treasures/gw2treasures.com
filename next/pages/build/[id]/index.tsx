import { GetStaticPaths, NextPage } from 'next';
import { Build, Item, Language, Skill } from '@prisma/client';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import { FormatDate } from '../../../components/Format/FormatDate';
import { Headline } from '../../../components/Headline/Headline';

export interface BuildDetailProps {
  build: Build;
  items: Item[];
  skills: Skill[];
}

const BuildDetail: NextPage<BuildDetailProps> = ({ build, items, skills }) => {
  if(!build) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  return (
    <DetailLayout title={build.id} breadcrumb="Build">
      Released on <FormatDate date={build.createdAt}/>

      <Headline id="items">Updated items</Headline>
      {items.length}

      <Headline id="skills">Updated skills</Headline>
      {skills.length}
    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<BuildDetailProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  const [build, items, skills] = await Promise.all([
    db.build.findUnique({
      where: { id },
    }),
    db.item.findMany({
      where: { history: { some: { revision: { buildId: id, description: 'Updated in API' }}}},
      take: 500,
    }),
    db.skill.findMany({
      where: { history: { some: { revision: { buildId: id, description: 'Updated in API' }}}},
      take: 500,
    }),
  ]);

  if(!build) {
    return {
      notFound: true
    };
  }

  return {
    props: { build, items, skills },
    revalidate: 600 /* 10 minutes */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withSuperProps(BuildDetail);
