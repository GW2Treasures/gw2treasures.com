import { FunctionComponent, ReactElement } from 'react';
import Link from 'next/link';
import { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import { Gw2Api } from 'gw2-api-types';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FormatDate } from '@/components/Format/FormatDate';
import { Json } from '@/components/Format/Json';
import { SkillTooltip } from '@/components/Skill/SkillTooltip';
import { SkillInfobox } from '@/components/Skill/SkillInfobox';
import { getSkill } from './getSkill';
import { AsyncComponent } from '@/lib/asyncComponent';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';

export interface SkillPageComponentProps {
  language: Language;
  skillId: number;
  revisionId?: string;
}

export const SkillPageComponent: AsyncComponent<SkillPageComponentProps> = async ({ language, skillId, revisionId }) => {
  const fixedRevision = revisionId !== undefined;
  const { skill, revision } = await getSkill(skillId, language, revisionId);

  const data: Gw2Api.Skill = JSON.parse(revision.data);

  const breadcrumb = [
    'Skill',
    data.professions?.length === 1 && data.professions,
    data.attunement,
    (data.type !== 'Weapon' || !data.weapon_type) && data.type,
    data.weapon_type !== 'None' && data.weapon_type,
  ].filter(Boolean).join(' › ');

  return (
    <DetailLayout
      title={data.name}
      icon={skill.icon}
      iconType="skill"
      breadcrumb={breadcrumb}
      infobox={<SkillInfobox skill={skill} data={data} language={language}/>}
    >
      {skill[`currentId_${language}`] !== revision.id && (
        <Notice icon="revision">You are viewing an old revision of this skill (Build {revision.buildId || 'unknown'}). <Link href={`/skill/${skill.id}`}>View current.</Link></Notice>
      )}
      {skill[`currentId_${language}`] === revision.id && fixedRevision && (
        <Notice icon="revision">You are viewing this skill at a fixed revision (Build {revision.buildId || 'unknown'}). <Link href={`/skill/${skill.id}`}>View current.</Link></Notice>
      )}
      {!fixedRevision && skill.removedFromApi && (
        <RemovedFromApiNotice type="skill"/>
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
