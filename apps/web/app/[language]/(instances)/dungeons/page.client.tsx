'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { getResetDate } from '@/components/Reset/ResetTimer';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import type { DungeonPathId } from '@gw2treasures/static-data/dungeons/index';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';

export const requiredScopes = [
  Scope.GW2_Account,
  Scope.GW2_Progression,
];

export interface DungeonDailyCellProps {
  accountId: string,
  path: DungeonPathId,
}

export const DungeonDailyCell: FC<DungeonDailyCellProps> = ({ accountId, path }) => {
  const account = useSubscription('account', accountId);
  const dungeons = useSubscription('dungeons', accountId);

  if(account.loading || dungeons.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(account.error || dungeons.error) {
    return (
      <td style={{ color: 'var(--color-error)' }}>Could not load dungeon clears</td>
    );
  }

  const accountLastModified = new Date(account.data.last_modified);
  const lastReset = getResetDate('last-daily');

  const hasCleared = accountLastModified >= lastReset && dungeons.data.includes(path);

  return (
    <ProgressCell progress={hasCleared ? 1 : 0}>
      {hasCleared && (<Icon icon="checkmark"/>)}
    </ProgressCell>
  );
};
