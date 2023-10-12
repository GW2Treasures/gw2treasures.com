import { FC } from 'react';
import { AchievementTooltip } from './AchievementTooltip';
import { AchievementPoints } from './AchievementPoints';

export interface ClientAchievementTooltipProps {
  tooltip: AchievementTooltip;
};

export const ClientAchievementTooltip: FC<ClientAchievementTooltipProps> = ({ tooltip }) => {

  return (
    <div>
      <div style={{ marginBottom: 8, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: tooltip.requirement }}/>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 8, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: tooltip.description }}/>
      <AchievementPoints points={tooltip.points}/>
    </div>
  );
};
