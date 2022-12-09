import { FC } from 'react';
import { AchievementCategory, Icon, Language } from '@prisma/client';
import { IconSize } from '../Item/ItemIcon';
import { Link } from '../Link/Link';

export interface AchievementCategoryLinkProps {
  achievementCategory: AchievementCategory & { icon?: Icon | null };
  icon?: IconSize | 'none';
  locale?: Language;
}

export const AchievementCategoryLink: FC<AchievementCategoryLinkProps> = ({ achievementCategory, icon = 32, locale }) => {
  return <Link href={`/achievement/category/${achievementCategory.id}`} item={achievementCategory} icon={icon} locale={locale}/>;
};
