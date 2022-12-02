import { GetStaticPaths, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon as DbIcon, Language, Revision, Skill, SkillHistory } from '@prisma/client';
import DetailLayout from '../../../components/Layout/DetailLayout';
import { Skeleton } from '../../../components/Skeleton/Skeleton';
import { Table } from '../../../components/Table/Table';
import { TableOfContentAnchor } from '../../../components/TableOfContent/TableOfContent';
import { Gw2Api } from 'gw2-api-types';
import { db } from '../../../lib/prisma';
import { getStaticSuperProps, withSuperProps } from '../../../lib/superprops';
import { Infobox } from '../../../components/Infobox/Infobox';
import { Headline } from '../../../components/Headline/Headline';
import { FormatDate } from '../../../components/Format/FormatDate';
import { Json } from '../../../components/Format/Json';
import { SkillIcon } from '../../../components/Skill/SkillIcon';
import { SkillTooltip } from '../../../components/Skill/SkillTooltip';
import { SkillInfobox } from '../../../components/Skill/SkillInfobox';


export interface SkillPageProps {
  skill: Skill & {
    icon?: DbIcon | null,
    history: (SkillHistory & {
      revision: {
        id: string;
        buildId: number;
        createdAt: Date;
        description: string | null;
        language: Language;
      };
    })[];
  };
  revision: Revision;
  fixedRevision: boolean;
}

const SkillPage: NextPage<SkillPageProps> = ({ skill, revision, fixedRevision }) => {
  const router = useRouter();

  if(!skill) {
    return <DetailLayout title={<Skeleton/>} breadcrumb={<Skeleton/>}><Skeleton/></DetailLayout>;
  }

  const data: Gw2Api.Skill = JSON.parse(revision.data);

  const breadcrumb = [
    'Skill',
    data.professions?.length === 1 && data.professions,
    data.attunement,
    (data.type !== 'Weapon' || !data.weapon_type) && data.type,
    data.weapon_type !== 'None' && data.weapon_type,
  ].filter(Boolean).join(' › ');

  return (
    <DetailLayout title={data.name} icon={skill.icon ? <SkillIcon icon={skill.icon}/> : undefined} breadcrumb={breadcrumb} infobox={<SkillInfobox skill={skill} data={data}/>}>
      {skill[`currentId_${router.locale as Language}`] !== revision.id && (
        <Infobox icon="revision">You are viewing an old revision of this skill (Build {revision.buildId || 'unknown'}). <Link href={`/skill/${skill.id}`}>View current.</Link></Infobox>
      )}
      {skill[`currentId_${router.locale as Language}`] === revision.id && fixedRevision && (
        <Infobox icon="revision">You are viewing this skill at a fixed revision (Build {revision.buildId || 'unknown'}). <Link href={`/skill/${skill.id}`}>View current.</Link></Infobox>
      )}
      {!fixedRevision && skill.removedFromApi && (
        <Infobox type="warning" icon="revision">This skill is currently not available in the Guild Wars 2 Api and you are seeing the last know version. The skill has either been removed from the game or needs to be rediscovered.</Infobox>
      )}

      <TableOfContentAnchor id="tooltip">Tooltip</TableOfContentAnchor>
      <SkillTooltip data={data}/>

      <Headline id="history">History</Headline>

      <Table>
        <thead>
          <tr><th {...{ width: 1 }}>Build</th><th {...{ width: 1 }}>Language</th><th>Description</th><th {...{ width: 1 }}>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {skill.history.map((history) => (
            <tr key={history.revisionId}>
              <td>{history.revisionId === revision.id ? <b>{history.revision.buildId || '-'}</b> : history.revision.buildId || '-'}</td>
              <td>{history.revision.language}</td>
              <td><Link href={`/skill/${skill.id}/${history.revisionId}`}>{history.revision.description}</Link></td>
              <td><FormatDate date={history.revision.createdAt} relative/></td>
              <td>{revision.id !== history.revisionId && (<Link href={`/skill/diff/${history.revisionId}/${revision.id}`}>Compare</Link>)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};

export const getStaticProps = getStaticSuperProps<SkillPageProps>(async ({ params, locale }) => {
  const id: number = Number(params!.id!.toString())!;
  const language = (locale ?? 'en') as Language;

  const [skill, revision] = await Promise.all([
    db.skill.findUnique({
      where: { id },
      include: {
        history: {
          include: { revision: { select: { id: true, buildId: true, createdAt: true, description: true, language: true }}},
          where: { revision: { language }},
          orderBy: { revision: { createdAt: 'desc' }}
        },
        icon: true,
      }
    }),
    db.revision.findFirst({ where: { [`currentSkill_${language}`]: { id }}})
  ]);

  if(!skill || !revision) {
    return {
      notFound: true
    };
  }

  return {
    props: { skill, revision, fixedRevision: false },
    revalidate: 600 /* 10 minutes */
  };
});

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default withSuperProps(SkillPage);
