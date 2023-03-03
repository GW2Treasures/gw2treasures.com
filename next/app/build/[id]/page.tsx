import { Language } from '@prisma/client';
import DetailLayout from '@/components/Layout/DetailLayout';
import { db } from '../../../lib/prisma';
import { FormatDate } from '@/components/Format/FormatDate';
import { Headline } from '@/components/Headline/Headline';
import { ItemList } from '@/components/ItemList/ItemList';
import { SkillLink } from '@/components/Skill/SkillLink';
import { ItemLink } from '@/components/Item/ItemLink';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AsyncComponent } from '@/lib/asyncComponent';
import { FC, Suspense } from 'react';
import { SkeletonLink } from '@/components/Link/SkeletonLink';
import { getLanguage } from '@/components/I18n/getLanguage';

export const dynamic = 'force-dynamic';

async function getBuild(buildId: number) {
  const build = await db.build.findUnique({
    where: { id: buildId },
  });

  if(!build) {
    notFound();
  }

  return build;
}

function getUpdatedItems(buildId: number, language: Language) {
  return db.item.findMany({
    where: { history: { some: { revision: { buildId, type: 'Update', language, entity: 'Item' }}}},
    include: { icon: true },
    take: 500,
  });
}

function getUpdatedSkills(buildId: number, language: Language) {
  return db.skill.findMany({
    where: { history: { some: { revision: { buildId, type: 'Update', language }}}},
    include: { icon: true, history: { where: { revision: { buildId: { lte: buildId }, language }}, take: 2, orderBy: { revision: { buildId: 'desc' }}}},
    take: 500,
  });
}

async function BuildDetail({ params }: { params: { id: string }}) {
  const language = getLanguage();
  const id: number = Number(params.id);

  const itemsPromise = getUpdatedItems(id, language);
  const skillsPromise = getUpdatedSkills(id, language);

  const build = await getBuild(id);

  return (
    <DetailLayout title={build.id} breadcrumb="Build">
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
  const items = await itemsPromise;

  return (
    <>
      <Headline id="items">Updated items ({items.length})</Headline>
      <ItemList>
        {items.map((item) => <li key={item.id}><ItemLink item={item}/></li>)}
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
