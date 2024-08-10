'use client';

import type { FC } from 'react';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { ProgressCell } from '@/components/Achievement/ProgressCell';
import { Icon } from '@gw2treasures/ui';

export const requiredScopes = [Scope.GW2_Progression, Scope.GW2_Unlocks];

export const AccountHomeNodeCell: FC<{ nodeId: string; accountId: string; }> = ({ nodeId, accountId }) => {
  const nodes = useSubscription('home.nodes', accountId);

  if (nodes.loading) {
    return (<td><Skeleton/></td>);
  } else if (nodes.error) {
    return (<td/>);
  }

  const isUnlocked = nodes.data.includes(nodeId);

  return (
    <ProgressCell progress={isUnlocked ? 1 : 0}>
      {isUnlocked && <Icon icon="checkmark"/>}
    </ProgressCell>
  );
};

export const AccountHomeCatCell: FC<{ catId: number; accountId: string; }> = ({ catId, accountId }) => {
  const cats = useSubscription('home.cats', accountId);

  if (cats.loading) {
    return (<td><Skeleton/></td>);
  } else if (cats.error) {
    return (<td/>);
  }

  const isUnlocked = cats.data.includes(catId);

  return (
    <ProgressCell progress={isUnlocked ? 1 : 0}>
      {isUnlocked && <Icon icon="checkmark"/>}
    </ProgressCell>
  );
};
