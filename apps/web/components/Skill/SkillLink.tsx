import type { FC } from 'react';
import type { Language, Skill } from '@gw2treasures/database';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { IconSize } from '@/lib/getIconUrl';
import type { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';
import { Tooltip } from '../Tooltip/Tooltip';
import { SkillLinkTooltip } from './SkillLinkTooltip';

export interface SkillLinkProps {
  skill: WithIcon<Pick<Skill, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
  revision?: string;
}

export const SkillLink: FC<SkillLinkProps> = ({ skill, icon = 32, language, revision }) => {
  const entity = getLinkProperties(skill);

  return (
    <Tooltip content={<SkillLinkTooltip skill={entity} language={language} revision={revision}/>}>
      <EntityLink href={`/skill/${entity.id}${revision ? `/${revision}` : ''}`} entity={entity} icon={icon} iconType="skill" language={language}/>
    </Tooltip>
  );
};
