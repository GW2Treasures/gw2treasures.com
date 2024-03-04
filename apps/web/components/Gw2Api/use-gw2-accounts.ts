import { useContext, useEffect, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import type { Gw2Account } from './types';
import type { Scope } from '@gw2me/client';

export function useGw2Accounts(requiredScopes: Scope[]) {
  const [accounts, setAccounts] = useState<Gw2Account[]>([]);
  const { getAccounts } = useContext(Gw2ApiContext);

  useEffect(() => {
    getAccounts(requiredScopes).then(setAccounts);
  }, [getAccounts, requiredScopes]);

  return accounts;
}
