import { FC } from 'react';
import { AchievementCategory, Language } from '@prisma/client';
import { IconSize } from '@/lib/getIconUrl';
import { Link } from '../Link/Link';
import { WithIcon } from '@/lib/with';

export interface AchievementCategoryLinkProps {
  achievementCategory: WithIcon<AchievementCategory>;
  icon?: IconSize | 'none';
  locale?: Language;
}

export const AchievementCategoryLink: FC<AchievementCategoryLinkProps> = ({ achievementCategory, icon = 32, locale }) => {
  return <Link href={`/achievement/category/${achievementCategory.id}`} item={achievementCategory} icon={icon} locale={locale}/>;
};
