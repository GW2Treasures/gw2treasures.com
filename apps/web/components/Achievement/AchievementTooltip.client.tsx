import Icon from 'icons/Icon';
import { FC } from 'react';
import { AchievementTooltip } from './AchievementTooltip';

export interface ClientAchievementTooltipProps {
  tooltip: AchievementTooltip;
};

export const ClientAchievementTooltip: FC<ClientAchievementTooltipProps> = ({ tooltip }) => {

  return (
    <div>
      <div style={{ marginBottom: 8, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: tooltip.requirement }}/>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 8, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: tooltip.description }}/>
      {tooltip.points} <Icon icon="achievementPoints"/>
    </div>
  );
};
