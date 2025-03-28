import { use, type FC } from 'react';
import { AchievementTooltip } from './AchievementTooltip';
import { AchievementPoints } from './AchievementPoints';
import { EntityIcon } from '../Entity/EntityIcon';
import styles from './AchievementTooltip.module.css';

export interface ClientAchievementTooltipProps {
  tooltip: AchievementTooltip | Promise<AchievementTooltip>,
  fallbackIcon?: { id: number, signature: string } | null,
  hideTitle?: boolean,
}

export const ClientAchievementTooltip: FC<ClientAchievementTooltipProps> = ({ tooltip, fallbackIcon, hideTitle = false }) => {
  tooltip = 'then' in tooltip ? use(tooltip) : tooltip;

  const icon = tooltip.icon ?? fallbackIcon;

  return (
    <div>
      {!hideTitle && (
        <div className={styles.title}>
          {icon && (<EntityIcon icon={icon} size={32}/>)}
          {tooltip.name}
        </div>
      )}

      <div style={{ marginBottom: 8, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: tooltip.requirement }}/>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 8, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: tooltip.description }}/>
      <AchievementPoints points={tooltip.points}/>
    </div>
  );
};
