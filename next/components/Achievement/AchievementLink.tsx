import { FC } from 'react';
import { Achievement, Language } from '@prisma/client';
import { IconSize } from '../Item/ItemIcon';
import { Link } from '../Link/Link';
import { WithIcon } from '../../lib/with';

export interface AchievementLinkProps {
  achievement: WithIcon<Achievement>;
  icon?: IconSize | 'none';
  locale?: Language;
}

export const AchievementLink: FC<AchievementLinkProps> = ({ achievement, icon = 32, locale }) => {
  return <Link href={`/achievement/${achievement.id}`} item={achievement} icon={icon} locale={locale}/>;
};
