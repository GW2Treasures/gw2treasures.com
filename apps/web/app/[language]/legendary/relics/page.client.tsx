import { AccountAchievementProgressCell, type AccountAchievementProgressCellProps } from '@/components/Achievement/AccountAchievementProgress';
import type { FC } from 'react';
import type { RelicSet } from '../helper';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Tip } from '@gw2treasures/ui/components/Tip/Tip';
import { Icon } from '@gw2treasures/ui';

export interface RelicUnlockCellProps extends AccountAchievementProgressCellProps {
  set: RelicSet | undefined
}

export const RelicUnlockCell: FC<RelicUnlockCellProps> = ({ set, ...props }) => {
  if(set?.type === 'Core') {
    return <ProgressCell progress={1}><Tip tip="Always unlocked"><Icon icon="checkmark"/></Tip></ProgressCell>;
  }

  // TODO check `/v2/account.access` if account has access to SotO
  if(set?.type === 'SotO') {
    return <ProgressCell progress={1}><Tip tip="Requires SotO"><Icon icon="checkmark"/></Tip></ProgressCell>;
  }

  return (
    <AccountAchievementProgressCell {...props}/>
  );
};
