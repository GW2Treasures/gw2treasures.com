import type { FC } from 'react';
import type { AchievementCategory, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { LocalizedEntity } from '@/lib/localizedName';

export interface AchievementCategoryLinkProps {
  achievementCategory: WithIcon<LocalizedEntity> & Pick<AchievementCategory, 'id'>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const AchievementCategoryLink: FC<AchievementCategoryLinkProps> = ({ achievementCategory, icon = 32, language }) => {
  return <EntityLink href={`/achievement/category/${achievementCategory.id}`} entity={achievementCategory} icon={icon} language={language}/>;
};
