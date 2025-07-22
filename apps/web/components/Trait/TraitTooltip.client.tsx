import type { FC } from 'react';
import styles from './TraitTooltip.module.css';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { Fact, type TraitTooltip } from './TraitTooltip';
import { EntityIcon } from '../Entity/EntityIcon';
import { format } from 'gw2-tooltip-html';

export interface ClientTraitTooltipProps {
  tooltip: TraitTooltip;
  hideTitle?: boolean;
}

export const ClientTraitTooltip: FC<ClientTraitTooltipProps> = ({ tooltip, hideTitle = false }) => {
  return (
    <div>
      {!hideTitle && (
        <div className={styles.title}>
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32}/>)}
          {tooltip.name}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: format(tooltip.description) }} className={styles.description}/>
      { /* eslint-disable-next-line react/no-array-index-key */ }
      {tooltip.facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
      {tooltip.facts && tooltip.traited_facts && tooltip.facts?.length > 0 && tooltip.traited_facts?.length > 0 && (<Separator/>)}
      { /* eslint-disable-next-line react/no-array-index-key */ }
      {tooltip.traited_facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
    </div>
  );
};
