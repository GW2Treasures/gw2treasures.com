import { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '@/lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkillLink } from '@/components/Skill/SkillLink';
import { ItemLink } from '@/components/Item/ItemLink';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AsyncComponent } from '@/lib/asyncComponent';
import { FC, Suspense } from 'react';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { remember } from '@/lib/remember';
import { linkProperties } from '@/lib/linkProperties';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface BuildPageProps {
  params: { language: Language, id: string }
}

function timed<Args extends any[], Out>(callback: (...args: Args) => Promise<Out>): (...args: Args) => Promise<Out> {
  const timedFunction = async (...args: Args): Promise<Out> => {
    const start = new Date();
    const result = await callback(...args);
    const end = new Date();

    console.log(`timed - ${callback.name} - took ${end.valueOf() - start.valueOf()}ms`);

    return result;
  };

  return timedFunction;
}

const getBuild = remember(60, timed(async function getBuild(buildId: number) {
  const build = await db.build.findUnique({
    where: { id: buildId },
  });

  if(!build) {
    notFound();
  }

  return build;
}));

const getUpdatedItems = remember(60, timed(function getUpdatedItems(buildId: number, language: Language) {
  // return db.item.findMany({
  //   where: { history: { some: { revision: { buildId, type: 'Update', language, entity: 'Item' }}}},
  //   include: { icon: true },
  //   take: 500,
  // });

  return db.revision.findMany({
    where: { buildId, type: 'Update', language, entity: 'Item' },
    include: { itemHistory: { include: { item: { select: linkProperties }}}},
    take: 500,
  });
}));

const getUpdatedSkills = remember(60, timed(function getUpdatedSkills(buildId: number, language: Language) {
  return db.skill.findMany({
    where: { history: { some: { revision: { buildId, type: 'Update', language }}}},
    include: {
      icon: true,
      history: {
        select: { revisionId: true },
        where: { revision: { buildId: { lte: buildId }, language }},
        take: 2,
        orderBy: { revision: { buildId: 'desc' }}
      }
    },
    take: 500,
  });
}));

async function BuildDetail({ params: { id, language }}: BuildPageProps) {
  const buildId: number = Number(id);

  const itemsPromise = getUpdatedItems(buildId, language);
  const skillsPromise = getUpdatedSkills(buildId, language);

  const build = await getBuild(buildId);

  return (
    <DetailLayout title={`Build ${build.id}`} breadcrumb="Build">
      Released on <FormatDate date={build.createdAt} data-superjson/>

      <Suspense fallback={<Fallback headline="Updated items" id="items"/>}>
        {/* @ts-expect-error Server Component */}
        <UpdatedItems itemsPromise={itemsPromise}/>
      </Suspense>

      <Suspense fallback={<Fallback headline="Updated skills" id="skills"/>}>
        {/* @ts-expect-error Server Component */}
        <UpdatedSkills skillsPromise={skillsPromise}/>
      </Suspense>

    </DetailLayout>
  );
};

const Fallback: FC<{ headline: string, id: string }> = ({ headline, id }) => {
  return (
    <>
      <Headline id={id}>{headline}</Headline>
      <ItemList>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
        <li><SkeletonLink/></li>
      </ItemList>
    </>
  );
};

const UpdatedItems: AsyncComponent<{ itemsPromise: ReturnType<typeof getUpdatedItems> }> = async function({ itemsPromise }) {
  const itemRevisions = await itemsPromise;

  return (
    <>
      <Headline id="items">Updated items ({itemRevisions.length})</Headline>
      <ItemList>
        {itemRevisions.map((revision) => (
          <li key={revision.id}><ItemLink item={revision.itemHistory!.item} revision={revision.id}/></li>
        ))}
      </ItemList>
    </>
  );
};

const UpdatedSkills: AsyncComponent<{ skillsPromise: ReturnType<typeof getUpdatedSkills> }> = async function({ skillsPromise }) {
  const skills = await skillsPromise;

  return (
    <>
      <Headline id="skills">Updated skills ({skills.length})</Headline>
      <ItemList>
        {skills.map((skill) => (
          <li key={skill.id}>
            <SkillLink skill={skill}/>
            <Link href={`/skill/diff/${skill.history[1].revisionId}/${skill.history[0].revisionId}`}>Compare</Link>
          </li>
        ))}
      </ItemList>
    </>
  );
};

export default BuildDetail;

export function generateMetadata({ params: { id }}: BuildPageProps): Metadata {
  return {
    title: `Build ${id}`,
  };
};
