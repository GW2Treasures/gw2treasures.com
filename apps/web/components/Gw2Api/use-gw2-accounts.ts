import { useContext, useEffect, useMemo, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import type { Gw2Account } from './types';
import type { Scope } from '@gw2me/client';
import { useUser } from '../User/use-user';

type UseGw2AccountsResult =
  | { loading: true }
  | { loading: false, error: true }
  | { loading: false, error: false, accounts: Gw2Account[], scopes: Scope[] }

const loading = [] as Gw2Account[];

export function useGw2Accounts(requiredScopes: Scope[]): UseGw2AccountsResult {
  const user = useUser();
  const [accounts, setAccounts] = useState<Gw2Account[]>(loading);
  const { getAccounts, error, scopes } = useContext(Gw2ApiContext);

  useEffect(() => {
    // wait until the user is loaded
    if(user.loading) {
      return;
    }

    getAccounts(requiredScopes).then(setAccounts);
  }, [getAccounts, requiredScopes, user.loading]);

  return useMemo<UseGw2AccountsResult>(() => {
    if(accounts === loading) {
      return { loading: true };
    }

    if(error) {
      return { loading: false, error: true };
    }

    return { loading: false, error: false, accounts, scopes };
  }, [accounts, error, scopes]);
}
