import type { FC } from 'react';
import { SkinTooltip } from './SkinTooltip';
import { Rarity } from '../Item/Rarity';
import styles from './SkinTooltip.module.css';
import { EntityIcon } from '../Entity/EntityIcon';
import { Gw2Markup } from '../Format/Gw2Markup';

export interface ClientSkinTooltipProps {
  tooltip: SkinTooltip,
  hideTitle?: boolean,
}

export const ClientSkinTooltip: FC<ClientSkinTooltipProps> = ({ tooltip, hideTitle = false }) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {!hideTitle && (
        <div className={styles.title}>
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32}/>)}
          {tooltip.name}
        </div>
      )}

      {tooltip.description && (
        <div style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}><Gw2Markup markup={tooltip.description}/></div>
      )}
      <div><Rarity rarity={tooltip.rarity.value}>{tooltip.rarity.label}</Rarity></div>
      <div>{tooltip.type}</div>
      {tooltip.weight && (<div>{tooltip.weight}</div>)}
    </div>
  );
};
