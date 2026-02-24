import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import type { FC } from 'react';
import { EntityIcon } from '../Entity/EntityIcon';
import { Fact } from './TraitFact';
import type { TraitTooltip } from './TraitTooltip';
import styles from './TraitTooltip.module.css';
import { Gw2Markup } from '../Format/Gw2Markup';

export interface ClientTraitTooltipProps {
  tooltip: TraitTooltip,
  hideTitle?: boolean,
}

export const ClientTraitTooltip: FC<ClientTraitTooltipProps> = ({ tooltip, hideTitle = false }) => {
  return (
    <div>
      {!hideTitle && (
        <div className={styles.title}>
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32} type={tooltip.slot === 'Major' ? 'trait-major' : 'trait-minor'}/>)}
          {tooltip.name}
        </div>
      )}
      <div className={styles.description}><Gw2Markup markup={tooltip.description}/></div>
      { /* eslint-disable-next-line react/no-array-index-key */ }
      {tooltip.facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
      {tooltip.facts && tooltip.traited_facts && tooltip.facts?.length > 0 && tooltip.traited_facts?.length > 0 && (<Separator/>)}
      { /* eslint-disable-next-line react/no-array-index-key */ }
      {tooltip.traited_facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
    </div>
  );
};
