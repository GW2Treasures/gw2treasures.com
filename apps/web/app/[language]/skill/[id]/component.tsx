import Link from 'next/link';
import type { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { FormatDate } from '@/components/Format/FormatDate';
import { Json } from '@/components/Format/Json';
import { SkillTooltip } from '@/components/Skill/SkillTooltip';
import { SkillInfobox } from '@/components/Skill/SkillInfobox';
import { getRevision, getSkill } from './getSkill';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { SkillLinkTooltip } from '@/components/Skill/SkillLinkTooltip';
import { getLinkProperties } from '@/lib/linkProperties';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Icon } from '@gw2treasures/ui';
import { FlexRow } from '@gw2treasures/ui/components/Layout/FlexRow';
import { pageView } from '@/lib/pageView';
import { parseIcon } from '@/lib/parseIcon';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { ItemList } from '@/components/ItemList/ItemList';
import { TraitLink } from '@/components/Trait/TraitLink';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { getProfessionColor } from '@/components/Profession/icon';
import { SkillLink } from '@/components/Skill/SkillLink';
import { isDefined } from '@gw2treasures/helper/is';

export interface SkillPageComponentProps {
  language: Language;
  skillId: number;
  revisionId?: string;
}

export const SkillPageComponent: FC<SkillPageComponentProps> = async ({ language, skillId, revisionId }) => {
  const fixedRevision = revisionId !== undefined;

  const [skill, { revision, data }] = await Promise.all([
    getSkill(skillId, language),
    getRevision(skillId, language, revisionId),
    pageView('skill', skillId)
  ]);

  if(!skill || !revision || !data) {
    notFound();
  }

  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbItem name="Skill"/>
      {data.professions?.length === 1 && <BreadcrumbItem name={data.professions[0]} href={`/professions/${data.professions[0]}`}/>}
      {data.attunement && <BreadcrumbItem name={data.attunement}/>}
      {(data.type !== 'Weapon' || !data.weapon_type) && data.type && <BreadcrumbItem name={data.type}/>}
      {data.weapon_type && data.weapon_type !== 'None' && <BreadcrumbItem name={data.weapon_type}/>}
    </Breadcrumb>
  );

  const icon = parseIcon(data.icon);

  const flipOrFlippedSkills = [skill.flipSkill, ...skill.flippedSkill].filter(isDefined).filter((flip) => !skill.chainSkills.some(({ id }) => flip.id !== id));

  return (
    <DetailLayout
      title={data.name}
      icon={icon?.id === skill.icon?.id ? skill.icon : (icon ? { ...icon, color: null } : null)}
      iconType="skill"
      breadcrumb={breadcrumb}
      color={data.professions?.length === 1 ? getProfessionColor(data.professions[0]) : skill.icon?.color ?? undefined}
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
      <SkillTooltip skill={data} language={language} hideTitle/>

      {!fixedRevision && skill.affectedByTraits.length > 0 && (
        <>
          <Headline id="affected-by">Affected by</Headline>
          <ItemList>
            {skill.affectedByTraits.map((trait) => (
              <li key={trait.id}><TraitLink trait={trait}/></li>
            ))}
          </ItemList>
        </>
      )}

      {!fixedRevision && flipOrFlippedSkills.length > 0 && (
        <>
          <Headline id="chain">Flip Skills</Headline>
          <ItemList>
            {flipOrFlippedSkills.map((skill) => (
              <li key={skill.id}><SkillLink skill={skill}/></li>
            ))}
          </ItemList>
        </>
      )}

      {!fixedRevision && skill.chainSkills.length > 0 && (
        <>
          <Headline id="chain">Chain Skills</Headline>
          <ItemList>
            {skill.chainSkills.map((skill) => (
              <li key={skill.id}><SkillLink skill={skill}/></li>
            ))}
          </ItemList>
        </>
      )}

      <Headline id="history">History</Headline>

      <Table>
        <thead>
          <tr>
            <Table.HeaderCell small/>
            <Table.HeaderCell small>Build</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell small>Date</Table.HeaderCell>
            <Table.HeaderCell small>Actions</Table.HeaderCell>
          </tr>
        </thead>
        <tbody>
          {skill.history.map((history) => (
            <tr key={history.revisionId}>
              <td style={{ paddingRight: 0 }}>{history.revisionId === revision.id && <Tip tip="Currently viewing"><Icon icon="eye"/></Tip>}</td>
              <td>{history.revision.buildId !== 0 ? (<Link href={`/build/${history.revision.buildId}`}>{history.revision.buildId}</Link>) : '-'}</td>
              <td>
                <Tooltip content={<SkillLinkTooltip skill={getLinkProperties(skill)} language={language} revision={history.revisionId}/>}>
                  <Link href={`/skill/${skill.id}/${history.revisionId}`}>
                    {history.revision.description}
                  </Link>
                </Tooltip>
              </td>
              <td><FormatDate date={history.revision.createdAt} relative/></td>
              <td>
                {history.revisionId !== revision.id && (
                  <FlexRow>
                    <Link href={`/skill/${skill.id}/${history.revisionId}`}>View</Link> ·
                    <Link href={`/skill/diff/${history.revisionId}/${revision.id}`}>Compare</Link>
                  </FlexRow>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};
