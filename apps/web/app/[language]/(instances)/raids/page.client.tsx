'use client';

import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { useSubscriptionWithReset } from '@/components/Gw2Api/use-gw2-subscription';
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
  const raids = useSubscriptionWithReset('raids', accountId, 'last-weekly', []);

  if(raids.loading) {
    return (
      <td><Skeleton/></td>
    );
  }

  if(raids.error) {
    return (
      <td style={{ color: 'var(--color-error)' }}>Could not load raid clears</td>
    );
  }

  const hasCleared = raids.data.includes(eventId);

  return (
    <ProgressCell progress={hasCleared ? 1 : 0}>
      {hasCleared && (<Icon icon="checkmark"/>)}
    </ProgressCell>
  );
};
