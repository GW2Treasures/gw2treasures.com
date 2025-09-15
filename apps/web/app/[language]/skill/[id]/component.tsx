import Link from 'next/link';
import type { Language } from '@gw2treasures/database';
import DetailLayout from '@/components/Layout/DetailLayout';
import { TableOfContentAnchor } from '@gw2treasures/ui/components/TableOfContent/TableOfContent';
import { Notice } from '@gw2treasures/ui/components/Notice/Notice';
import { Headline } from '@gw2treasures/ui/components/Headline/Headline';
import { Json } from '@/components/Format/Json';
import { SkillTooltip } from '@/components/Skill/SkillTooltip';
import { SkillInfobox } from '@/components/Skill/SkillInfobox';
import { getRevision, getSkill } from './getSkill';
import { RemovedFromApiNotice } from '@/components/Notice/RemovedFromApiNotice';
import { pageView } from '@/lib/pageView';
import { parseIcon } from '@/lib/parseIcon';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import { ItemList } from '@/components/ItemList/ItemList';
import { TraitLink } from '@/components/Trait/TraitLink';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { getProfessionColor } from '@/components/Profession/icon';
import { RevisionTable } from '@/components/Revision/table';
import { SkillLink } from '@/components/Skill/SkillLink';

export interface SkillPageComponentProps {
  language: Language,
  skillId: number,
  revisionId?: string,
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


      <Headline id="history">History</Headline>
      <RevisionTable revisions={skill.history.map(({ revision }) => revision)}
        currentRevisionId={revision.id} fixedRevision={fixedRevision}
        link={({ revisionId, children }) => <SkillLink skill={skill} revision={revisionId} icon="none">{children}</SkillLink>}
        diff={({ revisionIdA, revisionIdB, children }) => <Link href={`/skill/diff/${revisionIdA}/${revisionIdB}`}>{children}</Link>}/>


      <Headline id="data">Data</Headline>
      <Json data={data}/>

    </DetailLayout>
  );
};
