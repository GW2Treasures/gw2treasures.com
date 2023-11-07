import { useContext, useEffect, useState } from 'react';
import { Gw2ApiContext } from './Gw2ApiContext';
import type { Gw2Account } from './types';

export function useGw2Accounts() {
  const [accounts, setAccounts] = useState<Gw2Account[]>([]);
  const { getAccounts } = useContext(Gw2ApiContext);

  useEffect(() => {
    getAccounts().then(setAccounts);
  }, [getAccounts]);

  return accounts;
}
