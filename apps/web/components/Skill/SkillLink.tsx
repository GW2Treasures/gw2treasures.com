import type { FC } from 'react';
import type { Language, Skill } from '@gw2treasures/database';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { IconSize } from '@/lib/getIconUrl';
import type { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';

export interface SkillLinkProps {
  skill: WithIcon<Pick<Skill, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const SkillLink: FC<SkillLinkProps> = ({ skill, icon = 32, language }) => {
  const entity = getLinkProperties(skill);

  return <EntityLink href={`/skill/${entity.id}`} entity={entity} icon={icon} iconType="skill" language={language}/>;
};
