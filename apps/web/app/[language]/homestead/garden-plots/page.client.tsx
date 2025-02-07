'use client';

import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import type { FC } from 'react';
import { AccountHomeNodeCell } from '../homestead.client';

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
        <td style={{ color: 'var(--color-error)' }} colSpan={nodeIds.length + 1}>Error loading accounts.</td>
      </tr>
    );
  }

  return accounts.accounts.map((account) => (
    <tr key={account.id}>
      <td><Gw2AccountName account={account}/></td>
      {nodeIds.map((id) => <AccountHomeNodeCell key={id} accountId={account.id} nodeId={id}/>)}
    </tr>
  ));
};
