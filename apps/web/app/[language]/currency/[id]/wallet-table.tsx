'use client';

import type { FC } from 'react';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import type { Gw2Account } from '@/components/Gw2Api/types';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Scope } from '@gw2me/client';
import { Table } from '@gw2treasures/ui/components/Table/Table';
import { Gw2AccountName } from '@/components/Gw2Api/Gw2AccountName';

interface WalletTableProps {
  currencyId: number;
}

const requiredScopes = [Scope.GW2_Wallet];

export const WalletTable: FC<WalletTableProps> = ({ currencyId }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return (
    <Table width="auto">
      <thead>
        <tr>
          <th>Account</th>
          <th align="right">Wallet</th>
        </tr>
      </thead>
      <tbody>
        {accounts.loading ? (
          <tr>
            <td><Skeleton/></td>
            <td/>
          </tr>
        ) : accounts.error ? (
          <tr>
            <td colSpan={2} style={{ color: 'var(--color-error)' }}>Error loading accounts.</td>
          </tr>
        ) : accounts.accounts.map((account) => (
          <WalletTableAccountRow key={account.id} currencyId={currencyId} account={account}/>
        ))}
      </tbody>
    </Table>
  );
};

interface WalletTableAccountRowProps {
  currencyId: number;
  account: Gw2Account
}

export const WalletTableAccountRow: FC<WalletTableAccountRowProps> = ({ currencyId, account }) => {
  const wallet = useSubscription('wallet', account.id);
  const currency = !wallet.loading && !wallet.error
    ? wallet.data.find(({ id }) => id === currencyId)
    : undefined;

  return (
    <tr>
      <td><Gw2AccountName account={account}/></td>
      <td align="right">
        {wallet.loading ? (
          <Skeleton/>
        ) : wallet.error ? (
          <span style={{ color: 'var(--color-error)' }}>Error loading wallet.</span>
        ) : (
          <CurrencyValue currencyId={currencyId} value={currency?.value ?? 0}/>
        )}
      </td>
    </tr>
  );
};
