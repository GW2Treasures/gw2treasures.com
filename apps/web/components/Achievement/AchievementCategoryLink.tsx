import { FC } from 'react';
import { AchievementCategory, Language } from '@gw2treasures/database';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '@/lib/with';
import { LocalizedEntity } from '@/lib/localizedName';

export interface AchievementCategoryLinkProps {
  achievementCategory: WithIcon<LocalizedEntity> & Pick<AchievementCategory, 'id'>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const AchievementCategoryLink: FC<AchievementCategoryLinkProps> = ({ achievementCategory, icon = 32, language }) => {
  return <EntityLink href={`/achievement/category/${achievementCategory.id}`} entity={achievementCategory} icon={icon} language={language}/>;
};
