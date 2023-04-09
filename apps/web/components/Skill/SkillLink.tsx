import { FC } from 'react';
import { Language, Skill } from '@gw2treasures/database';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '../../lib/with';
import { IconSize } from '@/lib/getIconUrl';

export interface SkillLinkProps {
  skill: WithIcon<Skill>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const SkillLink: FC<SkillLinkProps> = ({ skill, icon = 32, language }) => {
  return <EntityLink href={`/skill/${skill.id}`} entity={skill} icon={icon} iconType="skill" language={language}/>;
};
