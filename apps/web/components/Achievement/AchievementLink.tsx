import type { FC, ReactNode } from 'react';
import type { Achievement, Language } from '@gw2treasures/database';
import type { IconSize } from '@/lib/getIconUrl';
import { EntityLink } from '../Link/EntityLink';
import type { WithIcon } from '@/lib/with';
import type { LocalizedEntity } from '@/lib/localizedName';
import { getLinkProperties } from '@/lib/linkProperties';
import { Tooltip } from '../Tooltip/Tooltip';
import { AchievementLinkTooltip } from './AchievementLinkTooltip';

export interface AchievementLinkProps {
  achievement: WithIcon<Pick<Achievement, 'id' | keyof LocalizedEntity>>,
  icon?: IconSize | 'none',
  language?: Language,
  children?: ReactNode,
}

export const AchievementLink: FC<AchievementLinkProps> = ({ achievement, icon = 32, language, children }) => {
  const entity = getLinkProperties(achievement);

  return (
    <Tooltip content={<AchievementLinkTooltip achievement={entity} language={language}/>}>
      <EntityLink href={`/achievement/${achievement.id}`} entity={entity} icon={icon} language={language}>
        {children}
      </EntityLink>
    </Tooltip>
  );
};
