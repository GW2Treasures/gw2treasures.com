/* eslint-disable @next/next/no-img-element */
import type { FC } from 'react';
import styles from './SkillTooltip.module.css';
import { Separator } from '@gw2treasures/ui/components/Layout/Separator';
import { Fact, type SkillTooltip } from './SkillTooltip';
import { EntityIcon } from '../Entity/EntityIcon';

export interface ClientSkillTooltipProps {
  tooltip: SkillTooltip;
  hideTitle?: boolean;
}

export const ClientSkillTooltip: FC<ClientSkillTooltipProps> = ({ tooltip, hideTitle = false }) => {
  return (
    <div>
      {!hideTitle && (
        <div className={styles.title}>
          {tooltip.icon && (<EntityIcon icon={tooltip.icon} size={32} type="skill"/>)}
          {tooltip.name}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: tooltip.description }} className={styles.description}/>
      { /* eslint-disable-next-line react/no-array-index-key */ }
      {tooltip.facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
      {tooltip.facts && tooltip.traited_facts && tooltip.facts?.length > 0 && tooltip.traited_facts?.length > 0 && (<Separator/>)}
      { /* eslint-disable-next-line react/no-array-index-key */ }
      {tooltip.traited_facts?.map((fact, index) => <Fact key={index} fact={fact}/>)}
    </div>
  );
};
