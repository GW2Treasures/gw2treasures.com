import { GetStaticPaths, NextPage } from 'next';
import { Build, Icon, Item, Language, Skill, SkillHistory } from '@prisma/client';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import { FormatDate } from '../../../components/Format/FormatDate';
import { Headline } from '../../../components/Headline/Headline';
import { ItemList } from '../../../components/ItemList/ItemList';
import { SkillLink } from '../../../components/Skill/SkillLink';
import { ItemLink } from '../../../components/Item/ItemLink';
import Link from 'next/link';

export interface BuildDetailProps {
  build: Build;
  items: Item[];
  skills: (Skill & {
    icon: Icon | null,
    history: SkillHistory[],
  })[];
}

const BuildDetail: NextPage<BuildDetailProps> = ({ build, items, skills }) => {
  if(!build) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  return (
    <DetailLayout title={build.id} breadcrumb="Build">
      Released on <FormatDate date={build.createdAt}/>

      <Headline id="items">Updated items ({items.length})</Headline>
      <ItemList>
        {items.map((item) => <li key={item.id}><ItemLink item={item}/></li>)}
      </ItemList>

      <Headline id="skills">Updated skills ({skills.length})</Headline>
      <ItemList>
        {skills.map((skill) => (
          <li key={skill.id}>
            <SkillLink skill={skill}/>
            <Link href={`/skill/diff/${skill.history[1].revisionId}/${skill.history[0].revisionId}`}>Compare</Link>
          </li>
        ))}
      </ItemList>
    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<BuildDetailProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  function timing<T>(name: string, p: Promise<T>): Promise<T> {
    const start = performance.now();

    return p.then((value: T) => {
      const end = performance.now();
      console.log(name, end - start);

      return value;
    });
  };

  const [build, items, skills] = await Promise.all([
    timing('build', db.build.findUnique({
      where: { id },
    })),
    timing('items', db.item.findMany({
      where: { history: { some: { revision: { buildId: id, type: 'Update', language, entity: 'Item' }}}},
      include: { icon: true },
      take: 500,
    })),
    timing('skills', db.skill.findMany({
      where: { history: { some: { revision: { buildId: id, type: 'Update', language }}}},
      include: { icon: true, history: { where: { revision: { buildId: { lte: id }, language }}, take: 2, orderBy: { revision: { buildId: 'desc' }}}},
      take: 500,
    })),
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
