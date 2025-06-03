'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscription } from '@/components/Gw2Api/use-gw2-subscription';
import { getResetDate } from '@/components/Reset/ResetTimer';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import type { EncounterId } from '@gw2treasures/static-data/raids/index';
import { Icon } from '@gw2treasures/ui';
import type { FC } from 'react';

export const requiredScopes = [
  Scope.GW2_Account,
  Scope.GW2_Progression,
];

export interface RaidClearCellProps {
  accountId: string,
  eventId: EncounterId,
}

export const RaidClearCell: FC<RaidClearCellProps> = ({ accountId, eventId }) => {
  const account = useSubscription('account', accountId);
  const raids = useSubscription('raids', accountId);

  if(account.loading || raids.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(account.error || raids.error) {
    return (
      <td style={{ color: 'var(--color-error)' }}>Could not load raid clears</td>
    );
  }

  const accountLastModified = new Date(account.data.last_modified);
  const lastReset = getResetDate('last-weekly');

  const hasCleared = accountLastModified >= lastReset && raids.data.includes(eventId);

  return (
    <ProgressCell progress={hasCleared ? 1 : 0}>
      {hasCleared && (<Icon icon="checkmark"/>)}
    </ProgressCell>
  );
};
