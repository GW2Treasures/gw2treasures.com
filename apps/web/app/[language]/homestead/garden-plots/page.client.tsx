'use client';

import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { Gw2AccountContext } from '@/components/Gw2Api/Gw2AccountContext';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import type { FC } from 'react';
import { AccountHomeNodeCell } from '../homestead.client';
import { Gw2ApiErrorBadge } from '@/components/Gw2Api/api-error-badge';

export interface GardenPlotAccountRowsProps {
  nodeIds: string[],
}

const requiredScopes = [Scope.GW2_Progression, Scope.GW2_Unlocks];

export const GardenPlotAccountRows: FC<GardenPlotAccountRowsProps> = ({ nodeIds }) => {
  const accounts = useGw2Accounts(requiredScopes);

  if(accounts.loading) {
    return (
      <tr>
        <td><Skeleton/></td>
        {nodeIds.map((id) => <td key={id}><Skeleton/></td>)}
      </tr>
    );
  }

  if(accounts.error) {
    return (
      <tr>
        <td colSpan={nodeIds.length + 1}><Gw2ApiErrorBadge/></td>
      </tr>
    );
  }

  return accounts.accounts.map((account) => (
    <Gw2AccountContext key={account.id} value={account}>
      <tr>
        <td><Gw2AccountName account={account}/></td>
        {nodeIds.map((id) => <AccountHomeNodeCell key={id} nodeId={id}/>)}
      </tr>
    </Gw2AccountContext>
  ));
};
