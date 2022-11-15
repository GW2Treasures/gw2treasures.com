import { FC } from 'react';
import { Icon, Language, Skill } from '@prisma/client';
import { IconSize, SkillIcon } from './SkillIcon';
import { Link } from '../Link/Link';

export interface SkillLinkProps {
  skill: Skill & { icon?: Icon | null };
  icon?: IconSize | 'none';
  locale?: Language;
}

export const SkillLink: FC<SkillLinkProps> = ({ skill, icon = 32, locale }) => {
  return <Link href={`/skill/${skill.id}`} item={skill} icon={(icon && icon !== 'none' && skill.icon) ? <SkillIcon size={icon} icon={skill.icon}/> : 'none'} locale={locale}/>;
};
