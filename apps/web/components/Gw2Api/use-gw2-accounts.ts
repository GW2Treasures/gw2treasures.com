import { useContext, useEffect, useMemo, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import { type Gw2Account } from './types';
import { Scope } from '@gw2me/client';
import { useUser } from '../User/use-user';

type UseGw2AccountsResult =
  | { loading: true }
  | { loading: false, error: true }
  | { loading: false, error: false, accounts: Gw2Account[], scopes: Scope[] }

const loading = [] as Gw2Account[];

export function useGw2Accounts(requiredScopes: Scope[], optionalScopes: Scope[] = []): UseGw2AccountsResult {
  const user = useUser();
  const [accounts, setAccounts] = useState<Gw2Account[]>(loading);
  const { getAccounts, scopes } = useContext(Gw2ApiContext);

  useEffect(() => {
    // wait until the user is loaded
    if(user.loading) {
      return;
    }

    // always require at least the `account` permission
    const scopes = Array.from(new Set([Scope.GW2_Account, ...requiredScopes]));

    // get accounts
    getAccounts(scopes, optionalScopes).then(setAccounts);
  }, [getAccounts, optionalScopes, requiredScopes, user.loading]);

  return useMemo<UseGw2AccountsResult>(() => {
    if(accounts === loading) {
      return { loading: true };
    }

    return { loading: false, error: false, accounts, scopes };
  }, [accounts, scopes]);
}
