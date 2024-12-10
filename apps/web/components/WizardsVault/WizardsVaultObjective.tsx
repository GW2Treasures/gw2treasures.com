import type { Language, WizardsVaultObjective as Objective } from '@gw2treasures/database';
import type { FC } from 'react';
import { WizardsVaultObjectiveTable } from './WizardsVaultObjectiveTable';
import styles from './WizardsVaultObjective.module.css';
import { localizedName } from '@/lib/localizedName';
import { AstralAcclaim } from '../Format/AstralAcclaim';
import { Waypoint } from '../Waypoint/Waypoint';

interface WizardsVaultObjectiveProps {
  objective: Objective,
  language: Language,
  disabledLoginNotification?: boolean,
}

export const WizardsVaultObjective: FC<WizardsVaultObjectiveProps> = ({ objective, language, disabledLoginNotification }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.objective}>
        <div className={styles.title}>
          {localizedName(objective, language)}
          {objective.waypointId && <Waypoint id={objective.waypointId}/>}
        </div>
        <div className={styles.aa}><AstralAcclaim value={objective.acclaim}/></div>
      </div>

      <WizardsVaultObjectiveTable objectiveId={objective.id} disabledLoginNotification={disabledLoginNotification}/>
    </div>
  );
};
