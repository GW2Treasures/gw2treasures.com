import { FC } from 'react';
import { Achievement, Language } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '@/lib/with';

export interface AchievementLinkProps {
  achievement: WithIcon<Achievement>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const AchievementLink: FC<AchievementLinkProps> = ({ achievement, icon = 32, language }) => {
  return <EntityLink href={`/achievement/${achievement.id}`} entity={achievement} icon={icon} language={language}/>;
};
