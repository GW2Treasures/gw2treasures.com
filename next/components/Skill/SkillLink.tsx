import { FC } from 'react';
import { Language, Skill } from '@prisma/client';
import { SkillIcon } from './SkillIcon';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '../../lib/with';
import { IconSize } from '@/lib/getIconUrl';

export interface SkillLinkProps {
  skill: WithIcon<Skill>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const SkillLink: FC<SkillLinkProps> = ({ skill, icon = 32, language }) => {
  return <EntityLink href={`/skill/${skill.id}`} entity={skill} icon={(icon && icon !== 'none' && skill.icon) ? <SkillIcon size={icon} icon={skill.icon}/> : 'none'} language={language}/>;
};
