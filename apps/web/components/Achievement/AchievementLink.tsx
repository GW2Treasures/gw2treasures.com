import { FC } from 'react';
import { Achievement, Language } from '@gw2treasures/database';
import { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import { WithIcon } from '@/lib/with';
import { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';
import { Tooltip } from '../Tooltip/Tooltip';
import { AchievementLinkTooltip } from './AchievementLinkTooltip';

export interface AchievementLinkProps {
  achievement: WithIcon<Pick<Achievement, 'id' | keyof LocalizedEntity>>;
  icon?: IconSize | 'none';
  language?: Language;
}

export const AchievementLink: FC<AchievementLinkProps> = ({ achievement, icon = 32, language }) => {
  const entity = getLinkProperties(achievement);

  return (
    <Tooltip content={<AchievementLinkTooltip achievement={entity} language={language}/>}>
      <EntityLink href={`/achievement/${achievement.id}`} entity={entity} icon={icon} language={language}/>
    </Tooltip>
  );
};
