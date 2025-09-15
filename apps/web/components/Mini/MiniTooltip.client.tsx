import type { FC } from 'react';
import { MiniTooltip } from './MiniTooltip';
import styles from './MiniTooltip.module.css';
import { EntityIcon } from '../Entity/EntityIcon';

export interface ClientMiniTooltipProps {
  tooltip: MiniTooltip,
  hideTitle?: boolean,
}

export const ClientMiniTooltip: FC<ClientMiniTooltipProps> = ({ tooltip, hideTitle = false }) => {
  if(hideTitle && !tooltip.description) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {!hideTitle && (
        <div className={styles.title}>
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32}/>)}
          {tooltip.name}
        </div>
      )}

      {tooltip.description && (
        <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: tooltip.description }}/>
      )}
    </div>
  );
};
