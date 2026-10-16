'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';
import { useGw2Account } from '@/components/Gw2Api/use-gw2-account';
import { useSubscriptionWithReset } from '@/components/Gw2Api/use-gw2-subscription';
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
  path: DungeonPathId,
}

export const DungeonDailyCell: FC<DungeonDailyCellProps> = ({ path }) => {
  const { id: accountId } = useGw2Account();
  const dungeons = useSubscriptionWithReset('dungeons', accountId, 'last-daily', []);

  if(dungeons.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(dungeons.error) {
    return (
      <td><Gw2ApiErrorBadge/></td>
    );
  }

  const hasCleared = dungeons.data.includes(path);

  return (
    <ProgressCell progress={hasCleared ? 1 : 0}>
      {hasCleared && (<Icon icon="checkmark"/>)}
    </ProgressCell>
  );
};
