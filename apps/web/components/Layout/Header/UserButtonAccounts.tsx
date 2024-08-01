'use client';

import { useContext, type FC } from 'react';
import { useGw2Accounts } from '../../Gw2Api/use-gw2-accounts';
import { Checkbox } from '@gw2treasures/ui/components/Form/Checkbox';
import { Scope } from '@gw2me/client';
import { Gw2ApiContext, type GetAccountsOptions } from '@/components/Gw2Api/Gw2ApiContext';
import { Button } from '@gw2treasures/ui/components/Form/Button';

const requiredScopes: Scope[] = [];
const optionalScopes: Scope[] = [Scope.Accounts_DisplayName];
const options: GetAccountsOptions = { includeHidden: true };

export const UserButtonAccounts: FC = () => {
  const accounts = useGw2Accounts(requiredScopes, optionalScopes, options);
  const { setHidden } = useContext(Gw2ApiContext);

  if(accounts.loading) {
    return (<Button appearance="menu" disabled icon="loading">Loading accounts…</Button>);
  } else if(accounts.error) {
    return (<div style={{ padding: '8px 16px', color: 'var(--color-error)' }}>Error loading accounts</div>);
  }

  return accounts.accounts.map((account) => (
    <Checkbox key={account.id} checked={!account.hidden} onChange={(hidden) => setHidden(account.id, !hidden)}>
      {account.displayName ?? account.name}
      {account.displayName && (<div style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>{account.name}</div>)}
    </Checkbox>
  ));
};
