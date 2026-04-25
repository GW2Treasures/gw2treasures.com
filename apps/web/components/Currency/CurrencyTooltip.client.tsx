import { type FC, use } from 'react';
import { CurrencyTooltip } from './CurrencyTooltip';
import styles from './CurrencyTooltip.module.css';
import { EntityIcon } from '@/components/Entity/EntityIcon';
import { Gw2Markup } from '../Format/Gw2Markup';

export interface ClientCurrencyTooltipProps {
  tooltip: CurrencyTooltip | Promise<CurrencyTooltip>,
  hideTitle?: boolean,
}

export const ClientCurrencyTooltip: FC<ClientCurrencyTooltipProps> = ({ tooltip: tooltipMaybePromise, hideTitle = false }) => {
  const tooltip = 'then' in tooltipMaybePromise ? use(tooltipMaybePromise) : tooltipMaybePromise;

  return (
    <div>
      {!hideTitle && (
        <div className={styles.title}>
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32}/>)}
          {tooltip.name}
        </div>
      )}

      <Gw2Markup markup={tooltip.description} as="p"/>
    </div>
  );
};
