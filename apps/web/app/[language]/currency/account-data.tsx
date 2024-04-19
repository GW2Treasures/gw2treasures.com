'use client';

import type { FC } from 'react';
import type { HeaderProps } from '@/components/Achievement/AccountAchievementProgress';
import { useGw2Accounts } from '@/components/Gw2Api/use-gw2-accounts';
import { Scope } from '@gw2me/client';
import { useSubscription } from '@/components/Gw2Api/Gw2AccountSubscriptionProvider';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { FormatNumber } from '@/components/Format/FormatNumber';
import { CurrencyValue } from '@/components/Currency/CurrencyValue';

const requiredScopes = [Scope.GW2_Wallet];

export const AccountHeader: FC<HeaderProps> = ({ }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <th align="right" key={account.name}>{account.name}</th>
  ));
};

export const AccountWalletRow: FC<{ currencyId: number; }> = ({ currencyId }) => {
  const accounts = useGw2Accounts(requiredScopes);

  return !accounts.loading && !accounts.error && accounts.accounts.map((account) => (
    <AccountWalletCell key={account.id} currencyId={currencyId} accountId={account.id}/>
  ));
};

const AccountWalletCell: FC<{ currencyId: number; accountId: string; }> = ({ currencyId, accountId }) => {
  const wallet = useSubscription('wallet', accountId);

  if (wallet.loading) {
    return (<td><Skeleton/></td>);
  } else if (wallet.error) {
    return (<td/>);
  }

  const currency = wallet.data.find(({ id }) => id === currencyId);

  return (
    <td align="right">
      <CurrencyValue currencyId={currencyId} value={currency?.value ?? 0}/>
    </td>
  );
};
