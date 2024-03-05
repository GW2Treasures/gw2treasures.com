import { useContext, useEffect, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import type { Gw2Account } from './types';
import type { Scope } from '@gw2me/client';
import { useUser } from '../User/use-user';

type UseGw2AccountsResult =
  | { loading: true }
  | { loading: false, error: true }
  | { loading: false, error: false, accounts: Gw2Account[] }

export function useGw2Accounts(requiredScopes: Scope[]): UseGw2AccountsResult {
  const user = useUser();
  const [state, setState] = useState<UseGw2AccountsResult>({ loading: true });
  const { getAccounts } = useContext(Gw2ApiContext);

  useEffect(() => {
    // wait until the user is loaded
    if(user.loading) {
      return;
    }

    getAccounts(requiredScopes)
      .then((accounts) => setState({ loading: false, error: false, accounts }))
      .catch(() => setState({ loading: false, error: true }));
  }, [getAccounts, requiredScopes, user.loading]);

  return state;
}
