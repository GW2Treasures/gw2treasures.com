import { FC } from 'react';
import { Achievement, Icon, Language, Skin } from '@prisma/client';
import { IconSize } from '../Item/ItemIcon';
import { Link } from '../Link/Link';

export interface AchievementLinkProps {
  achievement: Achievement & { icon?: Icon | null };
  icon?: IconSize | 'none';
  locale?: Language;
}

export const AchievementLink: FC<AchievementLinkProps> = ({ achievement, icon = 32, locale }) => {
  return <Link href={`/achievement/${achievement.id}`} item={achievement} icon={icon} locale={locale}/>;
};
