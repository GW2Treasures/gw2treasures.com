import { useContext, useEffect, useMemo, useState } from 'react';
import { Gw2ApiContext, type GetAccountsOptions } from './Gw2ApiContext';
import { type Gw2AccountWithHidden } from './types';
import { Scope } from '@gw2me/client';
import { useUser } from '../User/use-user';

type UseGw2AccountsResult =
  | { loading: true }
  | { loading: false, error: true }
  | { loading: false, error: false, accounts: Gw2AccountWithHidden[], scopes: Scope[] }

const loading: Gw2AccountWithHidden[] = [];
const defaultOptionalScopes: Scope[] = [];
const defaultOptions: GetAccountsOptions = {};

// TODO: when using `useGw2Accounts([])`, this will fetch accounts in an infinite loop,
//       because we are passing a new array every time. This should be fixed in this hook.
export function useGw2Accounts(requiredScopes: Scope[], optionalScopes: Scope[] = defaultOptionalScopes, options: GetAccountsOptions = defaultOptions): UseGw2AccountsResult {
  const user = useUser();
  const [accounts, setAccounts] = useState<Gw2AccountWithHidden[]>(loading);
  const { getAccounts, scopes } = useContext(Gw2ApiContext);

  useEffect(() => {
    // wait until the user is loaded
    if(user.loading) {
      return;
    }

    // always require at least `accounts` scope
    const scopes = Array.from(new Set([Scope.Accounts, ...requiredScopes]));

    // get accounts
    getAccounts(scopes, optionalScopes, options).then(setAccounts);
  }, [getAccounts, optionalScopes, options, requiredScopes, user.loading]);

  return useMemo<UseGw2AccountsResult>(() => {
    if(accounts === loading) {
      return { loading: true };
    }

    return { loading: false, error: false, accounts, scopes };
  }, [accounts, scopes]);
}
